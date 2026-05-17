/**
 * Utility Functions
 */

/** Display name for a `profiles` row or auth-shaped object (supports legacy `name` column). */
export const profileDisplayName = (row) => {
  if (!row) return ''
  const n = row.full_name || row.name
  if (n) return n
  if (row.email) return row.email.split('@')[0]
  return ''
}

export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const isElectionActive = (startTime, endTime) => {
  const now = new Date()
  const start = new Date(startTime)
  const end = new Date(endTime)
  return now >= start && now <= end
}

export const getTimeRemaining = (endTime) => {
  const now = new Date()
  const end = new Date(endTime)
  const diff = end - now

  if (diff <= 0) return { status: 'expired', text: 'Ended' }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return {
    status: 'active',
    text: `${hours}h ${minutes}m ${seconds}s`,
    hours,
    minutes,
    seconds,
  }
}

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 11)
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 8
}

export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export const calculatePercentage = (value, total) => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

export const getElectionStatus = (startTime, endTime) => {
  const now = new Date()
  const start = new Date(startTime)
  const end = new Date(endTime)

  if (now < start) return 'upcoming'
  if (now >= start && now <= end) return 'active'
  return 'completed'
}
