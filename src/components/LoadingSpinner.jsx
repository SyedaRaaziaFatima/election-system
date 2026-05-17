import { motion } from 'framer-motion'

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className={`${sizes[size]} border-4 border-primary-200 border-t-primary-500 rounded-full`}
      />
      {text && <p className="text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  )
}
