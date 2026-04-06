'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Bike, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

const LOCALES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
]

export function Footer() {
  const t = useTranslations('nav')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary dark:bg-secondary-900 text-gray-300">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="w-9 h-9 bg-gradient-orange rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Bike className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Bici<span className="text-primary">Market</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              The premier bicycle marketplace for Costa del Sol. Buy, sell, rent, and repair bikes
              with verified local sellers and mechanics.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-primary transition-colors flex items-center justify-center"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-primary transition-colors flex items-center justify-center"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-primary transition-colors flex items-center justify-center"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-primary transition-colors flex items-center justify-center"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Marketplace links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2">
              {[
                { href: '/buy', label: t('buy') },
                { href: '/sell', label: t('sell') },
                { href: '/rent', label: t('rent') },
                { href: '/repair', label: t('repair') },
                { href: '/map', label: t('map') },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/blog', label: 'Blog' },
                { href: '/careers', label: 'Careers' },
                { href: '/press', label: 'Press' },
                { href: '/contact', label: 'Contact' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & App */}
          <div>
            <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>Costa del Sol, Málaga, Spain</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a
                  href="mailto:hello@bicimarket.es"
                  className="hover:text-primary transition-colors"
                >
                  hello@bicimarket.es
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+34600000000" className="hover:text-primary transition-colors">
                  +34 600 000 000
                </a>
              </li>
            </ul>

            {/* App store buttons */}
            <div className="flex flex-col gap-2">
              <a
                href="#"
                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <div className="text-xs text-gray-400 leading-none">Download on the</div>
                  <div className="text-sm font-semibold text-white leading-tight">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.32.18.68.2 1.01.07l12.37-7.13-2.73-2.73-10.65 9.79zM.61 1.33C.23 1.67 0 2.2 0 2.9v18.2c0 .7.23 1.23.61 1.57l.08.08 10.2-10.2v-.24L.69 1.25l-.08.08zM20.33 10.3l-2.92-1.69-3.06 3.06 3.06 3.06 2.93-1.69c.84-.48.84-1.26 0-1.74h-.01zM4.19.17L16.56 7.3l-2.73 2.73L3.18.24C3.51.11 3.87.13 4.19.17z" />
                </svg>
                <div>
                  <div className="text-xs text-gray-400 leading-none">Get it on</div>
                  <div className="text-sm font-semibold text-white leading-tight">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © {currentYear} BiciMarket. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              {[
                { href: '/terms', label: 'Terms of Service' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/cookies', label: 'Cookie Policy' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xs text-gray-500 hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Language selector */}
            <div className="flex items-center gap-1 flex-wrap justify-center">
              {LOCALES.map((locale) => (
                <Link
                  key={locale.code}
                  href={locale.code === 'en' ? '/' : `/${locale.code}`}
                  className="text-xs text-gray-500 hover:text-primary transition-colors px-1"
                  title={locale.label}
                >
                  {locale.flag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
