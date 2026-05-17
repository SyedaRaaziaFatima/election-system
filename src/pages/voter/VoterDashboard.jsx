import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MainLayout } from '../../layouts/MainLayout'
import { votingService } from '../../services/votingService'
import { Card } from '../../components/Card'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../utils/helpers'
import { Button } from '../../components/Button'

export const VoterDashboard = () => {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRegistrations = async () => {
      if (!user) return
      const { data } = await votingService.getVoterRegistrations(user.id)
      setRegistrations(data || [])
      setLoading(false)
    }
    loadRegistrations()
  }, [user])

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Voter Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your elections, view voting status and track results.</p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : registrations.length === 0 ? (
            <Card>
              <p className="text-center text-gray-600 dark:text-gray-400">You haven't joined any elections yet.</p>
              <div className="mt-4 text-center">
                <Link to="/elections">
                  <Button>Browse Elections</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {registrations.map((registration) => (
                <Card key={registration.id} className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-semibold">{registration.elections?.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{registration.elections?.description}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm text-gray-500">
                    <p>Registered: {formatDate(registration.created_at)}</p>
                    <p>Ends: {formatDate(registration.elections?.end_time)}</p>
                    <p>Status: {registration.status}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/vote/${registration.election_id}`}>
                      <Button size="sm">Vote</Button>
                    </Link>
                    <Link to={`/results/${registration.election_id}`}>
                      <Button variant="outline" size="sm">View Results</Button>
                    </Link>
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
