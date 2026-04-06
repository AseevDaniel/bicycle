'use client'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { ReactNode } from 'react'

export interface Tab {
  id: string
  label: string
  icon: ReactNode
  badge?: number
}

interface ProfileTabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
}

export function ProfileTabs({ tabs, activeTab, onChange }: ProfileTabsProps) {
  return (
    <div className="border-b border-gray-200 dark:border-secondary-700">
      <nav className="flex gap-0 overflow-x-auto scrollbar-none -mb-px">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={clsx(
                'relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-150 border-b-2 focus:outline-none',
                isActive
                  ? 'text-primary border-primary'
                  : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-secondary-500'
              )}
            >
              <span className={clsx('transition-colors', isActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500')}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={clsx(
                    'ml-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center',
                    isActive
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 dark:bg-secondary-600 text-gray-600 dark:text-gray-300'
                  )}
                >
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="profile-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
