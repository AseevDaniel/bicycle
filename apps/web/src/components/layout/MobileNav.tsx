'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Map, Wrench, User } from 'lucide-react'

const tabs = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/listings', icon: Search, label: 'Buy' },
  { href: '/map', icon: Map, label: 'Map' },
  { href: '/repairs', icon: Wrench, label: 'Repair' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-secondary-900 border-t border-gray-100 dark:border-secondary-700 pb-safe">
      <div className="flex items-center justify-around h-16">
        {tabs.map(tab => {
          const active = pathname.endsWith(tab.href) || (tab.href !== '/' && pathname.includes(tab.href))
          return (
            <Link key={tab.href} href={tab.href} className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${active ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}>
              <tab.icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
