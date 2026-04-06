'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import {
  MapPin,
  Zap,
  Shield,
  Lock,
  Lightbulb,
  ShoppingBasket,
  Smartphone,
  BatteryCharging,
  Calendar,
  Star,
} from 'lucide-react'
import { clsx } from 'clsx'
import { StarRating } from '@/components/ui/StarRating'

export interface RentalData {
  id: string
  title: string
  bikeType: string
  brand: string
  pricePerDay: number
  pricePerWeek: number
  pricePerMonth: number
  deposit: number
  city: string
  instantBook: boolean
  ownerName: string
  ownerRating: number
  ownerReviews: number
  photo: string
  features: string[]
  condition: string
  description: string
}

type PricingView = 'daily' | 'weekly' | 'monthly'

const featureIcon = (feature: string) => {
  const f = feature.toLowerCase()
  if (f.includes('helmet')) return <Shield className="w-3.5 h-3.5" />
  if (f.includes('lock')) return <Lock className="w-3.5 h-3.5" />
  if (f.includes('light')) return <Lightbulb className="w-3.5 h-3.5" />
  if (f.includes('basket')) return <ShoppingBasket className="w-3.5 h-3.5" />
  if (f.includes('phone') || f.includes('mount')) return <Smartphone className="w-3.5 h-3.5" />
  if (f.includes('charg') || f.includes('range')) return <BatteryCharging className="w-3.5 h-3.5" />
  return <Zap className="w-3.5 h-3.5" />
}

interface RentalCardProps {
  rental: RentalData
  pricingView?: PricingView
}

export function RentalCard({ rental, pricingView = 'daily' }: RentalCardProps) {
  const [imgError, setImgError] = useState(false)
  const [localView, setLocalView] = useState<PricingView>(pricingView)

  const priceMap: Record<PricingView, number> = {
    daily: rental.pricePerDay,
    weekly: rental.pricePerWeek,
    monthly: rental.pricePerMonth,
  }

  const labelMap: Record<PricingView, string> = {
    daily: '/day',
    weekly: '/week',
    monthly: '/month',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group bg-secondary-500/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300"
    >
      {/* Photo */}
      <div className="relative h-52 overflow-hidden bg-secondary-700">
        {!imgError ? (
          <img
            src={rental.photo}
            alt={rental.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary-600 to-secondary-800">
            <span className="text-6xl">🚲</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 via-transparent to-transparent" />

        {/* Instant Book / Request badge */}
        <div className="absolute top-3 left-3">
          {rental.instantBook ? (
            <span className="inline-flex items-center gap-1.5 bg-accent-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
              <Zap className="w-3 h-3 fill-current" />
              Instant Book
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/20">
              <Calendar className="w-3 h-3" />
              Request to Book
            </span>
          )}
        </div>

        {/* Bike type */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-secondary-500/70 text-white/80 text-xs font-medium px-2.5 py-1 rounded-full border border-white/10 capitalize">
            {rental.bikeType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-white text-lg leading-tight mb-1 line-clamp-1 group-hover:text-primary-400 transition-colors">
          {rental.title}
        </h3>

        {/* Location + rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-white/50 text-sm">
            <MapPin className="w-3.5 h-3.5 text-accent-400" />
            <span>{rental.city}</span>
          </div>
          <StarRating
            rating={rental.ownerRating}
            size="sm"
            showValue
            reviewCount={rental.ownerReviews}
          />
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {rental.features.slice(0, 4).map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center gap-1 bg-secondary-600/60 text-white/60 text-xs px-2 py-0.5 rounded-md border border-white/5"
            >
              {featureIcon(feature)}
              {feature}
            </span>
          ))}
        </div>

        {/* Pricing toggle */}
        <div className="flex gap-1 mb-3 bg-secondary-700/50 rounded-xl p-1">
          {(['daily', 'weekly', 'monthly'] as PricingView[]).map((view) => (
            <button
              key={view}
              onClick={() => setLocalView(view)}
              className={clsx(
                'flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all duration-200 capitalize',
                localView === view
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/70'
              )}
            >
              {view === 'daily' ? 'Day' : view === 'weekly' ? 'Week' : 'Month'}
            </button>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary-400">
                €{priceMap[localView]}
              </span>
              <span className="text-white/40 text-sm">{labelMap[localView]}</span>
            </div>
            <p className="text-white/30 text-xs mt-0.5">+€{rental.deposit} deposit</p>
          </div>

          <Link
            href={`/rentals/${rental.id}`}
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
