import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Alert } from '../components/Alert'
import { MainLayout } from '../layouts/MainLayout'

export const Login = () => {
  const navigate = useNavigate()
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const { refreshAuth } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '' } })

  const handleLogin = async (values) => {
    setMessage(null)
    setLoading(true)

    const { error } = await authService.signin(values.email, values.password)

    if (error) {
      setMessage({ type: 'error', text: error })
    } else {
      await refreshAuth()
      setMessage({ type: 'success', text: 'Login successful! Redirecting to dashboard...' })
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
            <h1 className="text-4xl font-bold gradient-text mb-2">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-400">Login to your account</p>
          </div>

          <div className="glass p-8 rounded-2xl backdrop-blur-xl">
            {message && <Alert type={message.type} message={message.text} />}

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
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
                {...register('password', { required: 'Password is required' })}
                error={errors.password?.message}
                required
              />

              <Link to="/forgot-password" className="text-sm text-primary-500 hover:text-primary-600">
                Forgot password?
              </Link>

              <Button type="submit" loading={loading} className="w-full" icon={ArrowRight}>
                Login
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-500 hover:text-primary-600 font-semibold">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}
