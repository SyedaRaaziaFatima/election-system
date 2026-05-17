import { motion } from 'framer-motion'

export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5 } : {}}
      className={`glass p-6 rounded-xl ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
