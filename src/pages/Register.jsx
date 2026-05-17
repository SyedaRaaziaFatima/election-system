import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { authService } from '../services/authService'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Alert } from '../components/Alert'
import { MainLayout } from '../layouts/MainLayout'

export const Register = () => {
  const navigate = useNavigate()
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const handleRegister = async (values) => {
    setMessage(null)
    setLoading(true)

    const { error } = await authService.signup(values.email, values.password, values.fullName)

    if (error) {
      setMessage({ type: 'error', text: error })
    } else {
      setMessage({ type: 'success', text: 'Signup successful! Redirecting to dashboard...' })
      setTimeout(() => navigate('/dashboard'), 1200)
    }

    setLoading(false)
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary-500/10 via-secondary-500/5 to-primary-600/10 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">Create Account</h1>
            <p className="text-gray-600 dark:text-gray-400">Join VoteSecure today</p>
          </div>

          <div className="glass p-8 rounded-2xl backdrop-blur-xl">
            {message && <Alert type={message.type} message={message.text} />}

            <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                icon={User}
                {...register('fullName', { required: 'Full name is required' })}
                error={errors.fullName?.message}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                })}
                error={errors.email?.message}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
                error={errors.password?.message}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === watch('password') || 'Passwords do not match',
                })}
                error={errors.confirmPassword?.message}
                required
              />

              <Button type="submit" loading={loading} className="w-full" icon={ArrowRight}>
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-500 hover:text-primary-600 font-semibold">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}
