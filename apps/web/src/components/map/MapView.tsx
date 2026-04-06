'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { createRoot } from 'react-dom/client'
import type { MapListing } from './ListingPopup'
import { ListingPopup } from './ListingPopup'

// Fix Leaflet default icon paths broken by webpack/next.js
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

export const TYPE_COLORS: Record<string, string> = {
  road: '#3B82F6',
  mountain: '#22C55E',
  gravel: '#A855F7',
  electric: '#EAB308',
  city: '#6B7280',
  hybrid: '#14B8A6',
  default: '#FF4D00',
}

function createCustomIcon(color: string, isSelected = false) {
  const size = isSelected ? 40 : 32
  const border = isSelected ? 4 : 3
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${color};
      width:${size}px;
      height:${size}px;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:${border}px solid white;
      box-shadow:${isSelected ? '0 0 0 3px ' + color + '66, ' : ''}2px 2px 6px rgba(0,0,0,0.3);
      transition: all 0.2s ease;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  })
}

// Component that flies to a selected listing
function MapController({
  selectedId,
  listings,
}: {
  selectedId: string | null
  listings: MapListing[]
}) {
  const map = useMap()

  useEffect(() => {
    if (!selectedId) return
    const listing = listings.find((l) => l.id === selectedId)
    if (listing) {
      map.flyTo([listing.lat, listing.lng], Math.max(map.getZoom(), 13), {
        duration: 1.2,
        easeLinearity: 0.25,
      })
    }
  }, [selectedId, listings, map])

  return null
}

interface MapViewProps {
  listings: MapListing[]
  selectedId?: string | null
  onListingSelect?: (id: string | null) => void
  locale?: string
}

export default function MapView({
  listings,
  selectedId,
  onListingSelect,
  locale = 'en',
}: MapViewProps) {
  const popupRoots = useRef<Map<string, ReturnType<typeof createRoot>>>(new Map())

  // Clean up React roots on unmount
  useEffect(() => {
    const roots = popupRoots.current
    return () => {
      roots.forEach((root) => {
        try {
          root.unmount()
        } catch {
          // ignore cleanup errors
        }
      })
      roots.clear()
    }
  }, [])

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[36.6, -4.6]}
        zoom={10}
        className="w-full h-full z-0"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapController selectedId={selectedId ?? null} listings={listings} />

        {listings.map((listing) => {
          const color = TYPE_COLORS[listing.bikeType] ?? TYPE_COLORS.default
          const isSelected = selectedId === listing.id
          const icon = createCustomIcon(color, isSelected)

          return (
            <Marker
              key={listing.id}
              position={[listing.lat, listing.lng]}
              icon={icon}
              eventHandlers={{
                click: () => onListingSelect?.(listing.id),
              }}
              zIndexOffset={isSelected ? 1000 : 0}
            >
              <Popup
                autoPan={true}
                closeButton={false}
                className="bicimarket-popup"
                eventHandlers={{
                  remove: () => {
                    if (!isSelected) onListingSelect?.(null)
                  },
                }}
              >
                <PopupContent listing={listing} locale={locale} />
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-6 right-3 z-[400] bg-secondary-900/90 backdrop-blur-sm border border-white/10 rounded-xl p-3 shadow-xl">
        <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
          Bike Types
        </p>
        <div className="flex flex-col gap-1.5">
          {Object.entries(TYPE_COLORS)
            .filter(([key]) => key !== 'default')
            .map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-white/70 text-xs capitalize">{type}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

// Separate component to render popup content cleanly
function PopupContent({ listing, locale }: { listing: MapListing; locale: string }) {
  return <ListingPopup listing={listing} locale={locale} />
}
