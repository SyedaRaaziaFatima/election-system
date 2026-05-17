import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { electionService } from '../services/electionService'
import { Card } from '../components/Card'
import { MainLayout } from '../layouts/MainLayout'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Link } from 'react-router-dom'
import { formatDate, getElectionStatus, profileDisplayName } from '../utils/helpers'
import { Clock, Users } from 'lucide-react'

export const Elections = () => {
  const [elections, setElections] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchElections = async () => {
      const { data } = await electionService.getElections()
      setElections(data || [])
      setLoading(false)
    }
    fetchElections()
  }, [])

  const filteredElections = elections.filter(election => {
    if (filter === 'all') return true
    return getElectionStatus(election.start_time, election.end_time) === filter
  })

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Elections</h1>

        {/* Filter */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {['all', 'upcoming', 'active', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition-all capitalize ${
                filter === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Elections Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredElections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredElections.map((election, i) => {
              const status = getElectionStatus(election.start_time, election.end_time)
              return (
                <motion.div
                  key={election.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/election/${election.id}`}>
                    <Card hover className="h-full">
                      <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          status === 'upcoming' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {status}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2">{election.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{election.description}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-primary-500" />
                          <span>Ends: {formatDate(election.end_time)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-primary-500" />
                          <span>Max voters: {election.max_voters}</span>
                        </div>
                        <div className="text-gray-500">
                          By: {profileDisplayName(election.profiles)}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">No elections found</p>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              There are no elections available yet. If you are an admin or creator, add a new election from the dashboard. Otherwise, check back later for upcoming voting events.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/"
                className="px-5 py-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
              >
                Back to Home
              </Link>
              <Link
                to="/dashboard"
                className="px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
