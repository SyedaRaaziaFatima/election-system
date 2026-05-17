import { useEffect, useState } from 'react'
import { MainLayout } from '../../layouts/MainLayout'
import { adminService } from '../../services/adminService'
import { Card } from '../../components/Card'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { Button } from '../../components/Button'
import { Alert } from '../../components/Alert'
import { useAuth } from '../../context/AuthContext'
import { profileDisplayName } from '../../utils/helpers'

export const AdminUsers = () => {
  const { profile } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      const { data, error } = await adminService.getUsers()
      if (error) setMessage({ type: 'error', text: error })
      else setUsers(data || [])
      setLoading(false)
    }
    loadUsers()
  }, [])

  const handleRoleChange = async (userId, role) => {
    const { error } = await adminService.updateUserRole(userId, role)
    if (error) {
      setMessage({ type: 'error', text: error })
    } else {
      setMessage({ type: 'success', text: 'Role updated successfully.' })
      setUsers(users.map((user) => (user.id === userId ? { ...user, role } : user)))
    }
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Manage Users</h1>
            <p className="text-gray-600 dark:text-gray-400">View all registered users and update access roles.</p>
          </div>

          {message && <Alert type={message.type} message={message.text} />}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid gap-4">
              {users.map((user) => (
                <Card key={user.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold">{profileDisplayName(user)}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-500 mt-1">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="voter">Voter</option>
                      <option value="creator">Creator</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button size="sm" onClick={() => handleRoleChange(user.id, user.role)}>Save</Button>
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
