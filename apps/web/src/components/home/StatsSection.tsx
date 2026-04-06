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
    <section className="py-24 bg-secondary-500 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,77,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,77,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest">
            By the Numbers
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-3">
            Costa del Sol&apos;s Cycling Hub
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative group"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:border-primary-500/40 transition-all duration-300 hover:bg-white/8">
                {/* Icon */}
                <div className="text-4xl mb-4">{stat.icon}</div>

                {/* Counter */}
                <div className="text-5xl sm:text-6xl font-black text-primary-400 mb-2 leading-none">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <div className="text-white font-bold text-lg mb-1">{stat.label}</div>

                {/* Description */}
                <div className="text-white/40 text-sm">{stat.description}</div>

                {/* Decorative line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent transition-all duration-500 rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
