import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '../../layouts/MainLayout'
import { adminService } from '../../services/adminService'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { Alert } from '../../components/Alert'
import { useAuth } from '../../context/AuthContext'
import { profileDisplayName } from '../../utils/helpers'

export const AdminApprovals = () => {
  const { profile } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true)
      const { data, error } = await adminService.getElectionRequests('pending')
      if (error) {
        setMessage({ type: 'error', text: error })
      } else {
        setRequests(data || [])
      }
      setLoading(false)
    }
    loadRequests()
  }, [])

  const refresh = async () => {
    const { data, error } = await adminService.getElectionRequests('pending')
    if (error) {
      setMessage({ type: 'error', text: error })
    } else {
      setRequests(data || [])
    }
  }

  const handleApprove = async (request) => {
    const { error } = await adminService.approveRequest(request.id, request.creator_id)
    if (error) {
      setMessage({ type: 'error', text: error })
    } else {
      setMessage({ type: 'success', text: 'Request approved successfully.' })
      refresh()
    }
  }

  const handleReject = async (request) => {
    const reason = window.prompt('Enter rejection reason')
    if (!reason) return
    const { error } = await adminService.rejectRequest(request.id, request.creator_id, reason)
    if (error) {
      setMessage({ type: 'error', text: error })
    } else {
      setMessage({ type: 'success', text: 'Request rejected successfully.' })
      refresh()
    }
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text">Approvals</h1>
              <p className="text-gray-600 dark:text-gray-400">Review creator requests and manage approvals.</p>
            </div>
            <Button onClick={refresh}>Refresh Requests</Button>
          </div>

          {message && <Alert type={message.type} message={message.text} />}

          {loading ? (
            <LoadingSpinner />
          ) : requests.length === 0 ? (
            <Card>No pending requests at the moment.</Card>
          ) : (
            <div className="grid gap-6">
              {requests.map((request) => (
                <Card key={request.id}>
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-primary-500 font-semibold">{request.status}</p>
                      <h2 className="text-2xl font-semibold mt-2">{request.organization}</h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">{request.purpose}</p>
                      <p className="text-sm text-gray-500 mt-3">Submitted by <strong>{profileDisplayName(request.profiles)}</strong> ({request.profiles?.email})</p>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                      <Button variant="secondary" onClick={() => handleReject(request)}>Reject</Button>
                      <Button onClick={() => handleApprove(request)}>Approve</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
