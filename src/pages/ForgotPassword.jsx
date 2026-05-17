import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { authService } from '../services/authService'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Alert } from '../components/Alert'
import { MainLayout } from '../layouts/MainLayout'

export const ForgotPassword = () => {
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '' } })

  const handleReset = async (values) => {
    setMessage(null)
    setLoading(true)

    const { error } = await authService.resetPassword(values.email)
    if (error) {
      setMessage({ type: 'error', text: error })
    } else {
      setSuccess(true)
      setMessage({ type: 'success', text: 'Check your email for reset instructions.' })
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
            <h1 className="text-4xl font-bold gradient-text mb-2">Reset Password</h1>
            <p className="text-gray-600 dark:text-gray-400">We'll send you a link to reset your password</p>
          </div>

          <div className="glass p-8 rounded-2xl backdrop-blur-xl">
            {message && <Alert type={message.type} message={message.text} />}

            {success ? (
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex justify-center"
                >
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </motion.div>
                <h2 className="text-2xl font-semibold">Check Your Email</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  We've sent a password reset link to the email you provided.
                </p>
                <Link to="/login">
                  <Button className="w-full">Back to Login</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(handleReset)} className="space-y-4">
                <Input
                  label="Email Address"
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

                <Button type="submit" loading={loading} className="w-full" icon={ArrowRight}>
                  Send Reset Link
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Remember your password?{' '}
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
