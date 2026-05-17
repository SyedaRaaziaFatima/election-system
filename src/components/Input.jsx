import { motion } from 'framer-motion'

export const Input = ({
  label,
  error,
  required,
  icon: Icon,
  as,
  className = '',
  children,
  ...props
}) => {
  const Component = as === 'textarea' ? motion.textarea : as === 'select' ? motion.select : motion.input

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        <Component
          whileFocus={{ scale: 1.01 }}
          className={`input-focus w-full px-4 py-2.5 ${Icon ? 'pl-10' : ''} bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${className}`}
          {...props}
        >
          {children}
        </Component>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}
