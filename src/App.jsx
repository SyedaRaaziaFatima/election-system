import { AuthProvider } from './context/AuthContext'
import { AppRoutes } from './routes'
import './styles/global.css'
import { useEffect, useState } from 'react'
import FullscreenStarfield from './components/FullscreenStarfield'

function App() {
  const [starsFull, setStarsFull] = useState(false)
  const [themeColor, setThemeColor] = useState('blue')

  useEffect(() => {
    const s = localStorage.getItem('starsFull')
    const c = localStorage.getItem('themeColor')
    setStarsFull(s === 'true')
    if (c) setThemeColor(c)

    const onStorage = (e) => {
      if (e.key === 'starsFull') setStarsFull(e.newValue === 'true')
      if (e.key === 'themeColor') setThemeColor(e.newValue || 'blue')
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const starColor = themeColor === 'black' ? '#ffffff' : themeColor === 'blue' ? '#7ee3ff' : '#cdb4ff'

  return (
    <AuthProvider>
      {starsFull && <FullscreenStarfield color={starColor} />}
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
