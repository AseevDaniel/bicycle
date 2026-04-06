'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  Bike,
  ShoppingBag,
  Tag,
  Wrench,
  Map,
  MessageSquare,
  User,
  LogIn,
  UserPlus,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Globe,
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { clsx } from 'clsx'

const LOCALES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
]

export function Navbar() {
  const t = useTranslations('nav')
  const { theme, toggle } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  // Detect current locale from pathname
  const currentLocale =
    LOCALES.find((l) => pathname.startsWith(`/${l.code}/`) || pathname === `/${l.code}`)
      ?.code ?? 'en'
  const currentLocaleData = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0]

  // Close language dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const switchLocale = (locale: string) => {
    setLangOpen(false)
    // Replace locale prefix in pathname
    const segments = pathname.split('/')
    const knownLocales = LOCALES.map((l) => l.code)
    if (knownLocales.includes(segments[1])) {
      segments[1] = locale === 'en' ? '' : locale
      const newPath = segments.filter((s, i) => i !== 0 || s === '').join('/') || '/'
      router.push(newPath.replace(/^\/\//, '/') || `/${locale}`)
    } else {
      router.push(locale === 'en' ? pathname : `/${locale}${pathname}`)
    }
  }

  const navLinks = [
    { href: '/buy', label: t('buy'), icon: ShoppingBag },
    { href: '/sell', label: t('sell'), icon: Tag },
    { href: '/rent', label: t('rent'), icon: Bike },
    { href: '/repair', label: t('repair'), icon: Wrench },
    { href: '/map', label: t('map'), icon: Map },
  ]

  const isLoggedIn = false // placeholder – replace with real auth state

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-secondary-900/90 backdrop-blur-md border-b border-gray-100 dark:border-secondary-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={currentLocale === 'en' ? '/' : `/${currentLocale}`}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-gradient-orange rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Bike className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-secondary dark:text-white">
              Bici<span className="text-primary">Market</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={`${currentLocale === 'en' ? '' : `/${currentLocale}`}${href}`}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname.includes(href)
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors"
                aria-label="Switch language"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLocaleData.flag} {currentLocaleData.code.toUpperCase()}</span>
                <ChevronDown className={clsx('w-3 h-3 transition-transform', langOpen && 'rotate-180')} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-gray-100 dark:border-secondary-700 py-1 z-50 animate-slide-down">
                  {LOCALES.map((locale) => (
                    <button
                      key={locale.code}
                      onClick={() => switchLocale(locale.code)}
                      className={clsx(
                        'w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors',
                        locale.code === currentLocale
                          ? 'text-primary font-semibold'
                          : 'text-gray-700 dark:text-gray-300'
                      )}
                    >
                      <span>{locale.flag}</span>
                      <span>{locale.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Auth buttons (desktop) */}
            <div className="hidden md:flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <Link
                    href={`${currentLocale === 'en' ? '' : `/${currentLocale}`}/messages`}
                    className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors"
                    aria-label={t('messages')}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`${currentLocale === 'en' ? '' : `/${currentLocale}`}/profile`}
                    className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors"
                    aria-label={t('profile')}
                  >
                    <User className="w-4 h-4" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={`${currentLocale === 'en' ? '' : `/${currentLocale}`}/login`}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    {t('login')}
                  </Link>
                  <Link
                    href={`${currentLocale === 'en' ? '' : `/${currentLocale}`}/signup`}
                    className="flex items-center gap-1.5 btn-primary text-sm !py-2 !px-4"
                  >
                    <UserPlus className="w-4 h-4" />
                    {t('signup')}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-secondary-700 py-3 animate-slide-down">
            <div className="flex flex-col gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={`${currentLocale === 'en' ? '' : `/${currentLocale}`}${href}`}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    pathname.includes(href)
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}

              <div className="border-t border-gray-100 dark:border-secondary-700 mt-2 pt-2 flex flex-col gap-1">
                {isLoggedIn ? (
                  <>
                    <Link
                      href={`${currentLocale === 'en' ? '' : `/${currentLocale}`}/messages`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {t('messages')}
                    </Link>
                    <Link
                      href={`${currentLocale === 'en' ? '' : `/${currentLocale}`}/profile`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {t('profile')}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={`${currentLocale === 'en' ? '' : `/${currentLocale}`}/login`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      {t('login')}
                    </Link>
                    <Link
                      href={`${currentLocale === 'en' ? '' : `/${currentLocale}`}/signup`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 mx-4 btn-primary text-sm justify-center"
                    >
                      <UserPlus className="w-4 h-4" />
                      {t('signup')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
