'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const COLORS = ['#C4E8D4', '#D4C4E8', '#F5E8B8', '#F5C9B8', '#B8D4E8']

type Particle = { id: number; x: number; y: number; color: string; angle: number }

type Props = {
  trigger: boolean
  mini?: boolean
}

export default function Confetti({ trigger, mini = false }: Props) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!trigger) return
    const count = mini ? 5 : 8
    const ps: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 80 - 40,
      y: -(Math.random() * 60 + 20),
      color: COLORS[i % COLORS.length],
      angle: Math.random() * 360,
    }))
    setParticles(ps)
    const t = setTimeout(() => setParticles([]), 900)
    return () => clearTimeout(t)
  }, [trigger, mini])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: mini ? 6 : 8,
              height: mini ? 6 : 8,
              background: p.color,
              left: '50%',
              top: '50%',
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3, rotate: p.angle }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
