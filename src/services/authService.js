/**
 * Authentication Service
 * Handles all auth-related operations with Supabase
 */

import { supabase } from '../lib/supabaseClient'

const isMissingProfilesTableError = (error) => {
  const message = error?.message?.toLowerCase() || ''
  return message.includes("could not find table") || message.includes('relation "profiles" does not exist')
}

const authRedirectUrl = import.meta.env.VITE_SUPABASE_AUTH_REDIRECT_URL || undefined

export const authService = {
  /**
   * Sign up with email and password
   */
  async signup(email, password, fullName) {
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'voter',
          },
          emailRedirectTo: authRedirectUrl,
        },
      })

      if (signUpError) throw signUpError

      if (signUpData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: signUpData.user.id,
            email,
            full_name: fullName,
            role: 'voter',
          })

        if (profileError && !isMissingProfilesTableError(profileError)) {
          throw profileError
        }

        if (profileError) {
          console.warn('Supabase profiles table is missing. Signup succeeded, but profile row could not be created.', profileError)
        }
      }

      let data = signUpData
      if (!signUpData.session && signUpData.user) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) throw signInError
        data = signInData
      }

      return { data, error: null }
    } catch (error) {
      const friendlyMessage = error?.message?.toLowerCase().includes('email rate limit exceeded')
        ? 'Email send limit reached. Please wait a few minutes and try again, or use a different email address.'
        : error.message

      return { data: null, error: friendlyMessage }
    }
  },

  /**
   * Sign in with email and password
   */
  async signin(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data?.user) {
        const profile = await this.getUserProfile(data.user.id)
        if (!profile) {
          await this.createUserProfile(data.user)
        }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  /**
   * Sign out current user
   */
  async signout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return data?.session?.user || null
    } catch (error) {
      console.error('Error fetching current user:', error)
      return null
    }
  },

  /**
   * Get user profile
   */
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (isMissingProfilesTableError(error)) {
          console.warn('Supabase profiles table is missing. Returning null profile.', error)
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  },

  async createUserProfile(user) {
    if (!user?.id) return null

    try {
      const profileData = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Voter',
        role: user.user_metadata?.role || 'voter',
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' })
        .select()
        .single()

      if (error) {
        if (isMissingProfilesTableError(error)) {
          console.warn('Supabase profiles table is missing. Cannot create profile.', error)
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Error creating profile:', error)
      return null
    }
  },

  /**
   * Reset password
   */
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  /**
   * Update password
   */
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        callback(session)
      }
    )
    return subscription
  },
}
