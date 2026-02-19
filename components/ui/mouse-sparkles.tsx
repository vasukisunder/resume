'use client'

import { useEffect, useRef, useState } from 'react'

const THROTTLE_MS = 18
const PIXEL_SIZE = 3
const MAX_DOTS = 90
const DOTS_PER_MOVE = 2
const SPAWN_RADIUS = 8
const DRIFT_DECAY = 0.992

const COLORS = [
  '#ec4899',
  '#8b5cf6',
  '#06b6d4',
  '#f59e0b',
  '#22c55e',
  '#3b82f6',
  '#f43f5e',
  '#a855f7',
]

type TrailDot = { x: number; y: number; vx: number; vy: number; id: number; color: string }

function pickColor(index: number) {
  return COLORS[index % COLORS.length]
}

function normalize(x: number, y: number) {
  const len = Math.hypot(x, y) || 1
  return { x: x / len, y: y / len }
}

export function MouseSparkles() {
  const [trail, setTrail] = useState<TrailDot[]>([])
  const [mounted, setMounted] = useState(false)
  const lastMoveRef = useRef(0)
  const lastPosRef = useRef({ x: 0, y: 0 })
  const idRef = useRef(0)
  const colorIndex = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    setMounted(true)

    const handleMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastMoveRef.current < THROTTLE_MS) return
      lastMoveRef.current = now

      const cx = e.clientX
      const cy = e.clientY
      const last = lastPosRef.current
      const vx = cx - last.x
      const vy = cy - last.y
      lastPosRef.current = { x: cx, y: cy }

      const speed = Math.hypot(vx, vy)
      if (speed < 0.1) return

      const back = normalize(-vx, -vy)
      const newDots: TrailDot[] = []

      for (let i = 0; i < DOTS_PER_MOVE; i++) {
        const angle = Math.random() * Math.PI * 2
        const r = Math.random() * SPAWN_RADIUS
        const x = cx + Math.cos(angle) * r
        const y = cy + Math.sin(angle) * r
        const backward = 0.15 + Math.random() * 0.2
        const scatter = 0.25 + Math.random() * 0.35
        idRef.current += 1
        newDots.push({
          x,
          y,
          vx: back.x * backward + (Math.random() - 0.5) * scatter,
          vy: back.y * backward + (Math.random() - 0.5) * scatter,
          id: idRef.current,
          color: pickColor(colorIndex.current++),
        })
      }

      setTrail((prev) => {
        const next = [...prev, ...newDots]
        return next.length > MAX_DOTS ? next.slice(-MAX_DOTS) : next
      })
    }

    const tick = () => {
      setTrail((prev) => {
        if (prev.length === 0) return prev
        return prev.map((d) => ({
          ...d,
          x: d.x + d.vx,
          y: d.y + d.vy,
          vx: d.vx * DRIFT_DECAY,
          vy: d.vy * DRIFT_DECAY,
        }))
      })
      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMove)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  if (!mounted) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 9999 }}
      aria-hidden
    >
      {trail.map((dot) => (
        <span
          key={dot.id}
          className="absolute animate-sparkle-fade"
          style={{
            left: dot.x,
            top: dot.y,
            width: PIXEL_SIZE,
            height: PIXEL_SIZE,
            transform: 'translate(-50%, -50%)',
            backgroundColor: dot.color,
          }}
        />
      ))}
    </div>
  )
}
