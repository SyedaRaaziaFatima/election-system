import { useEffect, useRef } from 'react'

const FullscreenStarfield = ({ color = '#ffffff', count = 250 }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    const stars = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 1.8 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
    }))

    let raf = null

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', resize)

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'
      for (const s of stars) {
        s.x += s.vx
        s.y += s.vy
        if (s.x < 0) s.x = width
        if (s.x > width) s.x = 0
        if (s.y < 0) s.y = height
        if (s.y > height) s.y = 0

        ctx.beginPath()
        ctx.globalAlpha = s.alpha * 0.9
        ctx.fillStyle = color
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [color, count])

  return (
    <canvas
      ref={canvasRef}
      className="fullscreen-starfield"
      style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none' }}
    />
  )
}

export default FullscreenStarfield
