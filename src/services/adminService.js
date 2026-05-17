/**
 * Admin Service
 * Handles all admin-related operations
 */

import { supabase } from '../lib/supabaseClient'

export const adminService = {
  /**
   * Get election requests
   */
  async getElectionRequests(status = null) {
    try {
      let query = supabase
        .from('election_requests')
        .select('*, profiles!election_requests_creator_id_fkey(*)')
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  /**
   * Approve election request
   */
  async approveRequest(requestId, userId) {
    try {
      // Update request status
      const { error: updateError } = await supabase
        .from('election_requests')
        .update({ status: 'approved' })
        .eq('id', requestId)

      if (updateError) throw updateError

      // Update user role to creator
      const { error: roleError } = await supabase
        .from('profiles')
        .update({ role: 'creator' })
        .eq('id', userId)

      if (roleError) throw roleError

      // Log audit
      await this.logAudit(userId, 'ELECTION_REQUEST_APPROVED')

      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  /**
   * Reject election request
   */
  async rejectRequest(requestId, userId, reason) {
    try {
      // Update request status
      const { error: updateError } = await supabase
        .from('election_requests')
        .update({ status: 'rejected', rejection_reason: reason })
        .eq('id', requestId)

      if (updateError) throw updateError

      // Log audit
      await this.logAudit(userId, 'ELECTION_REQUEST_REJECTED')

      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  /**
   * Get audit logs
   */
  async getAuditLogs(limit = 100) {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*, profiles!audit_logs_user_id_fkey(*)')
        .order('timestamp', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  /**
   * Log audit event
   */
  async logAudit(userId, action, details = null) {
    try {
      await supabase.from('audit_logs').insert({
        user_id: userId,
        action,
        details,
      })
    } catch (error) {
      console.error('Error logging audit:', error)
    }
  },

  /**
   * Get analytics
   */
  async getAnalytics() {
    try {
      // Use head:true to fetch counts without data payload
      const { count: totalUsers, error: usersError } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      if (usersError) throw usersError

      const { count: totalElections, error: electionsError } = await supabase.from('elections').select('*', { count: 'exact', head: true })
      if (electionsError) throw electionsError

      const { count: activeElections, error: activeError } = await supabase.from('elections').select('*', { count: 'exact', head: true }).eq('status', 'active')
      if (activeError) throw activeError

      const { count: totalVotes, error: votesError } = await supabase.from('votes').select('*', { count: 'exact', head: true })
      if (votesError) throw votesError

      return {
        data: {
          totalUsers: totalUsers || 0,
          totalElections: totalElections || 0,
          activeElections: activeElections || 0,
          totalVotes: totalVotes || 0,
        },
        error: null,
      }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  /**
   * Get all users
   */
  async getUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  /**
   * Update user role
   */
  async updateUserRole(userId, role) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },
}
