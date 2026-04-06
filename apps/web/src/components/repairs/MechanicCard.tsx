'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Clock, Truck, Globe } from 'lucide-react'
import { StarRating } from '@/components/ui/StarRating'

export interface MechanicService {
  id: string
  name: string
  price: number
  duration: string
  category: string
}

export interface MechanicData {
  id: string
  name: string
  avatar: string
  bio: string
  specialties: string[]
  rating: number
  reviewCount: number
  city: string
  isMobile: boolean
  priceRange: { min: number; max: number }
  responseTime: string
  languages: string[]
  services: MechanicService[]
}

const FLAG_MAP: Record<string, string> = {
  es: '🇪🇸',
  en: '🇬🇧',
  de: '🇩🇪',
  fr: '🇫🇷',
  ru: '🇷🇺',
  uk: '🇺🇦',
  nl: '🇳🇱',
  pt: '🇵🇹',
}

interface MechanicCardProps {
  mechanic: MechanicData
}

export function MechanicCard({ mechanic }: MechanicCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group bg-secondary-500/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300"
    >
      {/* Card header */}
      <div className="relative p-5 pb-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={mechanic.avatar}
              alt={mechanic.name}
              className="w-16 h-16 rounded-xl object-cover border-2 border-white/10"
            />
            {mechanic.isMobile && (
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center border-2 border-secondary-800">
                <Truck className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Name + rating */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-white font-bold text-lg leading-tight group-hover:text-primary-400 transition-colors">
                  {mechanic.name}
                </h3>
                {mechanic.isMobile && (
                  <span className="inline-flex items-center gap-1 text-accent-400 text-xs font-semibold mt-0.5">
                    <Truck className="w-3 h-3" />
                    Mobile Mechanic
                  </span>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-primary-400 font-bold text-sm">From €{mechanic.priceRange.min}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={mechanic.rating} size="sm" showValue reviewCount={mechanic.reviewCount} />
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-white/60 text-sm mt-3 line-clamp-2 leading-relaxed">
          {mechanic.bio}
        </p>
      </div>

      {/* Specialties */}
      <div className="px-5 pb-4">
        <div className="flex flex-wrap gap-1.5">
          {mechanic.specialties.map((spec) => (
            <span
              key={spec}
              className="inline-flex items-center bg-primary-500/10 text-primary-400 border border-primary-500/20 text-xs font-semibold px-2.5 py-1 rounded-full"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Meta row */}
      <div className="px-5 pb-5 border-t border-white/5 pt-4">
        <div className="flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-accent-400" />
              <span>{mechanic.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-accent-400" />
              <span>{mechanic.responseTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-white/30" />
            <div className="flex gap-0.5">
              {mechanic.languages.map((lang) => (
                <span key={lang} title={lang.toUpperCase()} className="text-sm leading-none">
                  {FLAG_MAP[lang] ?? lang.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Link
          href={`/repairs/${mechanic.id}`}
          className="mt-4 w-full py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm text-center transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          View Profile &amp; Book
        </Link>
      </div>
    </motion.div>
  )
}
