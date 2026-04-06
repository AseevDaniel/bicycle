'use client'
import { useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  ChevronLeft,
  MapPin,
  Upload,
  Plus,
  CheckCircle2,
  Sparkles,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react'
import { StepIndicator } from '@/components/sell/StepIndicator'
import { clsx } from 'clsx'
import Link from 'next/link'

/* ─── Constants ─── */
const BIKE_TYPES = [
  { id: 'road', label: 'Road', emoji: '🚴' },
  { id: 'mountain', label: 'Mountain', emoji: '⛰️' },
  { id: 'gravel', label: 'Gravel', emoji: '🏕️' },
  { id: 'electric', label: 'Electric', emoji: '⚡' },
  { id: 'city', label: 'City', emoji: '🏙️' },
  { id: 'hybrid', label: 'Hybrid', emoji: '🔀' },
  { id: 'bmx', label: 'BMX', emoji: '🤸' },
  { id: 'kids', label: 'Kids', emoji: '👶' },
  { id: 'folding', label: 'Folding', emoji: '📦' },
  { id: 'fixie', label: 'Fixie', emoji: '🎯' },
]

const BRANDS = [
  'Trek', 'Specialized', 'Giant', 'Cannondale', 'Scott', 'Bianchi',
  'Pinarello', 'Colnago', 'BMC', 'Cervelo', 'Orbea', 'Merida',
  'Cube', 'Focus', 'Felt', 'Wilier', 'De Rosa', 'Look', 'Other',
]

const CONDITIONS = [
  { id: 'A', label: 'Like New', desc: 'Barely used, perfect condition', color: 'emerald' },
  { id: 'B', label: 'Excellent', desc: 'Light use, minor cosmetic wear', color: 'blue' },
  { id: 'C', label: 'Good', desc: 'Regular use, fully functional', color: 'yellow' },
  { id: 'D', label: 'Fair', desc: 'Heavy use, needs minor fixes', color: 'orange' },
]

const FRAME_SIZES = ['XS (44-46cm)', 'S (47-50cm)', 'M (51-54cm)', 'L (55-58cm)', 'XL (59-62cm)', 'XXL (63cm+)']
const FRAME_MATERIALS = ['Carbon', 'Aluminum', 'Steel', 'Titanium', 'Chromoly']

const DEMO_PHOTOS = [
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80',
  'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&q=80',
  'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&q=80',
  'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80',
]

const STEPS = [
  { label: 'Bike Type' },
  { label: 'Details' },
  { label: 'Description' },
  { label: 'Photos' },
  { label: 'Review' },
]

/* ─── Zod schemas per step ─── */
const step1Schema = z.object({ bikeType: z.string().min(1, 'Please select a bike type') })
const step2Schema = z.object({
  brand: z.string().min(1, 'Please select a brand'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().min(1, 'Year is required'),
  condition: z.string().min(1, 'Condition is required'),
  frameSize: z.string().min(1, 'Frame size is required'),
  frameMaterial: z.string().optional(),
  color: z.string().min(1, 'Color is required'),
  price: z.string().regex(/^\d+$/, 'Enter a valid price'),
  openToOffers: z.boolean().optional(),
})
const step3Schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  location: z.string().min(2, 'Please enter your location'),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>

interface AllFormData extends Step1Data, Step2Data, Step3Data {
  photos: string[]
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

/* ─── Step components ─── */
function Step1Bike({
  onNext,
  defaultValue,
}: {
  onNext: (data: Step1Data) => void
  defaultValue?: string
}) {
  const { control, handleSubmit, formState: { errors } } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { bikeType: defaultValue ?? '' },
  })

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">What type of bike?</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Choose the category that best matches your bike</p>
      <Controller
        name="bikeType"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {BIKE_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => field.onChange(type.id)}
                className={clsx(
                  'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-150 hover:shadow-md',
                  field.value === type.id
                    ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md shadow-primary/10'
                    : 'border-gray-200 dark:border-secondary-600 hover:border-primary/40 hover:bg-gray-50 dark:hover:bg-secondary-700'
                )}
              >
                <span className="text-3xl">{type.emoji}</span>
                <span className={clsx(
                  'text-sm font-semibold',
                  field.value === type.id ? 'text-primary' : 'text-gray-700 dark:text-gray-300'
                )}>
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        )}
      />
      {errors.bikeType && <p className="mt-3 text-sm text-red-500">{errors.bikeType.message}</p>}
      <div className="flex justify-end mt-8">
        <button type="submit" className="btn-primary flex items-center gap-2">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  )
}

