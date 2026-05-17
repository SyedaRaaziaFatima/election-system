import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '../../layouts/MainLayout'
import { electionService } from '../../services/electionService'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Input } from '../../components/Input'
import { Alert } from '../../components/Alert'

const categories = ['Presidential', 'Parliamentary', 'Local', 'Corporate', 'Community']

export const CreateElection = () => {
  const { user } = useAuth()
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

  const onSubmit = async (values) => {
    setLoading(true)
    setMessage(null)

    const payload = {
      ...values,
      creator_id: user?.id,
      max_voters: Number(values.max_voters),
      start_time: values.start_time,
      end_time: values.end_time,
      registration_deadline: values.registration_deadline || values.start_time,
    }

    const { data, error } = await electionService.createElection(payload)
    if (error) {
      setMessage({ type: 'error', text: error })
    } else {
      setMessage({ type: 'success', text: 'Election created successfully.' })
      setTimeout(() => navigate(`/election/${data.id}`), 1200)
    }
    setLoading(false)
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Create Election</h1>
            <p className="text-gray-600 dark:text-gray-400">Build a secure election and invite voters with confidence.</p>
          </div>

          {message && <Alert type={message.type} message={message.text} />}

          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
              <Input
                label="Election Title"
                {...register('title', { required: 'Title is required' })}
                error={errors.title?.message}
                placeholder="Board election 2026"
              />

              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Category"
                  as="select"
                  {...register('category')}
                  error={errors.category?.message}
                  className="w-full"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Input>
                <Input
                  label="Status"
                  as="select"
                  {...register('status')}
                  className="w-full"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </Input>
              </div>

              <Input
                label="Description"
                type="text"
                placeholder="Describe the goals of the election"
                {...register('description', { required: 'Description is required' })}
                error={errors.description?.message}
              />

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
                label="Maximum Voters"
                type="number"
                min="10"
                {...register('max_voters', { required: 'Max voters is required', min: { value: 10, message: 'Minimum 10 voters' } })}
                error={errors.max_voters?.message}
              />

              <Button type="submit" loading={loading} className="w-full">
                Publish Election
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
