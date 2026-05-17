import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MainLayout } from '../../layouts/MainLayout'
import { votingService } from '../../services/votingService'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { Card } from '../../components/Card'
import { Alert } from '../../components/Alert'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

export const ResultsPage = () => {
  const { id } = useParams()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadResults = async () => {
      const { data, error } = await votingService.getElectionResults(id)
      if (error) setError(error)
      else setResults(data)
      setLoading(false)
    }
    loadResults()
    // Subscribe to realtime updates and refresh results on change
    const unsubscribe = votingService.subscribeToResults(id, async () => {
      const { data } = await votingService.getElectionResults(id)
      setResults(data)
    })

    return () => {
      try { unsubscribe && unsubscribe() } catch (e) { console.warn(e) }
    }
  }, [id])

  const chartData = results?.candidates.map((candidate) => ({ name: candidate.name, votes: candidate.votes })) || []

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Live Results</h1>
            <p className="text-gray-600 dark:text-gray-400">Track turnout and candidate performance in real-time.</p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <Alert type="error" message={error} />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <Card className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold">Candidate Votes</h2>
                  <p className="text-gray-600 dark:text-gray-400">Total votes cast: {results.totalVotes}</p>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold">Winner</h2>
                  <p className="text-gray-600 dark:text-gray-400">Top performer based on votes.</p>
                </div>
                {results.winner ? (
                  <div className="space-y-4">
                    <div className="rounded-3xl bg-primary-50 dark:bg-primary-500/10 p-6">
                      <p className="text-sm text-gray-500">Winner</p>
                      <h3 className="text-3xl font-bold mt-2">{results.winner.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300">Votes: {results.winner.votes}</p>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={chartData} dataKey="votes" nameKey="name" innerRadius={55} outerRadius={100} paddingAngle={5}>
                          {chartData.map((entry, index) => (
                            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No winner yet. Waiting for every vote to count.</p>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
