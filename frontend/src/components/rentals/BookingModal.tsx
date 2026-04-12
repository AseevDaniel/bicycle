'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, Calendar, Bike, CreditCard, ShieldCheck } from 'lucide-react'
import { clsx } from 'clsx'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  rental: {
    id: string
    title: string
    photo: string
    city: string
    pricePerDay: number
    deposit: number
  }
  startDate: string
  endDate: string
  totalDays: number
  totalPrice: number
}

function generateRef() {
  return 'BM-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

export function BookingModal({
  isOpen,
  onClose,
  rental,
  startDate,
  endDate,
  totalDays,
  totalPrice,
}: BookingModalProps) {
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bookingRef] = useState(generateRef)

  // Reset on re-open
  useEffect(() => {
    if (isOpen) setConfirmed(false)
  }, [isOpen])

  const handleConfirm = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1400))
    setLoading(false)
    setConfirmed(true)
  }

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-secondary-800 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl pointer-events-auto overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h2 className="text-white font-bold text-lg">
                  {confirmed ? 'Booking Confirmed!' : 'Confirm Your Booking'}
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {!confirmed ? (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-5 space-y-4"
                  >
                    {/* Bike info */}
                    <div className="flex gap-3 bg-secondary-700/50 rounded-xl p-3">
                      <img
                        src={rental.photo}
                        alt={rental.title}
                        className="w-20 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="text-white font-semibold text-sm leading-tight">{rental.title}</p>
                        <p className="text-white/50 text-xs mt-1">{rental.city}</p>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="bg-secondary-700/50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-white/60">
                          <Calendar className="w-4 h-4 text-accent-400" />
                          <span>Pick-up</span>
                        </div>
                        <span className="text-white font-medium">{formatDate(startDate)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-white/60">
                          <Calendar className="w-4 h-4 text-accent-400" />
                          <span>Return</span>
                        </div>
                        <span className="text-white font-medium">{formatDate(endDate)}</span>
                      </div>
                      <div className="border-t border-white/10 pt-3 flex items-center justify-between text-sm">
                        <span className="text-white/60">Duration</span>
                        <span className="text-white font-medium">{totalDays} day{totalDays !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {/* Price breakdown */}
                    <div className="bg-secondary-700/50 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">
                          €{rental.pricePerDay} × {totalDays} day{totalDays !== 1 ? 's' : ''}
                        </span>
                        <span className="text-white">€{rental.pricePerDay * totalDays}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Refundable deposit</span>
                        <span className="text-white">€{rental.deposit}</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 flex justify-between">
                        <span className="text-white font-bold">Total due now</span>
                        <span className="text-primary-400 font-bold text-lg">€{totalPrice}</span>
                      </div>
                    </div>

                    {/* Demo notice */}
                    <div className="flex items-start gap-2 text-xs text-white/40 bg-white/5 rounded-xl p-3">
                      <ShieldCheck className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
                      <span>This is a demo — no actual payment will be processed.</span>
                    </div>

                    <button
                      onClick={handleConfirm}
                      disabled={loading}
                      className={clsx(
                        'w-full py-3.5 rounded-xl font-bold text-white transition-all duration-200',
                        loading
                          ? 'bg-primary-500/50 cursor-not-allowed'
                          : 'bg-primary-500 hover:bg-primary-600 active:scale-[0.98]'
                      )}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing…
                        </span>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 inline mr-2" />
                          Confirm Booking
                        </>
                      )}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="p-8 flex flex-col items-center text-center"
                  >
                    {/* Animated checkmark */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15, delay: 0.1 }}
                      className="w-20 h-20 rounded-full bg-accent-500/20 border-2 border-accent-500/50 flex items-center justify-center mb-4"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 12, delay: 0.25 }}
                      >
                        <CheckCircle className="w-10 h-10 text-accent-400 fill-accent-500/30" />
                      </motion.div>
                    </motion.div>

                    <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
                    <p className="text-white/60 text-sm mb-6">
                      Your rental has been booked successfully. The owner will contact you with pickup details.
                    </p>

                    <div className="bg-secondary-700/60 rounded-xl px-6 py-4 mb-6 w-full">
                      <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Booking Reference</p>
                      <p className="text-primary-400 font-mono font-bold text-xl">{bookingRef}</p>
                    </div>

                    <div className="text-white/40 text-xs mb-6">
                      {formatDate(startDate)} → {formatDate(endDate)} · {totalDays} day{totalDays !== 1 ? 's' : ''}
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      Close
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
