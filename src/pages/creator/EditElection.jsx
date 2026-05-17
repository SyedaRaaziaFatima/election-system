import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { MainLayout } from '../../layouts/MainLayout'
import { electionService } from '../../services/electionService'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Input } from '../../components/Input'
import { Alert } from '../../components/Alert'

const categories = ['Presidential', 'Parliamentary', 'Local', 'Corporate', 'Community']

export const EditElection = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: categories[0],
      start_time: '',
      end_time: '',
      registration_deadline: '',
      max_voters: 100,
      status: 'scheduled',
    },
  })

  useEffect(() => {
    const loadElection = async () => {
      const { data, error } = await electionService.getElectionById(id)
      if (error) {
        setMessage({ type: 'error', text: error })
      } else if (data) {
        reset({
          title: data.title,
          description: data.description,
          category: data.category || categories[0],
          start_time: data.start_time?.slice(0, 16),
          end_time: data.end_time?.slice(0, 16),
          registration_deadline: data.registration_deadline?.slice(0, 16) || data.start_time?.slice(0, 16),
          max_voters: data.max_voters,
          status: data.status,
        })
      }
      setLoading(false)
    }
    loadElection()
  }, [id, reset])

  const onSubmit = async (values) => {
    setLoading(true)
    setMessage(null)

    const updates = {
      ...values,
      max_voters: Number(values.max_voters),
    }

    const { data, error } = await electionService.updateElection(id, updates)
    if (error) {
      setMessage({ type: 'error', text: error })
    } else {
      setMessage({ type: 'success', text: 'Election updated successfully.' })
      setTimeout(() => navigate(`/election/${data.id}`), 1200)
    }
    setLoading(false)
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Edit Election</h1>
            <p className="text-gray-600 dark:text-gray-400">Update election details before launch.</p>
          </div>

          {message && <Alert type={message.type} message={message.text} />}

          {loading ? (
            <Card><div className="py-12"><p className="text-center">Loading election...</p></div></Card>
          ) : (
            <Card>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                <Input
                  label="Election Title"
                  {...register('title', { required: 'Title is required' })}
                  error={errors.title?.message}
                />

                <Input
                  label="Description"
                  type="text"
                  {...register('description', { required: 'Description is required' })}
                  error={errors.description?.message}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                    <select
                      {...register('category')}
                      className="input-focus w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                    <select
                      {...register('status')}
                      className="input-focus w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    label="Start Date"
                    type="datetime-local"
                    {...register('start_time', { required: 'Start time is required' })}
                    error={errors.start_time?.message}
                  />
                  <Input
                    label="End Date"
                    type="datetime-local"
                    {...register('end_time', { required: 'End time is required' })}
                    error={errors.end_time?.message}
                  />
                </div>

                <Input
                  label="Registration Deadline"
                  type="datetime-local"
                  {...register('registration_deadline')}
                  error={errors.registration_deadline?.message}
                />

                <Input
                  label="Max Voters"
                  type="number"
                  min="10"
                  {...register('max_voters', { required: 'Max voters is required', min: { value: 10, message: 'At least 10 voters' } })}
                  error={errors.max_voters?.message}
                />

                <Button type="submit" loading={loading} className="w-full">Save Changes</Button>
              </form>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
