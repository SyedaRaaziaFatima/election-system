import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'

export const Alert = ({ type = 'info', title, message, onClose, className = '' }) => {
  const types = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/30',
      border: 'border-green-200 dark:border-green-700',
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      border: 'border-red-200 dark:border-red-700',
      icon: AlertCircle,
      color: 'text-red-600 dark:text-red-400',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/30',
      border: 'border-yellow-200 dark:border-yellow-700',
      icon: AlertCircle,
      color: 'text-yellow-600 dark:text-yellow-400',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      border: 'border-blue-200 dark:border-blue-700',
      icon: Info,
      color: 'text-blue-600 dark:text-blue-400',
    },
  }

  const config = types[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${config.bg} ${config.border} border rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`${config.color} flex-shrink-0 mt-0.5`} size={20} />
        <div className="flex-1">
          {title && <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>}
          {message && <p className={`text-sm mt-1 ${config.color}`}>{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${config.color} hover:opacity-70 flex-shrink-0`}
          >
            <X size={18} />
          </button>
        )}
      </div>
    </motion.div>
  )
}
