import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Menu, X, LogOut, User, Moon, Sun } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import { profileDisplayName } from '../utils/helpers'
import Starfield from './Starfield'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')
  const [showThemePicker, setShowThemePicker] = useState(false)
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('themeColor') || 'black')
  const pickerRef = useRef(null)
  const [showFullscreenStars, setShowFullscreenStars] = useState(() => localStorage.getItem('starsFull') === 'true')
  const { profile, isAuthenticated } = useAuth()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    // Apply theme color class
    document.documentElement.classList.remove('theme-black', 'theme-blue', 'theme-purple')
    document.documentElement.classList.add(`theme-${themeColor}`)
    localStorage.setItem('themeColor', themeColor)
  }, [themeColor])

  // Close picker when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowThemePicker(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const handleLogout = async () => {
    await authService.signout()
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/elections', label: 'Elections' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  const roleLinks = profile?.role === 'admin'
    ? [
        { to: '/admin/approvals', label: 'Approvals' },
        { to: '/admin/users', label: 'Users' },
        { to: '/admin/audit-logs', label: 'Logs' },
      ]
    : profile?.role === 'creator'
    ? [
        { to: '/creator/create', label: 'Create' },
        { to: '/dashboard', label: 'Dashboard' },
      ]
    : profile?.role === 'voter'
    ? [
        { to: '/voter/joined', label: 'My Votes' },
      ]
    : []

  return (
    <nav className="sticky top-0 z-50 glass backdrop-blur-xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center text-white font-bold">
              V
            </div>
            <span className="text-xl font-bold gradient-text">VoteSecure</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {roleLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Links */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative" ref={pickerRef}>
              <button
                onClick={() => setShowThemePicker(!showThemePicker)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {showThemePicker && (
                <div className="absolute right-0 mt-2 w-56 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <p className="text-sm font-semibold mb-2">Theme Accent</p>
                  <div className="flex items-center gap-3 mb-3">
                    <button onClick={() => { setThemeColor('black'); setShowFullscreenStars(true); localStorage.setItem('starsFull','true') }} className={`w-8 h-8 rounded-full border ${themeColor === 'black' ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`} style={{ background: '#000' }} />
                    <button onClick={() => { setThemeColor('blue'); setShowFullscreenStars(true); localStorage.setItem('starsFull','true') }} className={`w-8 h-8 rounded-full border ${themeColor === 'blue' ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`} style={{ background: '#0ea5e9' }} />
                    <button onClick={() => { setThemeColor('purple'); setShowFullscreenStars(true); localStorage.setItem('starsFull','true') }} className={`w-8 h-8 rounded-full border ${themeColor === 'purple' ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`} style={{ background: '#7c3aed' }} />
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Preview</div>
                  <div className="flex items-center justify-center">
                    <Starfield color={themeColor === 'black' ? '#fff' : themeColor === 'blue' ? '#7ee3ff' : '#cdb4ff'} />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <input type="checkbox" checked={showFullscreenStars} onChange={(e) => { setShowFullscreenStars(e.target.checked); localStorage.setItem('starsFull', String(e.target.checked)) }} />
                      Full-screen stars
                    </label>
                    <button className="text-sm text-primary-500" onClick={() => setShowThemePicker(false)}>Close</button>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen overlay is rendered at App level to cover entire viewport */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-500">
                  <User size={20} />
                  <span>{profileDisplayName(profile) || 'Dashboard'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 flex items-center gap-2"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-gradient px-4 py-2 rounded-lg text-white font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 space-y-2"
          >
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {roleLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-4 py-2 text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 bg-primary-500 text-white hover:bg-primary-600 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  )
}
