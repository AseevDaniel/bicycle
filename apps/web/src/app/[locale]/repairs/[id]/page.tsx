'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Truck,
  Globe,
  Star,
  Wrench,
  ShieldCheck,
  CheckCircle,
  Timer,
  ChevronRight,
} from 'lucide-react'
import { StarRating } from '@/components/ui/StarRating'
import { BookingForm } from '@/components/repairs/BookingForm'
import { clsx } from 'clsx'

const MOCK_MECHANICS = [
  {
    id: 'm1',
    name: 'Miguel Torres',
    avatar: 'https://i.pravatar.cc/150?img=11',
    bio: 'Certified Shimano mechanic with 15 years experience. Specializing in road bikes and e-bikes. Former professional cyclist turned full-time wrench. I pride myself on fast turnaround, transparent pricing, and treating your bike like it\'s my own.',
    specialties: ['Road', 'E-bike', 'Shimano certified'],
    certifications: ['Shimano Service Center', 'Campagnolo Certified', 'UCI Mechanic Level 2'],
    rating: 4.9,
    reviewCount: 87,
    city: 'Málaga',
    isMobile: true,
    priceRange: { min: 30, max: 120 },
    responseTime: '< 2 hours',
    languages: ['es', 'en'],
    services: [
      { id: 's1', name: 'Full Tune-Up', price: 65, duration: '2-3 hours', category: 'maintenance', description: 'Complete inspection and adjustment of all components: brakes, gears, bearings, cables, and tyre pressure.' },
      { id: 's2', name: 'Brake Adjustment', price: 25, duration: '30 min', category: 'repair', description: 'Adjust brake pad alignment, cable tension, and lever feel for both rim and disc brakes.' },
      { id: 's3', name: 'Drivetrain Service', price: 45, duration: '1.5 hours', category: 'maintenance', description: 'Deep clean and lubrication of chain, cassette, chainrings, and derailleur. Includes indexing.' },
      { id: 's4', name: 'Wheel Truing', price: 20, duration: '30 min', category: 'repair', description: 'True wheel to within 0.5mm lateral and 1mm radial tolerance. Spoke tension equalized.' },
    ],
    reviews: [
      { author: 'James T.', avatar: 'https://i.pravatar.cc/150?img=33', rating: 5, date: 'March 2026', comment: 'Miguel is an absolute pro. My bike was shifting like new after his drivetrain service. Fast, friendly, and came to my hotel!' },
      { author: 'Elena M.', avatar: 'https://i.pravatar.cc/150?img=47', rating: 5, date: 'February 2026', comment: 'Incredible work on my e-bike. He diagnosed a motor noise that two other shops couldn\'t fix. Highly recommend.' },
      { author: 'Paul H.', avatar: 'https://i.pravatar.cc/150?img=55', rating: 5, date: 'February 2026', comment: 'Showed up on time, fixed everything, gave great advice on maintenance. Will use again for sure.' },
      { author: 'Sara L.', avatar: 'https://i.pravatar.cc/150?img=44', rating: 4, date: 'January 2026', comment: 'Very knowledgeable, fixed my brakes perfectly. Slightly longer than estimated but worth the wait.' },
    ],
    ratingBreakdown: { 5: 71, 4: 12, 3: 3, 2: 1, 1: 0 },
  },
  {
    id: 'm2',
    name: 'Lena Hoffmann',
    avatar: 'https://i.pravatar.cc/150?img=47',
    bio: 'German-trained bicycle technician with a passion for mountain bikes and suspension setup. 10 years in the industry, 5 in Spain. Workshop based in Marbella, specializing in complex suspension work and precision builds.',
    specialties: ['MTB', 'Suspension', 'SRAM certified'],
    certifications: ['SRAM Certified Technician', 'RockShox Service Specialist', 'Fox Suspension Certified'],
    rating: 4.8,
    reviewCount: 53,
    city: 'Marbella',
    isMobile: false,
    priceRange: { min: 35, max: 150 },
    responseTime: '< 4 hours',
    languages: ['de', 'en', 'es'],
    services: [
      { id: 's1', name: 'Suspension Service (fork)', price: 80, duration: '3-4 hours', category: 'maintenance', description: 'Full strip, clean, re-lube, and rebuild of your suspension fork. New seals and bath oil included.' },
      { id: 's2', name: 'Full Tune-Up', price: 70, duration: '2-3 hours', category: 'maintenance', description: 'Complete bike inspection and service including all drivetrain components, brakes, and cables.' },
      { id: 's3', name: 'Tyre Change (pair)', price: 35, duration: '45 min', category: 'repair', description: 'Remove old tyres, fit new ones, inflate to correct pressure. Tubeless setup available on request (+€15).' },
      { id: 's4', name: 'Hydraulic Brake Bleed', price: 45, duration: '1 hour', category: 'repair', description: 'Full mineral oil or DOT fluid flush and bleed for Shimano, SRAM, or Magura brakes.' },
    ],
    reviews: [
      { author: 'Markus B.', avatar: 'https://i.pravatar.cc/150?img=12', rating: 5, date: 'March 2026', comment: 'Best suspension work I\'ve ever had done. My fork feels like a completely new component. Worth every cent.' },
      { author: 'Claire D.', avatar: 'https://i.pravatar.cc/150?img=48', rating: 5, date: 'January 2026', comment: 'Lena is incredibly professional. Explained everything clearly and the results speak for themselves.' },
    ],
    ratingBreakdown: { 5: 44, 4: 7, 3: 2, 2: 0, 1: 0 },
  },
  {
    id: 'm3',
    name: 'Andrés Vega',
    avatar: 'https://i.pravatar.cc/150?img=7',
    bio: 'E-bike specialist and Bosch certified technician. Based in Torremolinos, mobile service available along the coast from Málaga to Estepona.',
    specialties: ['E-bike', 'Bosch certified', 'Cargo bikes'],
    certifications: ['Bosch eBike Systems Certified', 'Shimano Steps Specialist'],
    rating: 4.7,
    reviewCount: 41,
    city: 'Torremolinos',
    isMobile: true,
    priceRange: { min: 40, max: 130 },
    responseTime: '< 3 hours',
    languages: ['es', 'en'],
    services: [
      { id: 's1', name: 'E-bike Diagnostics', price: 40, duration: '1 hour', category: 'repair', description: 'Full system scan and diagnostics using manufacturer tools. Error code reading and fault analysis.' },
      { id: 's2', name: 'Battery Health Check', price: 30, duration: '30 min', category: 'maintenance', description: 'Capacity test, cell balance check, and charge cycle assessment. Report provided.' },
      { id: 's3', name: 'Motor Service', price: 90, duration: '3 hours', category: 'maintenance', description: 'Mid-drive motor cleaning, bearing inspection, torque sensor calibration, and software update.' },
      { id: 's4', name: 'Cable & Housing Set', price: 50, duration: '1.5 hours', category: 'repair', description: 'Replace all brake and gear cables and housing for crisp, reliable performance.' },
    ],
    reviews: [
      { author: 'Dirk V.', avatar: 'https://i.pravatar.cc/150?img=15', rating: 5, date: 'February 2026', comment: 'Diagnosed my Bosch motor issue in minutes when the dealer said it would take weeks. Superb.' },
    ],
    ratingBreakdown: { 5: 30, 4: 8, 3: 2, 2: 1, 1: 0 },
  },
  {
    id: 'm4',
    name: 'Tom Richardson',
    avatar: 'https://i.pravatar.cc/150?img=14',
    bio: 'British-born ex-racer with a passion for road and gravel bikes. Precision cable routing and custom builds are my specialty. Workshop in Fuengirola.',
    specialties: ['Road', 'Gravel', 'Custom builds'],
    certifications: ['Campagnolo Certified', 'Colnago Dealer Technician'],
    rating: 5.0,
    reviewCount: 29,
    city: 'Fuengirola',
    isMobile: false,
    priceRange: { min: 30, max: 140 },
    responseTime: '< 2 hours',
    languages: ['en', 'es'],
    services: [
      { id: 's1', name: 'Race-Ready Setup', price: 90, duration: '3-4 hours', category: 'maintenance', description: 'Pre-event full service: all components checked, lubed, adjusted, and optimized for peak performance.' },
      { id: 's2', name: 'Fit Consultation', price: 60, duration: '1 hour', category: 'maintenance', description: 'Saddle height, cleat position, reach and drop measurement. Recommendations based on riding style.' },
      { id: 's3', name: 'Custom Cable Routing', price: 70, duration: '2 hours', category: 'repair', description: 'Full internal or external re-routing with premium cables and housing. Clean, silent, and precise.' },
      { id: 's4', name: 'Bearing Overhaul', price: 55, duration: '2 hours', category: 'maintenance', description: 'Headset, bottom bracket, and hub bearing service. Press-fit or threaded BB supported.' },
    ],
    reviews: [
      { author: 'Phil G.', avatar: 'https://i.pravatar.cc/150?img=21', rating: 5, date: 'March 2026', comment: 'Tom built my dream gravel bike from scratch. Absolute craftsman. Zero compromises.' },
    ],
    ratingBreakdown: { 5: 29, 4: 0, 3: 0, 2: 0, 1: 0 },
  },
  {
    id: 'm5',
    name: 'Fatima El Amrani',
    avatar: 'https://i.pravatar.cc/150?img=45',
    bio: 'Versatile mechanic handling everything from city bikes to full-suspension MTB. Friendly, affordable, and always on time. Serving Nerja and surroundings.',
    specialties: ['City', 'MTB', 'Kids bikes'],
    certifications: ['Bicycle Mechanic Level 3 (IMI)'],
    rating: 4.6,
    reviewCount: 68,
    city: 'Nerja',
    isMobile: true,
    priceRange: { min: 20, max: 90 },
    responseTime: '< 5 hours',
    languages: ['es', 'fr', 'en'],
    services: [
      { id: 's1', name: 'Basic Service', price: 35, duration: '1 hour', category: 'maintenance', description: 'Safety check, brake and gear adjustment, lubrication, and tyre pressure top-up.' },
      { id: 's2', name: 'Puncture Repair', price: 20, duration: '30 min', category: 'repair', description: 'Remove wheel, repair or replace inner tube, and reinstall. Tyre bead inspection included.' },
      { id: 's3', name: 'Gear Indexing', price: 25, duration: '45 min', category: 'repair', description: 'Front and rear derailleur cable tension adjustment for crisp, precise shifting.' },
      { id: 's4', name: 'Full Tune-Up', price: 60, duration: '2 hours', category: 'maintenance', description: 'Complete service covering all mechanical components. Ideal for seasonal preparation.' },
    ],
    reviews: [
      { author: 'Charlotte P.', avatar: 'https://i.pravatar.cc/150?img=38', rating: 5, date: 'March 2026', comment: 'Fatima came to my house, fixed the bike in under an hour, and was incredibly friendly. 10/10!' },
    ],
    ratingBreakdown: { 5: 51, 4: 13, 3: 3, 2: 1, 1: 0 },
  },
  {
    id: 'm6',
    name: 'Pavel Novák',
    avatar: 'https://i.pravatar.cc/150?img=17',
    bio: 'Czech mechanic specializing in touring and long-distance setups. Expert in rack, fender, and luggage system installation. Workshop in Estepona.',
    specialties: ['Touring', 'Road', 'Fitting'],
    certifications: ['Ortlieb Fitting Specialist', 'Tubus Rack Technician'],
    rating: 4.8,
    reviewCount: 22,
    city: 'Estepona',
    isMobile: false,
    priceRange: { min: 30, max: 110 },
    responseTime: '< 6 hours',
    languages: ['en', 'de', 'ru'],
    services: [
      { id: 's1', name: 'Touring Setup', price: 80, duration: '3 hours', category: 'maintenance', description: 'Full touring preparation: racks, fenders, lighting system, and long-distance drivetrain setup.' },
      { id: 's2', name: 'Rack & Fender Install', price: 45, duration: '1.5 hours', category: 'repair', description: 'Professional fitting of front and rear racks and/or fenders. Compatibility check included.' },
      { id: 's3', name: 'Full Tune-Up', price: 65, duration: '2-3 hours', category: 'maintenance', description: 'Comprehensive service suitable for any bike type, with focus on reliability over distance.' },
      { id: 's4', name: 'Headset Service', price: 40, duration: '1 hour', category: 'maintenance', description: 'Headset bearing clean, re-grease, and adjustment. Integrated and conventional headsets.' },
    ],
    reviews: [],
    ratingBreakdown: { 5: 18, 4: 3, 3: 1, 2: 0, 1: 0 },
  },
]

