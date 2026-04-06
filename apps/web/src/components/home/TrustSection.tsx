'use client'

import { motion } from 'framer-motion'

const trustItems = [
  {
    icon: '✅',
    title: 'Verified Sellers',
    description:
      'Every seller goes through our ID verification process. Buy with confidence knowing you&apos;re dealing with real people.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/20',
  },
  {
    icon: '⭐',
    title: 'Honest Reviews',
    description:
      'Transparent ratings from real buyers and renters. No fake reviews — only genuine community feedback.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/20',
  },
  {
    icon: '🔒',
    title: 'Secure Transactions',
    description:
      'Payments held in escrow until you confirm receipt. Your money is protected every step of the way.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
  },
  {
    icon: '🛠️',
    title: 'Local Support',
    description:
      'Real support from our team based right here on the Costa del Sol. We speak your language.',
    color: 'text-primary-400',
    bg: 'bg-primary-400/10 border-primary-400/20',
  },
]

const partners = [
  { name: 'Trek', logo: '🚲' },
  { name: 'Specialized', logo: '🔴' },
  { name: 'Giant', logo: '🟢' },
  { name: 'Cannondale', logo: '⚪' },
  { name: 'Scott', logo: '🔵' },
  { name: 'Bianchi', logo: '🟦' },
]

export function TrustSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(26,26,46,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(26,26,46,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-500 text-sm font-semibold uppercase tracking-widest">
            Why Choose Us
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-secondary-500 mt-3 mb-4">
            Built on Trust
          </h2>
          <p className="text-secondary-500/60 text-lg max-w-xl mx-auto">
            BiciMarket is the safest way to buy, sell, and rent bikes in Costa del Sol.
          </p>
        </motion.div>

        {/* Trust cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`border rounded-2xl p-7 ${item.bg} hover:scale-105 transition-transform duration-300`}
            >
              <div className="text-4xl mb-5">{item.icon}</div>
              <h3 className={`text-xl font-bold mb-3 ${item.color}`}>{item.title}</h3>
              <p className="text-secondary-500/70 text-sm leading-relaxed">
                {item.title === 'Verified Sellers'
                  ? 'Every seller goes through our ID verification process. Buy with confidence knowing you\'re dealing with real people.'
                  : item.title === 'Honest Reviews'
                  ? 'Transparent ratings from real buyers and renters. No fake reviews — only genuine community feedback.'
                  : item.title === 'Secure Transactions'
                  ? 'Payments held in escrow until you confirm receipt. Your money is protected every step of the way.'
                  : 'Real support from our team based right here on the Costa del Sol. We speak your language.'}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-yellow-400 text-xl">⭐</span>
            ))}
          </div>
          <blockquote className="text-2xl font-medium text-secondary-500/80 italic leading-relaxed mb-6">
            &quot;Sold my Trek in 2 days and bought a gravel bike the same week. The escrow system gave me total peace of mind. Best cycling marketplace on the Costa del Sol!&quot;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
              M
            </div>
            <div className="text-left">
              <div className="font-bold text-secondary-500">Marcus Weber</div>
              <div className="text-secondary-500/50 text-sm">Marbella • Verified Buyer & Seller</div>
            </div>
          </div>
        </motion.div>

        {/* Partners / Brands */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-secondary-200 pt-12"
        >
          <p className="text-center text-secondary-500/40 text-sm uppercase tracking-widest mb-8">
            Popular brands in our marketplace
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {['Trek', 'Specialized', 'Giant', 'Cannondale', 'Scott', 'Bianchi', 'Cube', 'Orbea'].map(
              (brand, i) => (
                <motion.span
                  key={brand}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="text-secondary-500/30 font-bold text-lg hover:text-secondary-500/60 transition-colors cursor-default"
                >
                  {brand}
                </motion.span>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
