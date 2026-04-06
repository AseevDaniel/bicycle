'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    name: 'Road',
    icon: '🚴',
    count: 245,
    gradient: 'from-blue-600 to-blue-800',
    glow: 'shadow-blue-500/40',
    href: '/listings?type=road',
  },
  {
    name: 'Mountain',
    icon: '🏔️',
    count: 189,
    gradient: 'from-emerald-600 to-emerald-800',
    glow: 'shadow-emerald-500/40',
    href: '/listings?type=mountain',
  },
  {
    name: 'Gravel',
    icon: '🛤️',
    count: 134,
    gradient: 'from-amber-600 to-amber-800',
    glow: 'shadow-amber-500/40',
    href: '/listings?type=gravel',
  },
  {
    name: 'Electric',
    icon: '⚡',
    count: 98,
    gradient: 'from-yellow-500 to-yellow-700',
    glow: 'shadow-yellow-500/40',
    href: '/listings?type=electric',
  },
  {
    name: 'City',
    icon: '🏙️',
    count: 156,
    gradient: 'from-violet-600 to-violet-800',
    glow: 'shadow-violet-500/40',
    href: '/listings?type=city',
  },
  {
    name: 'Hybrid',
    icon: '🔀',
    count: 89,
    gradient: 'from-cyan-600 to-cyan-800',
    glow: 'shadow-cyan-500/40',
    href: '/listings?type=hybrid',
  },
  {
    name: 'BMX',
    icon: '🤸',
    count: 45,
    gradient: 'from-red-600 to-red-800',
    glow: 'shadow-red-500/40',
    href: '/listings?type=bmx',
  },
  {
    name: 'Kids',
    icon: '👶',
    count: 67,
    gradient: 'from-pink-500 to-pink-700',
    glow: 'shadow-pink-500/40',
    href: '/listings?type=kids',
  },
  {
    name: 'Folding',
    icon: '📐',
    count: 34,
    gradient: 'from-teal-600 to-teal-800',
    glow: 'shadow-teal-500/40',
    href: '/listings?type=folding',
  },
  {
    name: 'Cargo',
    icon: '📦',
    count: 28,
    gradient: 'from-orange-600 to-orange-800',
    glow: 'shadow-orange-500/40',
    href: '/listings?type=cargo',
  },
]

function TiltCard({ category, index }: { category: typeof categories[0]; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const xSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(ySpring, [-0.5, 0.5], ['12deg', '-12deg'])
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ['-12deg', '12deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const xPos = (e.clientX - rect.left) / rect.width - 0.5
    const yPos = (e.clientY - rect.top) / rect.height - 0.5
    x.set(xPos)
    y.set(yPos)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.a
      ref={cardRef}
      href={category.href}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`relative group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gradient-to-br ${category.gradient} border border-white/10 cursor-pointer overflow-hidden transition-shadow duration-300 ${isHovered ? `shadow-2xl ${category.glow}` : 'shadow-md'}`}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ transform: 'translateZ(20px)' }}
      />

      {/* Orange glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-primary-500/0 group-hover:bg-primary-500/10 transition-colors duration-300" />

      <motion.span
        className="text-4xl relative z-10"
        style={{ transform: 'translateZ(30px)' }}
        animate={isHovered ? { scale: 1.2, rotate: [-5, 5, 0] } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.3 }}
      >
        {category.icon}
      </motion.span>

      <div className="relative z-10 text-center" style={{ transform: 'translateZ(20px)' }}>
        <div className="font-bold text-white text-lg">{category.name}</div>
        <div className="text-white/60 text-sm">{category.count} bikes</div>
      </div>

      <motion.div
        className="relative z-10 flex items-center gap-1 text-white/0 group-hover:text-white/80 text-xs transition-colors duration-200"
        style={{ transform: 'translateZ(15px)' }}
      >
        Browse <ArrowRight className="w-3 h-3" />
      </motion.div>
    </motion.a>
  )
}

export function CategorySection() {
  return (
    <section className="py-20 bg-secondary-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest">
            All Categories
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">
            Find Your Ride
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            From mountain trails to city streets — browse over 1,000 bikes across all disciplines.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <TiltCard key={cat.name} category={cat} index={i} />
          ))}
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <a
            href="/listings"
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-semibold text-lg transition-colors group"
          >
            View All Listings
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