function Step2Details({
  onNext,
  onBack,
  defaultValues,
}: {
  onNext: (data: Step2Data) => void
  onBack: () => void
  defaultValues?: Partial<Step2Data>
}) {
  const { register, control, watch, handleSubmit, formState: { errors } } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: { openToOffers: false, ...defaultValues },
  })
  const openToOffers = watch('openToOffers')
  const currentYear = new Date().getFullYear()

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Bike details</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Tell buyers what they need to know</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Brand</label>
          <select {...register('brand')} className="input">
            <option value="">Select brand</option>
            {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          {errors.brand && <p className="mt-1 text-xs text-red-500">{errors.brand.message}</p>}
        </div>
        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Model</label>
          <input {...register('model')} placeholder="e.g. Domane SL 6" className="input" />
          {errors.model && <p className="mt-1 text-xs text-red-500">{errors.model.message}</p>}
        </div>
        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Year</label>
          <select {...register('year')} className="input">
            <option value="">Select year</option>
            {Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          {errors.year && <p className="mt-1 text-xs text-red-500">{errors.year.message}</p>}
        </div>
        {/* Frame size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Frame Size</label>
          <select {...register('frameSize')} className="input">
            <option value="">Select size</option>
            {FRAME_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.frameSize && <p className="mt-1 text-xs text-red-500">{errors.frameSize.message}</p>}
        </div>
        {/* Frame material */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Frame Material</label>
          <select {...register('frameMaterial')} className="input">
            <option value="">Select material</option>
            {FRAME_MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Color</label>
          <input {...register('color')} placeholder="e.g. Matte Black" className="input" />
          {errors.color && <p className="mt-1 text-xs text-red-500">{errors.color.message}</p>}
        </div>
      </div>

      {/* Condition */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Condition</label>
        <Controller
          name="condition"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CONDITIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => field.onChange(c.id)}
                  className={clsx(
                    'p-3 rounded-xl border-2 text-left transition-all duration-150',
                    field.value === c.id
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-secondary-600 hover:border-primary/30'
                  )}
                >
                  <div className={clsx('text-sm font-bold', {
                    'text-emerald-600 dark:text-emerald-400': c.color === 'emerald',
                    'text-blue-600 dark:text-blue-400': c.color === 'blue',
                    'text-yellow-600 dark:text-yellow-400': c.color === 'yellow',
                    'text-orange-600 dark:text-orange-400': c.color === 'orange',
                  })}>
                    {c.id} — {c.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{c.desc}</div>
                </button>
              ))}
            </div>
          )}
        />
        {errors.condition && <p className="mt-1 text-xs text-red-500">{errors.condition.message}</p>}
      </div>

      {/* Price */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Asking Price</label>
        <div className="relative max-w-xs">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">€</span>
          <input {...register('price')} type="number" min="0" placeholder="2500" className="input pl-8" />
        </div>
        {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}

        {/* Open to offers toggle */}
        <Controller
          name="openToOffers"
          control={control}
          render={({ field }) => (
            <button
              type="button"
              onClick={() => field.onChange(!field.value)}
              className="flex items-center gap-2 mt-3 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              {openToOffers ? (
                <ToggleRight className="w-6 h-6 text-primary" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-gray-400" />
              )}
              <span className={openToOffers ? 'text-primary font-medium' : ''}>Open to offers</span>
            </button>
          )}
        />
      </div>

      <div className="flex items-center justify-between mt-8">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button type="submit" className="btn-primary flex items-center gap-2">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  )
}

