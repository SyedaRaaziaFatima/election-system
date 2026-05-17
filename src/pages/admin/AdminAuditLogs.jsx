import { useEffect, useState } from 'react'
import { MainLayout } from '../../layouts/MainLayout'
import { adminService } from '../../services/adminService'
import { Card } from '../../components/Card'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { Alert } from '../../components/Alert'
import { profileDisplayName } from '../../utils/helpers'

export const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true)
      const { data, error } = await adminService.getAuditLogs(75)
      if (error) setError(error)
      else setLogs(data || [])
      setLoading(false)
    }
    loadLogs()
  }, [])

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Audit Logs</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor system actions and track administrator events.</p>
          </div>

          {error && <Alert type="error" message={error} />}

          {loading ? (
            <LoadingSpinner />
          ) : logs.length === 0 ? (
            <Card>No audit events found.</Card>
          ) : (
            <div className="grid gap-4">
              {logs.map((log) => (
                <Card key={log.id} className="space-y-3">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <span className="text-sm uppercase tracking-wide text-primary-500 font-semibold">{log.action}</span>
                    <span className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{log.details ? JSON.stringify(log.details) : 'No details available'}</p>
                  <p className="text-sm text-gray-500">User: {profileDisplayName(log.profiles) || 'System'} ({log.profiles?.email || 'unknown'})</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
