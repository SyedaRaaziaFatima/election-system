import { useEffect, useState } from 'react'
import { MainLayout } from '../../layouts/MainLayout'
import { adminService } from '../../services/adminService'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { Card } from '../../components/Card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b']

export const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true)
      const { data, error } = await adminService.getAnalytics()
      if (error) setError(error)
      else setAnalytics(data)
      setLoading(false)
    }
    loadAnalytics()
  }, [])

  const chartData = analytics ? [
    { label: 'Users', value: analytics.totalUsers || 0 },
    { label: 'Elections', value: analytics.totalElections || 0 },
    { label: 'Active', value: analytics.activeElections || 0 },
    { label: 'Votes', value: analytics.totalVotes || 0 },
  ] : []

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Admin Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Real-time system KPIs and election activity overview.</p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <Card>{error}</Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="space-y-4">
                <h2 className="text-2xl font-semibold">Key Metrics</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Users</span>
                    <span className="text-2xl font-bold text-primary-500">{analytics.totalUsers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Elections</span>
                    <span className="text-2xl font-bold text-secondary-500">{analytics.totalElections}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Elections</span>
                    <span className="text-2xl font-bold text-green-500">{analytics.activeElections}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Votes</span>
                    <span className="text-2xl font-bold text-blue-500">{analytics.totalVotes}</span>
                  </div>
                </div>
              </Card>

              <Card className="h-full">
                <h2 className="text-2xl font-semibold mb-6">Traffic Overview</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                    <XAxis dataKey="label" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="h-full">
                <h2 className="text-2xl font-semibold mb-6">Resource Distribution</h2>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="label" outerRadius={110} innerRadius={55} paddingAngle={6}>
                      {chartData.map((entry, index) => (
                        <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
