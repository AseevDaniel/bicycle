import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { AuthProvider } from '@/lib/auth'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { Toaster } from 'react-hot-toast'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import '@/app/globals.css'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: { default: 'BiciMarket', template: '%s | BiciMarket' },
    description:
      'The bicycle marketplace for Costa del Sol - Buy, sell, rent, and repair bikes',
    keywords: [
      'bicycle',
      'bike',
      'marketplace',
      'Costa del Sol',
      'cycling',
      'rental',
      'repair',
    ],
    openGraph: {
      siteName: 'BiciMarket',
      locale,
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'en' | 'es' | 'de' | 'fr' | 'ru' | 'uk')) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        {/*
          This div IS in the server-rendered HTML — visible from the very first paint.
          JS dynamically created overlays only appear AFTER first paint (too late).
          Script below auto-removes it on non-hero pages; HeroSection controls it on hero page.
        */}
        <div
          id="init-overlay"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 99999,
            background: '#0A0A0A',
            transition: 'opacity 0.5s',
          } as React.CSSProperties}
        />
        <script dangerouslySetInnerHTML={{ __html:
          `window.__ot=setTimeout(function(){` +
          `var o=document.getElementById('init-overlay');` +
          `if(o){o.style.opacity='0';setTimeout(function(){o.style.display='none';},500);}` +
          `},400);`
        }} />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <AuthProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 pb-16 md:pb-0">{children}</main>
                <Footer />
                <MobileNav />
              </div>
              <ScrollToTop />
              <Toaster position="bottom-right" />
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
