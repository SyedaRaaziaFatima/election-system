import { useState, useEffect } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { adminService } from '../services/adminService'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Card } from '../components/Card'
import { electionService } from '../services/electionService'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export const Dashboard = () => {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)
  const [elections, setElections] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (profile?.role === 'admin') {
        const { data } = await adminService.getAnalytics()
        setAnalytics(data)
      } else if (profile?.role === 'creator') {
        const { data } = await electionService.getElections({ creator_id: user.id })
        setElections(data || [])
      }
      setLoading(false)
    }
    fetchData()
  }, [user, profile])

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold gradient-text capitalize">{profile?.role || 'User'} Dashboard</h1>

        {!profile ? (
          <div className="rounded-xl border border-red-200 bg-red-50/80 p-6 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            <h2 className="text-2xl font-semibold mb-2">Profile not loaded</h2>
            <p className="text-sm leading-7">
              We could not load your profile details. Please refresh the page or sign out and sign in again.
              If the issue persists, check your Supabase profile record and ensure your user row exists in the `profiles` table.
            </p>
          </div>
        ) : (
          <>
            {profile.role === 'admin' && analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <p className="text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-3xl font-bold text-primary-500">{analytics.totalUsers || 0}</p>
            </Card>
            <Card>
              <p className="text-gray-600 dark:text-gray-400">Total Elections</p>
              <p className="text-3xl font-bold text-secondary-500">{analytics.totalElections || 0}</p>
            </Card>
            <Card>
              <p className="text-gray-600 dark:text-gray-400">Active Elections</p>
              <p className="text-3xl font-bold text-green-500">{analytics.activeElections || 0}</p>
            </Card>
            <Card>
              <p className="text-gray-600 dark:text-gray-400">Total Votes</p>
              <p className="text-3xl font-bold text-blue-500">{analytics.totalVotes || 0}</p>
            </Card>
          </div>
        )}

        {profile?.role === 'creator' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Elections</h2>
            {elections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {elections.map(election => (
                  <Card key={election.id}>
                    <h3 className="text-lg font-semibold mb-2">{election.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{election.description}</p>
                    <div className="space-y-1 text-sm">
                      <p><strong>Status:</strong> {election.status}</p>
                      <p><strong>Max Voters:</strong> {election.max_voters}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4">
                      <Link to={`/creator/election/${election.id}/edit`}>
                        <Button size="sm" variant="outline">Edit</Button>
                      </Link>
                      {election.status !== 'active' && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={async () => {
                            const confirmPub = window.confirm('Publish this election and make it active?')
                            if (!confirmPub) return
                            const { error } = await electionService.updateElection(election.id, { status: 'active' })
                            if (error) return alert('Publish failed: ' + error)
                            // refresh list
                            const { data } = await electionService.getElections({ creator_id: user.id })
                            setElections(data || [])
                          }}
                        >
                          Publish
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={async () => {
                          const confirmDel = window.confirm('Delete this election? This cannot be undone.')
                          if (!confirmDel) return
                          const { error } = await electionService.deleteElection(election.id)
                          if (error) return alert('Delete failed: ' + error)
                          const { data } = await electionService.getElections({ creator_id: user.id })
                          setElections(data || [])
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">You haven't created any elections yet</p>
            )}
          </div>
        )}

        {profile?.role === 'voter' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Elections</h2>
            <p className="text-gray-600 dark:text-gray-400">Join an election to start voting</p>
          </div>
        )}
      </>
        )}
      </div>
    </DashboardLayout>
  )
}
