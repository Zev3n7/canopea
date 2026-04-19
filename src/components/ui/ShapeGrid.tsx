// src/components/ui/ShapeGrid.tsx
// Implementación de Shape Grid de React Bits — cuadrícula animada diagonal
'use client'
import { useEffect, useRef, useCallback } from 'react'

interface ShapeGridProps {
  borderColor?:    string
  hoverColor?:     string
  shapeSize?:      number
  animationSpeed?: number
  className?:      string
}

export default function ShapeGrid({
  borderColor    = '#1E3520',
  hoverColor     = '#84BD0118',
  shapeSize      = 40,
  animationSpeed = 0.5,
  className      = '',
}: ShapeGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse     = useRef({ x: -999, y: -999 })
  const frameRef  = useRef<number>(0)
  const timeRef   = useRef<number>(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx  = canvas.getContext('2d')
    if (!ctx)  return
    const W = canvas.width, H = canvas.height
    const cols = Math.ceil(W / shapeSize) + 1
    const rows = Math.ceil(H / shapeSize) + 1
    const t    = timeRef.current

    ctx.clearRect(0, 0, W, H)

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Diagonal wave offset
        const offset = ((c + r) * shapeSize * 0.3 - t * animationSpeed * 60) % (shapeSize * 2)
        const x0 = c * shapeSize - shapeSize / 2
        const y0 = r * shapeSize - shapeSize / 2

        // Distance to mouse for hover glow
        const cx  = x0 + shapeSize / 2
        const cy  = y0 + shapeSize / 2
        const dx  = cx - mouse.current.x
        const dy  = cy - mouse.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const glow = Math.max(0, 1 - dist / 120)

        if (glow > 0.01) {
          ctx.fillStyle = `rgba(132,189,1,${glow * 0.12})`
          ctx.fillRect(x0, y0, shapeSize, shapeSize)
        }

        ctx.strokeStyle = borderColor
        ctx.lineWidth   = 0.5
        ctx.strokeRect(x0, y0, shapeSize, shapeSize)
      }
    }
  }, [borderColor, shapeSize, animationSpeed])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement!

    const resize = () => {
      canvas.width  = parent.offsetWidth
      canvas.height = parent.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(parent)

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onLeave = () => { mouse.current = { x: -999, y: -999 } }
    parent.addEventListener('mousemove', onMove)
    parent.addEventListener('mouseleave', onLeave)

    let last = 0
    const loop = (ts: number) => {
      const dt = (ts - last) / 1000
      last = ts
      timeRef.current += dt
      draw()
      frameRef.current = requestAnimationFrame(loop)
    }
    frameRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frameRef.current)
      ro.disconnect()
      parent.removeEventListener('mousemove', onMove)
      parent.removeEventListener('mouseleave', onLeave)
    }
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity: 0.7 }}
    />
  )
}