function Step3Description({
  onNext,
  onBack,
  defaultValues,
  suggestedTitle,
}: {
  onNext: (data: Step3Data) => void
  onBack: () => void
  defaultValues?: Partial<Step3Data>
  suggestedTitle?: string
}) {
  const { register, setValue, watch, handleSubmit, formState: { errors } } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: { title: suggestedTitle ?? '', ...defaultValues },
  })
  const description = watch('description') ?? ''

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Description & Location</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Help buyers know what makes this bike special</p>

      {/* Title */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Listing Title</label>
          {suggestedTitle && (
            <button
              type="button"
              onClick={() => setValue('title', suggestedTitle)}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary-600 font-medium"
            >
              <Sparkles className="w-3 h-3" />
              Use suggestion
            </button>
          )}
        </div>
        <input {...register('title')} className="input" placeholder={suggestedTitle ?? 'My awesome bike'} />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <span className={clsx('text-xs', description.length < 50 ? 'text-red-400' : 'text-gray-400')}>
            {description.length} / 50 min
          </span>
        </div>
        <textarea
          {...register('description')}
          rows={5}
          placeholder="Describe the bike's history, any upgrades or repairs, reason for selling..."
          className="input resize-none"
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Location</label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input {...register('location')} placeholder="City / Area" className="input pl-10" />
        </div>
        {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location.message}</p>}
      </div>

      <div className="flex items-center justify-between mt-8">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 font-medium transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button type="submit" className="btn-primary flex items-center gap-2">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  )
}

