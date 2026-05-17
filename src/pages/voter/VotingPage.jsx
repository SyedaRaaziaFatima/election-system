import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MainLayout } from '../../layouts/MainLayout'
import { electionService } from '../../services/electionService'
import { votingService } from '../../services/votingService'
import { useAuth } from '../../context/AuthContext'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { Alert } from '../../components/Alert'
import { Input } from '../../components/Input'
import { formatDate } from '../../utils/helpers'

export const VotingPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [election, setElection] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [secretCode, setSecretCode] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      const { data: electionData } = await electionService.getElectionById(id)
      const { data: candidateData } = await electionService.getCandidates(id)
      setElection(electionData)
      setCandidates(candidateData || [])
      setLoading(false)
    }
    loadData()
  }, [id])

  const handleVote = async () => {
    if (!user) {
      setMessage({ type: 'error', text: 'Please login before voting.' })
      return
    }
    if (!selectedCandidate) {
      setMessage({ type: 'error', text: 'Please pick a candidate.' })
      return
    }
    if (!secretCode) {
      setMessage({ type: 'error', text: 'Enter your secret voting code.' })
      return
    }

    setSubmitting(true)
    const { data, error } = await votingService.castVote(id, selectedCandidate, secretCode)
    if (error) {
      setMessage({ type: 'error', text: error })
    } else {
      setMessage({ type: 'success', text: 'Vote cast successfully.' })
      setTimeout(() => navigate(`/results/${id}`), 1200)
    }
    setSubmitting(false)
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Cast Your Vote</h1>
            <p className="text-gray-600 dark:text-gray-400">Select a candidate and submit your anonymous ballot.</p>
          </div>

          {message && <Alert type={message.type} message={message.text} />}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <Card className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold">{election?.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{election?.description}</p>
                  <p className="text-sm text-gray-500 mt-3">Ends: {formatDate(election?.end_time)}</p>
                </div>
                <div className="space-y-4">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      onClick={() => setSelectedCandidate(candidate.id)}
                      className={`cursor-pointer rounded-2xl border p-4 ${selectedCandidate === candidate.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-gray-200 dark:border-gray-700'}`}
                    >
                      <h3 className="text-xl font-semibold">{candidate.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.designation}</p>
                      <p className="mt-2 text-gray-500 dark:text-gray-300">{candidate.manifesto}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold">Voting Details</h3>
                  <p className="text-gray-600 dark:text-gray-400">Use the secret ID you received after registration.</p>
                </div>

                <Input
                  label="Secret Vote Code"
                  placeholder="POLL-A-0001"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                />

                <Button className="w-full" loading={submitting} onClick={handleVote}>
                  Submit Vote
                </Button>
              </Card>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