const FLAG_MAP: Record<string, string> = {
  es: '🇪🇸', en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷', ru: '🇷🇺', uk: '🇺🇦', nl: '🇳🇱', pt: '🇵🇹',
}

export default function MechanicProfilePage() {
  const params = useParams()
  const id = params.id as string
  const mechanic = MOCK_MECHANICS.find((m) => m.id === id)

  if (!mechanic) {
    return (
      <div className="min-h-screen bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🔧</p>
          <h1 className="text-white text-2xl font-bold mb-2">Mechanic not found</h1>
          <Link href="/repairs" className="text-primary-400 hover:text-primary-300 underline">
            Browse all mechanics
          </Link>
        </div>
      </div>
    )
  }

  const totalReviews = Object.values(mechanic.ratingBreakdown).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-secondary-900">
      {/* Back nav */}
      <div className="container mx-auto px-4 pt-6">
        <Link
          href="/repairs"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to mechanics
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary-800/50 border border-white/10 rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-wrap items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={mechanic.avatar}
                alt={mechanic.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-white/10"
              />
              {mechanic.isMobile && (
                <div className="absolute -bottom-2 -right-2 bg-accent-500 rounded-full px-2 py-0.5 flex items-center gap-1 border-2 border-secondary-800">
                  <Truck className="w-3 h-3 text-white" />
                  <span className="text-white text-xs font-bold">Mobile</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-white mb-1">{mechanic.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-white/60">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-accent-400" />
                  {mechanic.city}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-accent-400" />
                  Responds {mechanic.responseTime}
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4 text-white/30" />
                  {mechanic.languages.map((l) => FLAG_MAP[l] ?? l.toUpperCase()).join(' ')}
                </div>
              </div>

              <StarRating
                rating={mechanic.rating}
                size="md"
                showValue
                reviewCount={mechanic.reviewCount}
                className="mb-3"
              />

              <p className="text-white/70 leading-relaxed max-w-2xl">{mechanic.bio}</p>
            </div>

            {/* Price summary */}
            <div className="bg-secondary-700/60 rounded-2xl p-4 text-center shrink-0">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Services from</p>
              <p className="text-primary-400 text-3xl font-bold">€{mechanic.priceRange.min}</p>
              <p className="text-white/40 text-xs mt-1">Up to €{mechanic.priceRange.max}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Specialties & certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-secondary-800/50 border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-white font-bold text-lg mb-4">Specialties & Certifications</h2>
              <div className="flex flex-wrap gap-2 mb-5">
                {mechanic.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="inline-flex items-center bg-primary-500/10 text-primary-400 border border-primary-500/20 text-sm font-semibold px-3 py-1.5 rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
              <div className="space-y-2">
                {mechanic.certifications.map((cert) => (
                  <div key={cert} className="flex items-center gap-2 text-sm text-white/70">
                    <ShieldCheck className="w-4 h-4 text-accent-400 shrink-0" />
                    {cert}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Services table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-secondary-800/50 border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="p-6 pb-4 border-b border-white/5">
                <h2 className="text-white font-bold text-lg">Services & Pricing</h2>
              </div>
              <div className="divide-y divide-white/5">
                {mechanic.services.map((service) => (
                  <div key={service.id} className="p-5 hover:bg-white/2 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold">{service.name}</h3>
                          <span
                            className={clsx(
                              'text-xs font-semibold px-2 py-0.5 rounded-full capitalize',
                              service.category === 'maintenance'
                                ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                                : 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                            )}
                          >
                            {service.category}
                          </span>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mb-2">{service.description}</p>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <Timer className="w-3.5 h-3.5" />
                          {service.duration}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-primary-400 font-bold text-xl">€{service.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-secondary-800/50 border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-white font-bold text-lg mb-5">Reviews</h2>

              {/* Rating breakdown */}
              <div className="flex gap-6 mb-6 pb-6 border-b border-white/5">
                <div className="text-center shrink-0">
                  <p className="text-5xl font-bold text-white">{mechanic.rating.toFixed(1)}</p>
                  <StarRating rating={mechanic.rating} size="sm" className="justify-center mt-1" />
                  <p className="text-white/40 text-xs mt-1">{mechanic.reviewCount} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = mechanic.ratingBreakdown[star as keyof typeof mechanic.ratingBreakdown] ?? 0
                    const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs text-white/50">
                        <span className="w-4 text-right">{star}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 shrink-0" />
                        <div className="flex-1 h-1.5 bg-secondary-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-6 text-right">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {mechanic.reviews.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-4">No reviews yet</p>
              ) : (
                <div className="space-y-5">
                  {mechanic.reviews.map((review, i) => (
                    <div key={i} className="border-b border-white/5 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={review.avatar}
                            alt={review.author}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-white text-sm font-semibold">{review.author}</p>
                            <p className="text-white/40 text-xs">{review.date}</p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <p className="text-white/70 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right column — Booking form */}
          <div className="sticky top-24 h-fit">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <BookingForm mechanicName={mechanic.name} services={mechanic.services} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
