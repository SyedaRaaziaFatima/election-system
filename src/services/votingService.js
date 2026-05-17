/**
 * Voting Service
 * Handles all voting-related operations
 */

import { supabase } from '../lib/supabaseClient'

export const votingService = {
  /**
   * Register voter for election
   */
  async registerVoter(voterId, electionId) {
    try {
      // Check if already registered
      const { data: existing } = await supabase
        .from('voter_registrations')
        .select('id')
        .eq('voter_id', voterId)
        .eq('election_id', electionId)
        .single()

      if (existing) {
        return { data: null, error: 'Already registered for this election' }
      }

      // Registration flow: check max voters and registration deadline
      const { data: election } = await supabase.from('elections').select('max_voters, registration_deadline, status').eq('id', electionId).single()
      if (!election) return { data: null, error: 'Election not found' }
      if (election.status !== 'draft' && election.status !== 'scheduled' && election.status !== 'active') return { data: null, error: 'Election not open for registration' }
      if (election.registration_deadline && new Date() > new Date(election.registration_deadline)) return { data: null, error: 'Registration closed' }

      const { count: registeredCount, error: countError } = await supabase
        .from('voter_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('election_id', electionId)

      if (countError) throw countError

      const currentCount = registeredCount ?? 0
      const cap = election.max_voters

      let registrationStatus = 'registered'
      if (typeof cap === 'number' && Number.isFinite(cap) && cap >= 0 && currentCount >= cap) {
        registrationStatus = 'waitlisted'
      }

      // Register voter
      const { data, error } = await supabase
        .from('voter_registrations')
        .insert({
          voter_id: voterId,
          election_id: electionId,
          status: registrationStatus,
        })
        .select()

      if (error) throw error

      // Generate secret ID
      const secretData = await this.generateSecretId(electionId, voterId)

      return { data: { registration: data[0], secret: secretData }, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  /**
   * Generate secret ID for voter
   */
  async generateSecretId(electionId, voterId) {
    try {
      const secretCode = this.generateSecretCode()

      const { data, error } = await supabase
        .from('secret_ids')
        .insert({
          election_id: electionId,
          voter_id: voterId,
          secret_code: secretCode,
        })
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error generating secret ID:', error)
      return null
    }
  },

  /**
   * Generate unique secret code
   */
  generateSecretCode() {
    const prefix = 'POLL'
    const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26))
    const numbers = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
    return `${prefix}-${letters}-${numbers}`
  },

  /**
   * Cast vote
   */
  async castVote(electionId, candidateId, secretId) {
    try {
      // Use a server-side RPC to perform an atomic vote + mark secret used
      const { data, error } = await supabase.rpc('cast_vote', {
        p_election_id: electionId,
        p_candidate_id: candidateId,
        p_secret_id: secretId,
      })

      if (error) {
        return { data: null, error: error.message || error }
      }

      // data is an array-like result from the RPC
      const vote = Array.isArray(data) ? data[0] : data

      // Audit log (best-effort)
      try {
        const admin = await import('./adminService')
        await admin.adminService.logAudit(vote?.voter_id || null, 'VOTE_CAST', { election_id: electionId, candidate_id: candidateId })
      } catch (e) {
        console.warn('Audit log failed:', e)
      }

      return { data: vote || null, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  /**
   * Subscribe to realtime vote events for an election.
   * onEvent will be called with the payload when an insert/update occurs.
   * Returns an unsubscribe function.
   */
  subscribeToResults(electionId, onEvent) {
    // Prefer channel-based API (Supabase JS v2)
    try {
      if (supabase.channel) {
        const chan = supabase
          .channel(`public:votes:election_${electionId}`)
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'votes', filter: `election_id=eq.${electionId}` },
            (payload) => onEvent(payload)
          )
          .subscribe()

        return () => {
          try { chan.unsubscribe() } catch (e) { console.warn('unsubscribe error', e) }
        }
      }
    } catch (e) {
      console.warn('Realtime channel not available:', e)
    }

    // Fallback to older realtime API
    try {
      const sub = supabase
        .from(`votes:election_id=eq.${electionId}`)
        .on('INSERT', (payload) => onEvent(payload))
        .subscribe()

      return () => {
        try { supabase.removeSubscription(sub) } catch (e) { console.warn('removeSubscription failed', e) }
      }
    } catch (e) {
      console.warn('Realtime subscription fallback failed:', e)
      return () => {}
    }
  },

  /**
   * Get voter registrations
   */
  async getVoterRegistrations(voterId) {
    try {
      const { data, error } = await supabase
        .from('voter_registrations')
        .select('*, elections(*)')
        .eq('voter_id', voterId)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  /**
   * Get election results
   */
  async getElectionResults(electionId) {
    try {
      const { data: votes, error: votesError } = await supabase
        .from('votes')
        .select('candidate_id')
        .eq('election_id', electionId)

      if (votesError) throw votesError

      const { data: candidates, error: candidatesError } = await supabase
        .from('candidates')
        .select('*')
        .eq('election_id', electionId)

      if (candidatesError) throw candidatesError

      // Calculate results
      const results = candidates.map(candidate => ({
        ...candidate,
        votes: votes.filter(v => v.candidate_id === candidate.id).length,
      }))

      const totalVotes = votes.length

      return { 
        data: {
          candidates: results,
          totalVotes,
          winner: results.reduce((prev, current) => 
            (prev.votes > current.votes) ? prev : current
          ),
        }, 
        error: null 
      }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  /**
   * Check if voter can vote
   */
  async canVote(voterId, electionId) {
    try {
      // Check registration
      const { data: registration } = await supabase
        .from('voter_registrations')
        .select('id')
        .eq('voter_id', voterId)
        .eq('election_id', electionId)
        .single()

      if (!registration) {
        return { canVote: false, reason: 'Not registered' }
      }

      // Check if already voted
      const { data: hasVoted } = await supabase
        .from('secret_ids')
        .select('id')
        .eq('voter_id', voterId)
        .eq('election_id', electionId)
        .eq('has_voted', true)
        .single()

      if (hasVoted) {
        return { canVote: false, reason: 'Already voted' }
      }

      return { canVote: true }
    } catch (error) {
      return { canVote: false, reason: error.message }
    }
  },
}
