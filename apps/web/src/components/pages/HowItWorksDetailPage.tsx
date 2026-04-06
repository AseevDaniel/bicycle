'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'

const features = [
  {
    icon: '🏷️',
    title: 'Sell',
    subtitle: 'List in minutes, get paid safely',
    accent: 'from-orange-500 to-primary-600',
    dotColor: 'bg-orange-500',
    steps: [
      { number: '01', text: 'Take clear photos of your bike from multiple angles' },
      { number: '02', text: 'Create your listing in minutes with our smart form' },
      { number: '03', text: 'Get paid securely via our escrow payment system' },
    ],
    cta: 'Start Selling',
    href: '/sell',
  },
  {
    icon: '🛒',
    title: 'Buy',
    subtitle: 'Find your dream bike locally',
    accent: 'from-blue-500 to-blue-700',
    dotColor: 'bg-blue-500',
    steps: [
      { number: '01', text: 'Browse and filter bikes by type, price, city, and condition' },
      { number: '02', text: 'Contact the seller securely through our messaging system' },
      { number: '03', text: 'Meet locally, inspect the bike, and ride away happy' },
    ],
    cta: 'Browse Listings',
    href: '/listings',
  },
  {
    icon: '📅',
    title: 'Rent',
    subtitle: 'Ride without the commitment',
    accent: 'from-teal-500 to-teal-700',
    dotColor: 'bg-teal-500',
    steps: [
      { number: '01', text: 'Choose your dates and preferred bike type' },
      { number: '02', text: 'Book and pay securely online — no hidden fees' },
      { number: '03', text: 'Pick up locally from the owner and start riding' },
    ],
    cta: 'Find Rentals',
    href: '/rentals',
  },
  {
    icon: '🔧',
    title: 'Repairs',
    subtitle: 'Expert mechanics near you',
    accent: 'from-violet-500 to-violet-700',
    dotColor: 'bg-violet-500',
    steps: [
      { number: '01', text: 'Browse certified mechanics in your city' },
      { number: '02', text: 'Book a service appointment online' },
      { number: '03', text: 'Get your bike back in top shape' },
    ],
    cta: 'Find Mechanics',
    href: '/repairs',
  },
]

export function HowItWorksDetailPage() {
  const locale = useLocale()

  return (
    <main className="min-h-screen bg-white dark:bg-secondary-900">
      {/* Hero */}
      <section className="pt-28 pb-16 bg-gray-50 dark:bg-secondary-800 border-b border-gray-200 dark:border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary-500 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest">
              Simple Process
            </span>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mt-4 mb-6">
              How BiciMarket Works
            </h1>
            <p className="text-gray-500 dark:text-white/50 text-xl max-w-2xl mx-auto leading-relaxed">
              Whether you&apos;re buying, selling, renting, or getting a repair — we make cycling transactions simple, safe, and local.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature sections */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8 hover:border-primary-300 dark:hover:border-white/20 hover:shadow-lg dark:hover:shadow-none transition-all duration-300"
              >
                {/* Icon + color dot */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.accent} flex items-center justify-center text-3xl shadow-md`}>
                    {feature.icon}
                  </div>
                  <div className={`w-3 h-3 rounded-full ${feature.dotColor} opacity-70 mt-1`} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{feature.title}</h2>
                <p className="text-gray-500 dark:text-white/50 text-sm mb-8">{feature.subtitle}</p>

                {/* Steps */}
                <div className="space-y-5 mb-8">
                  {feature.steps.map((step, j) => (
                    <div key={j} className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${feature.accent} flex items-center justify-center text-xs font-black text-white shadow-md`}>
                        {j + 1}
                      </div>
                      <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed pt-1">{step.text}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/${locale}${feature.href}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition-colors group"
                >
                  {feature.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50 dark:bg-secondary-800 border-t border-gray-200 dark:border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-500 dark:text-white/50 mb-8 max-w-md mx-auto">
              Join thousands of cyclists on the Costa del Sol already using BiciMarket.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/${locale}/listings`}
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-200 shadow-lg shadow-primary-500/20 hover:scale-105"
              >
                Browse Bikes
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href={`/${locale}/sell`}
                className="inline-flex items-center gap-2 border-2 border-gray-300 dark:border-white/20 hover:border-primary-400 dark:hover:border-primary-500 text-gray-700 dark:text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-200"
              >
                Sell Your Bike
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
