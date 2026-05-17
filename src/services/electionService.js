/**
 * Election Service
 * Handles all election-related operations
 */

import { supabase } from '../lib/supabaseClient'
import { adminService } from './adminService'

export const electionService = {
  /**
   * Create a new election
   */
  async createElection(electionData) {
    try {
      const { data, error } = await supabase
        .from('elections')
        .insert(electionData)
        .select()

      if (error) throw error
      // Audit log
      try { await adminService.logAudit(electionData.creator_id, 'ELECTION_CREATED', { election_id: data[0].id }) } catch (e) { console.warn(e) }
      return { data: data[0], error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  /**
   * Get all elections
   */
  async getElections(filters = {}) {
    try {
      let query = supabase
        .from('elections')
        .select('*, profiles!elections_creator_id_fkey(*)')
        .order('created_at', { ascending: false })

      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.creator_id) {
        query = query.eq('creator_id', filters.creator_id)
      }

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  /**
   * Get election by ID
   */
  async getElectionById(id) {
    try {
      const { data, error } = await supabase
        .from('elections')
        .select('*, profiles!elections_creator_id_fkey(*)')
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  /**
   * Update election
   */
  async updateElection(id, updates) {
    try {
      const { data, error } = await supabase
        .from('elections')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      // Audit log (try to extract creator from updates or leave null)
      try { await adminService.logAudit(updates.creator_id || (data[0] && data[0].creator_id) || null, 'ELECTION_UPDATED', { election_id: id }) } catch (e) { console.warn(e) }
      return { data: data[0], error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  /**
   * Delete election
   */
  async deleteElection(id) {
    try {
      const { data: deleted, error } = await supabase
        .from('elections')
        .delete()
        .eq('id', id)

      if (error) throw error
      try { await adminService.logAudit(deleted?.[0]?.creator_id || null, 'ELECTION_DELETED', { election_id: id }) } catch (e) { console.warn(e) }
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  /**
   * Get election candidates
   */
  async getCandidates(electionId) {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('election_id', electionId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  /**
   * Add candidate
   */
  async addCandidate(candidateData) {
    try {
      // If a photo file is provided, upload to storage and set photo_url
      if (candidateData.photoFile) {
        try {
          const file = candidateData.photoFile
          const ext = file.name.split('.').pop()
          const key = `${candidateData.election_id}/${Date.now()}-${Math.random().toString(36).substring(2,8)}.${ext}`
          const { error: uploadError } = await supabase.storage.from('candidates').upload(key, file, { cacheControl: '3600', upsert: false })
          if (uploadError) throw uploadError
          const { data: publicUrlData } = supabase.storage.from('candidates').getPublicUrl(key)
          candidateData.photo_url = publicUrlData.publicUrl
        } catch (upErr) {
          console.warn('Candidate photo upload failed', upErr)
        }
      }

      const { data, error } = await supabase
        .from('candidates')
        .insert(candidateData)
        .select()

      if (error) throw error
      try { await adminService.logAudit(candidateData.creator_id || null, 'CANDIDATE_ADDED', { candidate_id: data[0].id, election_id: candidateData.election_id }) } catch (e) { console.warn(e) }
      return { data: data[0], error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  /**
   * Update candidate
   */
  async updateCandidate(id, updates) {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      return { data: data[0], error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  /**
   * Delete candidate
   */
  async deleteCandidate(id) {
    try {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },
}
