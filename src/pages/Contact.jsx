import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { MainLayout } from '../layouts/MainLayout'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Alert } from '../components/Alert'
import { contactService } from '../services/contactService'

export const Contact = () => {
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: '', email: '', subject: '', message: '' } })

  const onSubmit = async (values) => {
    setMessage(null)
    setLoading(true)

    try {
      await contactService.sendMessage(values)
      setMessage({ type: 'success', text: 'Your message has been sent successfully.' })
      reset()
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Unable to send message at this time.' })
    }

    setLoading(false)
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-center mb-16 gradient-text">Contact Us</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-8">Get in Touch</h2>
            <div className="space-y-6">
              <Card>
                <div className="flex items-start gap-4">
                  <Mail className="text-primary-500 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <a href="mailto:support@votesecure.com" className="text-primary-500 hover:text-primary-600">
                      support@votesecure.com
                    </a>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <Phone className="text-secondary-500 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <a href="tel:+1234567890" className="text-primary-500 hover:text-primary-600">
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <MapPin className="text-green-500 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold mb-2">Address</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      123 Main Street<br />
                      City, Country 12345
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              {message && <Alert type={message.type} message={message.text} className="mb-4" />}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Name"
                  type="text"
                  placeholder="Your name"
                  {...register('name', { required: 'Name is required' })}
                  error={errors.name?.message}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                  })}
                  error={errors.email?.message}
                  required
                />

                <Input
                  label="Subject"
                  type="text"
                  placeholder="How can we help?"
                  {...register('subject', { required: 'Subject is required' })}
                  error={errors.subject?.message}
                  required
                />

                <Input
                  label="Message"
                  as="textarea"
                  placeholder="Your message..."
                  rows={5}
                  {...register('message', { required: 'Message is required' })}
                  error={errors.message?.message}
                  required
                />

                <Button type="submit" loading={loading} className="w-full" icon={Send}>
                  Send Message
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}
