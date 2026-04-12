'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { useLocale } from 'next-intl'

gsap.registerPlugin(ScrollTrigger)

const columns = [
  {
    icon: '🏷️',
    title: 'Sell',
    subtitle: 'List in minutes, get paid safely',
    accent: 'from-orange-500 to-primary-600',
    href: '/sell',
    steps: [
      { number: '01', text: 'Take clear photos of your bike' },
      { number: '02', text: 'List in minutes with our smart form' },
      { number: '03', text: 'Get paid securely via escrow' },
    ],
  },
  {
    icon: '🛒',
    title: 'Buy',
    subtitle: 'Find your dream bike locally',
    accent: 'from-blue-500 to-blue-700',
    href: '/listings',
    steps: [
      { number: '01', text: 'Browse & filter by type, price, city' },
      { number: '02', text: 'Contact seller via secure messaging' },
      { number: '03', text: 'Meet, inspect & ride away happy' },
    ],
  },
  {
    icon: '📅',
    title: 'Rent',
    subtitle: 'Ride without the commitment',
    accent: 'from-accent-500 to-teal-600',
    href: '/rentals',
    steps: [
      { number: '01', text: 'Choose your dates and bike type' },
      { number: '02', text: 'Book and pay securely online' },
      { number: '03', text: 'Pick up locally and start riding' },
    ],
  },
]

function StepCard({ column, index, locale }: { column: typeof columns[0]; index: number; locale: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index === 0 ? -60 : index === 2 ? 60 : 0, y: index === 1 ? 40 : 0 }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="bg-white border border-gray-200 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10 rounded-2xl p-8 hover:border-primary-300 dark:hover:border-white/20 hover:shadow-lg dark:hover:shadow-none transition-all duration-300 h-full group">
        {/* Icon circle */}
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${column.accent} flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {column.icon}
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{column.title}</h3>
        <p className="text-gray-500 dark:text-white/50 text-sm mb-8">{column.subtitle}</p>

        {/* Steps */}
        <div className="space-y-5">
          {column.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${column.accent} flex items-center justify-center text-xs font-black text-white shadow-md`}>
                {i + 1}
              </div>
              <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed pt-1">{step.text}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="mt-8"
        >
          <Link
            href={`/${locale}${column.href}`}
            className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${column.accent} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}
          >
            Get started →
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const locale = useLocale()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Subtle parallax on the heading
      gsap.fromTo(
        '.how-it-works-heading',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.how-it-works-heading',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-white dark:bg-secondary-900 relative overflow-hidden">
      {/* Background gradient (dark mode only) */}
      <div className="absolute inset-0 hidden dark:block bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-500/3 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="how-it-works-heading text-center mb-16">
          <span className="text-primary-500 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest">
            Simple Process
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mt-3 mb-4">
            How BiciMarket Works
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-lg max-w-xl mx-auto">
            Whether you&apos;re buying, selling, or renting — we make cycling transactions simple, safe, and local.
          </p>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {columns.map((col, i) => (
            <StepCard key={col.title} column={col} index={i} locale={locale} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-14"
        >
          <Link
            href={`/${locale}/how-it-works`}
            className="inline-flex items-center gap-3 border-2 border-primary-400/50 hover:border-primary-500 text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-bold px-8 py-4 rounded-2xl transition-all duration-200 hover:bg-primary-50 dark:hover:bg-primary-500/10"
          >
            Learn More About the Process
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