function Step4Photos({
  onNext,
  onBack,
  photos,
  setPhotos,
}: {
  onNext: () => void
  onBack: () => void
  photos: string[]
  setPhotos: (p: string[]) => void
}) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  const addDemoPhoto = () => {
    if (photos.length >= 4) return
    const next = DEMO_PHOTOS[photos.length]
    if (next) setPhotos([...photos, next])
    setError('')
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    if (photos.length === 0) {
      setError('Please add at least one photo')
      return
    }
    onNext()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Photos</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Great photos get more buyers. Add at least one.</p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addDemoPhoto() }}
        className={clsx(
          'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-150',
          dragging
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-gray-300 dark:border-secondary-600 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-secondary-700/50'
        )}
        onClick={addDemoPhoto}
      >
        <Upload className={clsx('w-10 h-10 mx-auto mb-3 transition-colors', dragging ? 'text-primary' : 'text-gray-400')} />
        <p className="font-medium text-gray-700 dark:text-gray-300">Drag & drop photos here</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">or click to add demo photos</p>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">JPG, PNG up to 10MB each · Max 10 photos</p>
      </div>

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-secondary-700">
              <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
              {index === 0 && (
                <div className="absolute top-1.5 left-1.5 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  Cover
                </div>
              )}
              <button
                onClick={() => removePhoto(index)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ))}
          {photos.length < 10 && (
            <button
              onClick={addDemoPhoto}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-secondary-600 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs font-medium">Add</span>
            </button>
          )}
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-between mt-8">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 font-medium transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={handleNext} className="btn-primary flex items-center gap-2">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function Step5Review({
  onBack,
  onPublish,
  data,
  photos,
  published,
  localePath,
}: {
  onBack: () => void
  onPublish: () => void
  data: Partial<AllFormData>
  photos: string[]
  published: boolean
  localePath: string
}) {
  if (published) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
          className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </motion.div>

        {/* Confetti-style particles */}
        <div className="relative">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, y: 0, x: 0 }}
              animate={{
                opacity: 0,
                y: -80 - Math.random() * 60,
                x: (Math.random() - 0.5) * 200,
              }}
              transition={{ duration: 1.2, delay: i * 0.08, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
              style={{
                backgroundColor: ['#FF4D00', '#00D4AA', '#FFD700', '#FF69B4', '#4169E1'][i % 5],
              }}
            />
          ))}
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your bike is live!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Your listing has been published successfully.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`${localePath}/listings/demo-new-listing`} className="btn-primary flex items-center gap-2 justify-center">
            <ExternalLink className="w-4 h-4" />
            View listing
          </Link>
          <Link href={`${localePath}/sell`} className="btn-outline flex items-center gap-2 justify-center">
            + Sell another bike
          </Link>
        </div>
      </motion.div>
    )
  }

  const bikeTypeData = BIKE_TYPES.find((t) => t.id === data.bikeType)

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Review your listing</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Check everything looks right before publishing</p>

      <div className="card overflow-hidden">
        {/* Cover photo */}
        {photos[0] ? (
          <div className="aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-secondary-700">
            <img src={photos[0]} alt="Cover" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-[16/9] bg-gray-100 dark:bg-secondary-700 flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-gray-300 dark:text-gray-600" />
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{data.title || 'Untitled Listing'}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {data.brand} {data.model} · {data.year} · {bikeTypeData?.emoji} {bikeTypeData?.label}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-2xl font-bold text-primary">€{data.price || 0}</span>
              {data.openToOffers && (
                <p className="text-xs text-accent-600 dark:text-accent-400 font-medium">Negotiable</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
            <div className="bg-gray-50 dark:bg-secondary-700/50 rounded-lg p-2.5">
              <div className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Condition</div>
              <div className="font-semibold text-gray-700 dark:text-gray-300">
                {CONDITIONS.find((c) => c.id === data.condition)?.label ?? data.condition}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-secondary-700/50 rounded-lg p-2.5">
              <div className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Frame Size</div>
              <div className="font-semibold text-gray-700 dark:text-gray-300">{data.frameSize}</div>
            </div>
            <div className="bg-gray-50 dark:bg-secondary-700/50 rounded-lg p-2.5">
              <div className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Location</div>
              <div className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <MapPin className="w-3 h-3" />{data.location}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-secondary-700/50 rounded-lg p-2.5">
              <div className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Photos</div>
              <div className="font-semibold text-gray-700 dark:text-gray-300">{photos.length} photo{photos.length !== 1 ? 's' : ''}</div>
            </div>
          </div>

          {data.description && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{data.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 font-medium transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={onPublish} className="btn-primary flex items-center gap-2 !px-8">
          <DollarSign className="w-4 h-4" />
          Publish Listing
        </button>
      </div>
    </div>
  )
}

/* ─── Main Sell Page ─── */
export default function SellPage() {
  const params = useParams()
  const locale = params?.locale as string | undefined
  const localePath = locale && locale !== 'en' ? `/${locale}` : ''

  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [formData, setFormData] = useState<Partial<AllFormData>>({})
  const [photos, setPhotos] = useState<string[]>([])
  const [published, setPublished] = useState(false)

  const goNext = useCallback(() => {
    setDirection(1)
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1))
  }, [])

  const goBack = useCallback(() => {
    setDirection(-1)
    setCurrentStep((s) => Math.max(s - 1, 0))
  }, [])

  const handleStep1 = (data: Step1Data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    goNext()
  }
  const handleStep2 = (data: Step2Data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    goNext()
  }
  const handleStep3 = (data: Step3Data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    goNext()
  }

  const handlePublish = async () => {
    await new Promise((r) => setTimeout(r, 800))
    setPublished(true)
  }

  const suggestedTitle = formData.brand && formData.model
    ? `${formData.brand} ${formData.model} ${formData.year ?? ''}`.trim()
    : undefined

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Sell Your Bike</h1>
          <p className="text-gray-500 dark:text-gray-400">List your bike in minutes and reach thousands of buyers</p>
        </div>

        {!published && (
          <div className="mb-8">
            <StepIndicator steps={STEPS} currentStep={currentStep} />
          </div>
        )}

        <div className="card p-6 sm:p-8 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {currentStep === 0 && (
                <Step1Bike onNext={handleStep1} defaultValue={formData.bikeType} />
              )}
              {currentStep === 1 && (
                <Step2Details
                  onNext={handleStep2}
                  onBack={goBack}
                  defaultValues={formData as Partial<Step2Data>}
                />
              )}
              {currentStep === 2 && (
                <Step3Description
                  onNext={handleStep3}
                  onBack={goBack}
                  defaultValues={formData as Partial<Step3Data>}
                  suggestedTitle={suggestedTitle}
                />
              )}
              {currentStep === 3 && (
                <Step4Photos
                  onNext={goNext}
                  onBack={goBack}
                  photos={photos}
                  setPhotos={setPhotos}
                />
              )}
              {currentStep === 4 && (
                <Step5Review
                  onBack={goBack}
                  onPublish={handlePublish}
                  data={formData}
                  photos={photos}
                  published={published}
                  localePath={localePath}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
