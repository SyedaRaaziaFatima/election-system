import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { electionService } from '../services/electionService'
import { votingService } from '../services/votingService'
import { Card } from '../components/Card'
import { MainLayout } from '../layouts/MainLayout'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Button } from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { formatDate, getTimeRemaining, profileDisplayName } from '../utils/helpers'
import { User, Award, Clock } from 'lucide-react'
import { Alert } from '../components/Alert'

export const ElectionDetails = () => {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const [election, setElection] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: electionData } = await electionService.getElectionById(id)
      setElection(electionData)

      const { data: candidatesData } = await electionService.getCandidates(id)
      setCandidates(candidatesData || [])

      if (user) {
        const registrations = await votingService.getVoterRegistrations(user.id)
        setIsRegistered(registrations.data?.some(r => r.election_id === id))
      }

      setLoading(false)
    }
    fetchData()
  }, [id, user])

  const handleRegister = async () => {
    if (!user) {
      setMessage({ type: 'error', text: 'Please login first' })
      return
    }

    const { error } = await votingService.registerVoter(user.id, id)
    if (error) {
      setMessage({ type: 'error', text: error })
    } else {
      setMessage({ type: 'success', text: 'Registered successfully!' })
      setIsRegistered(true)
    }
  }

  if (loading) return <MainLayout><LoadingSpinner /></MainLayout>

  if (!election) return <MainLayout><div className="text-center py-12"><p>Election not found</p></div></MainLayout>

  const timeInfo = getTimeRemaining(election.end_time)

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {message && (
          <Alert 
            type={message.type} 
            message={message.text}
            onClose={() => setMessage(null)}
            className="mb-6"
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">{election.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{election.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <div className="flex items-center gap-2">
                  <Clock className="text-primary-500" size={24} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Time Remaining</p>
                    <p className="font-semibold">{timeInfo.text}</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className="font-semibold capitalize">{election.status}</p>
                </div>
              </Card>
              <Card>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Max Voters</p>
                  <p className="font-semibold">{election.max_voters}</p>
                </div>
              </Card>
              <Card>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Creator</p>
                  <p className="font-semibold">{profileDisplayName(election.profiles)}</p>
                </div>
              </Card>
            </div>

            {user && !isRegistered && election.status === 'active' && (
              <Button onClick={handleRegister} size="lg">
                Join Election
              </Button>
            )}
            {isRegistered && (
              <Link to={`/vote/${id}`}>
                <Button size="lg">Vote Now</Button>
              </Link>
            )}
          </div>

          {/* Candidates */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Candidates</h2>
            {candidates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((candidate, i) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card>
                      {candidate.photo_url && (
                        <img 
                          src={candidate.photo_url} 
                          alt={candidate.name}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="text-lg font-semibold mb-1">{candidate.name}</h3>
                      <p className="text-sm text-primary-500 mb-3">{candidate.designation}</p>
                      <p className="text-gray-600 dark:text-gray-400">{candidate.manifesto}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No candidates added yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}
