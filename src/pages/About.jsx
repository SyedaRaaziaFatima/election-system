import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { ArrowRight, CheckCircle, Users, BarChart3 } from 'lucide-react'

export const About = () => {
  const stats = [
    { icon: Users, label: 'Active Users', value: '10K+' },
    { icon: BarChart3, label: 'Elections Held', value: '500+' },
    { icon: CheckCircle, label: 'Votes Cast', value: '1M+' },
  ]

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-bold mb-6 gradient-text">About VoteSecure</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            We're building the future of democratic voting with transparency, security, and accessibility at our core.
          </p>
        </motion.section>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {stats.map((stat, i) => (
            <Card key={i}>
              <stat.icon className="w-12 h-12 text-primary-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">{stat.label}</p>
              <p className="text-4xl font-bold gradient-text">{stat.value}</p>
            </Card>
          ))}
        </motion.div>

        {/* Mission */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 gradient-text">Our Mission</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              To democratize voting and make elections accessible, transparent, and secure for everyone, everywhere.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              We believe that every voice matters. VoteSecure is committed to providing a platform where every voter can participate confidently, knowing their vote is secure and their privacy is protected.
            </p>
          </div>
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold mb-6">Ready to Vote?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of voters using VoteSecure</p>
          <Link to="/register">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600" icon={ArrowRight}>
              Get Started
            </Button>
          </Link>
        </motion.section>
      </div>
    </MainLayout>
  )
}
