import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Lock, TrendingUp, Users, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { electionService } from '../services/electionService'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { MainLayout } from '../layouts/MainLayout'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { formatDate, profileDisplayName } from '../utils/helpers'

export const Home = () => {
  const [elections, setElections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchElections = async () => {
      const { data } = await electionService.getElections({ status: 'active' })
      setElections(data?.slice(0, 3) || [])
      setLoading(false)
    }
    fetchElections()
  }, [])

  const features = [
    { icon: Lock, title: 'Secure Voting', description: 'End-to-end encrypted voting system' },
    { icon: Zap, title: 'Fast & Reliable', description: 'Lightning-fast results and real-time updates' },
    { icon: TrendingUp, title: 'Analytics', description: 'Detailed voting analytics and reports' },
    { icon: Users, title: 'Multi-Role', description: 'Admin, Creator, and Voter roles' },
  ]

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 bg-gradient-to-br from-primary-600/20 via-secondary-600/10 to-primary-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Secure Online</span>
              <br />
              <span>Election Management</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Experience the future of democratic voting with VoteSecure - a comprehensive, transparent, and secure online election management system.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/register">
                <Button size="lg" icon={ArrowRight}>
                  Get Started
                </Button>
              </Link>
              <Link to="/elections">
                <Button variant="outline" size="lg">
                  View Elections
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <feature.icon className="w-12 h-12 text-primary-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Elections */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold gradient-text">Active Elections</h2>
            <Link to="/elections">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : elections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {elections.map(election => (
                <Link key={election.id} to={`/election/${election.id}`}>
                  <Card hover className="h-full">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">{election.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{election.description}</p>
                    <div className="space-y-2 text-sm">
                      <p><strong>Creator:</strong> {profileDisplayName(election.profiles)}</p>
                      <p><strong>Status:</strong> <span className="text-green-500">Active</span></p>
                      <p><strong>Ends:</strong> {formatDate(election.end_time)}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No active elections at the moment</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Voting?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of voters using VoteSecure for transparent elections</p>
          <Link to="/register">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
              Register Now
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  )
}
