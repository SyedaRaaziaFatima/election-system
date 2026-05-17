import { useEffect, useRef } from 'react'

export const Starfield = ({ color = '#ffffff', count = 60, size = 2 }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width = 220
    const height = canvas.height = 120

    const stars = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * size + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
    }))

    let raf = null

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = 'transparent'
      ctx.fillRect(0, 0, width, height)

      for (const s of stars) {
        s.x += s.vx
        s.y += s.vy
        if (s.x < 0) s.x = width
        if (s.x > width) s.x = 0
        if (s.y < 0) s.y = height
        if (s.y > height) s.y = 0

        ctx.beginPath()
        ctx.globalAlpha = s.alpha
        ctx.fillStyle = color
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  }, [color, count, size])

  return <canvas ref={canvasRef} className="starfield-canvas rounded-md shadow-md" width="220" height="120" />
}

export default Starfield
