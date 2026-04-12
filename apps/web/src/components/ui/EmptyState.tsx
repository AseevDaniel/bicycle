import { Search, Bike, Calendar, MessageCircle } from 'lucide-react'

interface EmptyStateProps {
  icon?: 'search' | 'bike' | 'calendar' | 'message'
  title: string
  description: string
  action?: { label: string; href: string }
}

export function EmptyState({ icon = 'search', title, description, action }: EmptyStateProps) {
  const icons = { search: Search, bike: Search, calendar: Calendar, message: MessageCircle }
  const Icon = icons[icon]
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-secondary-800 flex items-center justify-center mb-4">
        <Icon className="text-gray-400" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
      <p className="text-gray-400 dark:text-gray-500 max-w-sm mb-6">{description}</p>
      {action && (
        <a href={action.href} className="btn-primary">{action.label}</a>
      )}
    </div>
  )
}
