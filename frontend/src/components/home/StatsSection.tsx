'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface Stat {
  value: number
  suffix: string
  label: string
  description: string
  icon: string
}

const stats: Stat[] = [
  {
    value: 847,
    suffix: '',
    label: 'Active Listings',
    description: 'Fresh bikes added daily',
    icon: '🚲',
  },
  {
    value: 12,
    suffix: '',
    label: 'Cities Covered',
    description: 'From Marbella to Malaga',
    icon: '🏙️',
  },
  {
    value: 43,
    suffix: '',
    label: 'Expert Mechanics',
    description: 'Certified local workshops',
    icon: '🔧',
  },
  {
    value: 1200,
    suffix: '+',
    label: 'Happy Renters',
    description: 'And counting every week',
    icon: '⭐',
  },
]

function CountUp({ target, suffix, duration = 2000 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const startedRef = useRef(false)

  useEffect(() => {
    if (!inView || startedRef.current) return
    startedRef.current = true

    const startTime = performance.now()
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }
    requestAnimationFrame(animate)
  }, [inView, target, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section className="py-20 bg-primary-500 relative overflow-hidden">
      {/* Subtle wheel pattern in background - CSS only, no Three.js */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-[40px] border-white rounded-full" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border-[25px] border-white rounded-full" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl sm:text-6xl font-black text-white mb-1">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white font-semibold text-base">{stat.label}</div>
              <div className="text-white/60 text-sm mt-1">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
