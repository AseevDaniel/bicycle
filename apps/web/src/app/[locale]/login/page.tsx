'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Bike, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale as string | undefined
  const localePath = locale && locale !== 'en' ? `/${locale}` : ''

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    login(data.email)
    toast.success('Welcome back to BiciMarket!')
    router.push(`${localePath}/profile`)
  }

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    login(`demo@${provider}.com`)
    toast.success(`Signed in with ${provider}!`)
    router.push(`${localePath}/profile`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900 flex items-center justify-center py-12 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Card */}
        <motion.div
          custom={0}
          variants={fadeIn}
          className="bg-white dark:bg-secondary-800 rounded-3xl shadow-xl border border-gray-100 dark:border-secondary-700 p-8"
        >
          {/* Logo */}
          <motion.div custom={1} variants={fadeIn} className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-400 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <Bike className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-secondary dark:text-white">
              Bici<span className="text-primary">Market</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Sign in to your account
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <motion.div custom={2} variants={fadeIn}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="input pl-10"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div custom={3} variants={fadeIn}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link
                  href={`${localePath}/forgot-password`}
                  className="text-xs text-primary hover:text-primary-600 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </motion.div>

            {/* Submit */}
            <motion.div custom={4} variants={fadeIn}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center gap-2 mt-2 h-12 text-base"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Log In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div custom={5} variants={fadeIn} className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-secondary-600" />
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-secondary-600" />
          </motion.div>

          {/* Social buttons */}
          <motion.div custom={6} variants={fadeIn} className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 hover:bg-gray-50 dark:hover:bg-secondary-600 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('Facebook')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 hover:bg-gray-50 dark:hover:bg-secondary-600 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </motion.div>

          {/* Register link */}
          <motion.p custom={7} variants={fadeIn} className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link href={`${localePath}/register`} className="text-primary font-semibold hover:text-primary-600">
              Sign up for free
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  )
}
