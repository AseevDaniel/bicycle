'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from 'next-intl'

const categories = [
  {
    name: 'Road',
    icon: '🚴',
    count: 245,
    color: 'bg-blue-500',
    dotColor: 'bg-blue-500',
    href: '/listings?type=road',
  },
  {
    name: 'Mountain',
    icon: '🏔️',
    count: 189,
    color: 'bg-emerald-500',
    dotColor: 'bg-emerald-500',
    href: '/listings?type=mountain',
  },
  {
    name: 'Gravel',
    icon: '🛤️',
    count: 134,
    color: 'bg-amber-500',
    dotColor: 'bg-amber-500',
    href: '/listings?type=gravel',
  },
  {
    name: 'Electric',
    icon: '⚡',
    count: 98,
    color: 'bg-yellow-500',
    dotColor: 'bg-yellow-500',
    href: '/listings?type=electric',
  },
  {
    name: 'City',
    icon: '🏙️',
    count: 156,
    color: 'bg-violet-500',
    dotColor: 'bg-violet-500',
    href: '/listings?type=city',
  },
  {
    name: 'Hybrid',
    icon: '🔀',
    count: 89,
    color: 'bg-cyan-500',
    dotColor: 'bg-cyan-500',
    href: '/listings?type=hybrid',
  },
  {
    name: 'BMX',
    icon: '🤸',
    count: 45,
    color: 'bg-red-500',
    dotColor: 'bg-red-500',
    href: '/listings?type=bmx',
  },
  {
    name: 'Kids',
    icon: '👶',
    count: 67,
    color: 'bg-pink-500',
    dotColor: 'bg-pink-500',
    href: '/listings?type=kids',
  },
  {
    name: 'Folding',
    icon: '📐',
    count: 34,
    color: 'bg-teal-500',
    dotColor: 'bg-teal-500',
    href: '/listings?type=folding',
  },
  {
    name: 'Cargo',
    icon: '📦',
    count: 28,
    color: 'bg-orange-500',
    dotColor: 'bg-orange-500',
    href: '/listings?type=cargo',
  },
]

const MotionLink = motion(Link)

function TiltCard({ category, index, locale }: { category: typeof categories[0]; index: number; locale: string }) {
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
    <MotionLink
      ref={cardRef}
      href={`/${locale}${category.href}`}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-primary-300 dark:bg-secondary-700/50 dark:border-secondary-600 dark:hover:border-primary-500/50 cursor-pointer overflow-hidden transition-all duration-300"
    >
      {/* Color dot badge in top-right */}
      <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${category.dotColor} opacity-70`} />

      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ transform: 'translateZ(20px)' }}
      />

      {/* Primary color glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-primary-500/0 group-hover:bg-primary-500/5 transition-colors duration-300" />

      <motion.span
        className="text-5xl relative z-10"
        style={{ transform: 'translateZ(30px)' }}
        animate={isHovered ? { scale: 1.2, rotate: [-5, 5, 0] } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.3 }}
      >
        {category.icon}
      </motion.span>

      <div className="relative z-10 text-center" style={{ transform: 'translateZ(20px)' }}>
        <div className="font-bold text-gray-900 dark:text-white text-lg">{category.name}</div>
        <div className="text-gray-500 dark:text-white/60 text-sm">{category.count} bikes</div>
      </div>

      <motion.div
        className="relative z-10 flex items-center gap-1 text-gray-400 dark:text-white/0 group-hover:text-primary-500 dark:group-hover:text-white/80 text-xs transition-colors duration-200"
        style={{ transform: 'translateZ(15px)' }}
      >
        Browse <ArrowRight className="w-3 h-3" />
      </motion.div>
    </MotionLink>
  )
}

export function CategorySection() {
  const locale = useLocale()

  return (
    <section className="py-20 bg-gray-50 dark:bg-secondary-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary-500 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest">
            All Categories
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mt-3 mb-4">
            Find Your Ride
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-lg max-w-xl mx-auto">
            From mountain trails to city streets — browse over 1,000 bikes across all disciplines.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <TiltCard key={cat.name} category={cat} index={i} locale={locale} />
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
          <Link
            href={`/${locale}/listings`}
            className="inline-flex items-center gap-2 text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-semibold text-lg transition-colors group"
          >
            View All Listings
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
