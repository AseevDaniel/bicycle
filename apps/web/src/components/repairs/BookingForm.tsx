'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Calendar, Wrench, ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'
import type { MechanicService } from './MechanicCard'

interface BookingFormProps {
  mechanicName: string
  services: MechanicService[]
}

function generateRef() {
  return 'RP-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

export function BookingForm({ mechanicName, services }: BookingFormProps) {
  const [serviceId, setServiceId] = useState(services[0]?.id ?? '')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [bookingRef] = useState(generateRef)

  const selectedService = services.find((s) => s.id === serviceId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!serviceId || !date) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="bg-secondary-800/70 border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-white/10">
        <h3 className="text-white font-bold text-lg">Book a Service</h3>
        <p className="text-white/50 text-sm mt-0.5">with {mechanicName}</p>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="p-5 space-y-4"
          >
            {/* Service selector */}
            <div>
              <label className="text-white/60 text-xs font-semibold uppercase tracking-wider block mb-2">
                Service
              </label>
              <div className="relative">
                <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-400 pointer-events-none" />
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  required
                  className="w-full appearance-none bg-secondary-700 border border-white/10 text-white text-sm rounded-xl pl-9 pr-8 py-3 focus:outline-none focus:border-primary-500/50 cursor-pointer"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id} className="bg-secondary-700">
                      {s.name} — €{s.price} ({s.duration})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              </div>

              {selectedService && (
                <div className="flex gap-3 mt-2">
                  <span className="text-xs text-primary-400 font-semibold">€{selectedService.price}</span>
                  <span className="text-xs text-white/40">·</span>
                  <span className="text-xs text-white/40">{selectedService.duration}</span>
                  <span className="text-xs text-white/40">·</span>
                  <span className="text-xs text-accent-400 capitalize">{selectedService.category}</span>
                </div>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="text-white/60 text-xs font-semibold uppercase tracking-wider block mb-2">
                Preferred Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-400 pointer-events-none" />
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-secondary-700 border border-white/10 text-white text-sm rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:border-primary-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-white/60 text-xs font-semibold uppercase tracking-wider block mb-2">
                Describe the Problem <span className="text-white/30 normal-case font-normal">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="E.g. My rear derailleur is not shifting smoothly, especially on the smaller sprockets..."
                className="w-full bg-secondary-700 border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500/50 transition-colors resize-none placeholder:text-white/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !serviceId || !date}
              className={clsx(
                'w-full py-3.5 rounded-xl font-bold text-white transition-all duration-200',
                loading || !serviceId || !date
                  ? 'bg-primary-500/40 cursor-not-allowed'
                  : 'bg-primary-500 hover:bg-primary-600 active:scale-[0.98]'
              )}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending Request…
                </span>
              ) : (
                'Request Booking'
              )}
            </button>

            <p className="text-white/30 text-xs text-center">
              Demo only — no real booking will be made
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="p-8 flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-accent-500/20 border-2 border-accent-500/50 flex items-center justify-center mb-4"
            >
              <CheckCircle className="w-8 h-8 text-accent-400 fill-accent-500/30" />
            </motion.div>

            <h3 className="text-xl font-bold text-white mb-2">Request Sent!</h3>
            <p className="text-white/60 text-sm mb-5">
              {mechanicName} will confirm your booking within their typical response time.
            </p>

            <div className="bg-secondary-700/60 rounded-xl px-5 py-3 mb-5 w-full">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Booking Reference</p>
              <p className="text-primary-400 font-mono font-bold text-lg">{bookingRef}</p>
            </div>

            {selectedService && (
              <div className="text-white/50 text-sm space-y-1 mb-5">
                <p><span className="text-white">{selectedService.name}</span></p>
                <p>{date ? new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}</p>
              </div>
            )}

            <button
              onClick={() => setSubmitted(false)}
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Book another service
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
