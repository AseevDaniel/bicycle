'use client'

import { MapPin, Tag, ExternalLink } from 'lucide-react'

export interface MapListing {
  id: string
  title: string
  price: number
  bikeType: string
  condition: 'A' | 'B' | 'C' | 'D'
  lat: number
  lng: number
  city: string
  photo: string
  brand?: string
  year?: number
}

const conditionLabels: Record<string, string> = {
  A: 'Like New',
  B: 'Good',
  C: 'Fair',
  D: 'Needs Work',
}

const conditionColors: Record<string, string> = {
  A: '#10B981',
  B: '#3B82F6',
  C: '#F59E0B',
  D: '#F97316',
}

interface ListingPopupProps {
  listing: MapListing
  locale?: string
}

export function ListingPopup({ listing, locale = 'en' }: ListingPopupProps) {
  const conditionColor = conditionColors[listing.condition] ?? '#6B7280'
  const conditionLabel = conditionLabels[listing.condition] ?? listing.condition

  return (
    <div className="w-64 bg-secondary-500 rounded-xl overflow-hidden shadow-2xl">
      {/* Photo */}
      <div className="relative h-36 bg-secondary-700 overflow-hidden">
        <img
          src={listing.photo}
          alt={listing.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            target.parentElement!.innerHTML =
              '<div class="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-secondary-600 to-secondary-800">🚲</div>'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/60 via-transparent to-transparent" />

        {/* Condition badge */}
        <span
          className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: conditionColor }}
        >
          {listing.condition} · {conditionLabel}
        </span>

        {/* Type badge */}
        <span className="absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-black/40 text-white/90 capitalize">
          {listing.bikeType}
        </span>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-bold text-white text-sm leading-tight line-clamp-1 mb-1">
          {listing.title}
        </h3>

        <div className="flex items-center gap-1 text-white/50 text-xs mb-2">
          <MapPin className="w-3 h-3 text-accent-400 flex-shrink-0" />
          <span>{listing.city}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-primary-400" />
            <span className="text-lg font-bold text-primary-400">
              €{listing.price.toLocaleString()}
            </span>
          </div>

          <a
            href={`/${locale}/listings/${listing.id}`}
            className="flex items-center gap-1 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            View
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
