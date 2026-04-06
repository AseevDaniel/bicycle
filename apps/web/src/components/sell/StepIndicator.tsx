'use client'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface Step {
  label: string
  icon?: React.ReactNode
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Desktop: horizontal stepper */}
      <div className="hidden sm:flex items-center w-full">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep

          return (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted
                      ? '#FF4D00'
                      : isCurrent
                      ? '#FF4D00'
                      : '#e5e7eb',
                  }}
                  transition={{ duration: 0.2 }}
                  className={clsx(
                    'w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-200 shadow-sm',
                    isCompleted && 'bg-primary text-white',
                    isCurrent && 'bg-primary text-white ring-4 ring-primary/20',
                    isUpcoming && 'bg-gray-200 dark:bg-secondary-700 text-gray-400 dark:text-gray-500'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" strokeWidth={3} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>
                <span
                  className={clsx(
                    'text-xs font-medium whitespace-nowrap',
                    isCurrent ? 'text-primary' : isCompleted ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 mb-5">
                  <div className="h-0.5 bg-gray-200 dark:bg-secondary-700 relative overflow-hidden rounded-full">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-primary"
                      initial={false}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile: compact progress */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {steps[currentStep]?.label}
          </span>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-secondary-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary-400 rounded-full"
            initial={false}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  )
}
