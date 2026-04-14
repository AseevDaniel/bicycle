'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  Megaphone,
  BarChart2,
  Users,
  TrendingUp,
  Target,
  Search,
  Plus,
  Instagram,
  Youtube,
  Globe,
  Star,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Heart,
} from 'lucide-react'
import { clsx } from 'clsx'

/* ─── Types ─── */
type ViewId = 'discover' | 'all-campaigns' | 'overview'

/* ─── Mock data ─── */
const MOCK_CREATORS = [
  {
    id: 'c1',
    name: 'Marc Viladomat',
    handle: '@marcvelo',
    avatar: 'https://i.pravatar.cc/80?img=12',
    platform: 'instagram' as const,
    followers: 48200,
    engagement: 5.2,
    niche: 'Road Cycling',
    location: 'Barcelona',
    rating: 4.9,
    verified: true,
  },
  {
    id: 'c2',
    name: 'Laura Pedals',
    handle: '@laurapedals',
    avatar: 'https://i.pravatar.cc/80?img=47',
    platform: 'youtube' as const,
    followers: 132000,
    engagement: 3.8,
    niche: 'MTB & Gravel',
    location: 'Madrid',
    rating: 4.7,
    verified: true,
  },
  {
    id: 'c3',
    name: 'Jordi Bici',
    handle: '@jordibici',
    avatar: 'https://i.pravatar.cc/80?img=33',
    platform: 'instagram' as const,
    followers: 21500,
    engagement: 7.1,
    niche: 'Urban Cycling',
    location: 'Valencia',
    rating: 4.6,
    verified: false,
  },
  {
    id: 'c4',
    name: 'Cycling with Ana',
    handle: '@cyclingana',
    avatar: 'https://i.pravatar.cc/80?img=23',
    platform: 'youtube' as const,
    followers: 87000,
    engagement: 4.4,
    niche: 'E-Bike & Cargo',
    location: 'Seville',
    rating: 4.8,
    verified: true,
  },
  {
    id: 'c5',
    name: 'Pedro MTB',
    handle: '@pedromtb',
    avatar: 'https://i.pravatar.cc/80?img=52',
    platform: 'instagram' as const,
    followers: 35800,
    engagement: 6.3,
    niche: 'MTB Enduro',
    location: 'Málaga',
    rating: 4.5,
    verified: true,
  },
  {
    id: 'c6',
    name: 'Elena Gravel',
    handle: '@elenagravel',
    avatar: 'https://i.pravatar.cc/80?img=38',
    platform: 'instagram' as const,
    followers: 19200,
    engagement: 8.2,
    niche: 'Gravel & Adventure',
    location: 'Bilbao',
    rating: 4.9,
    verified: true,
  },
]

type CampaignStatus = 'active' | 'draft' | 'ended'

const MOCK_CAMPAIGNS = [
  {
    id: 'camp1',
    name: 'Summer Gravel Season 2025',
    status: 'active' as CampaignStatus,
    creators: 3,
    reach: 214000,
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    budget: 2400,
  },
  {
    id: 'camp2',
    name: 'New Road Bike Launch',
    status: 'draft' as CampaignStatus,
    creators: 0,
    reach: 0,
    startDate: '2025-09-15',
    endDate: '2025-10-31',
    budget: 5000,
  },
  {
    id: 'camp3',
    name: 'Spring MTB Collection',
    status: 'ended' as CampaignStatus,
    creators: 5,
    reach: 487000,
    startDate: '2025-03-01',
    endDate: '2025-05-31',
    budget: 3800,
  },
]

const STATUS_CONFIG: Record<CampaignStatus, { label: string; icon: React.ReactNode; className: string }> = {
  active: {
    label: 'Active',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  },
  draft: {
    label: 'Draft',
    icon: <Clock className="w-3.5 h-3.5" />,
    className: 'bg-gray-100 text-gray-600 dark:bg-secondary-700 dark:text-gray-400',
  },
  ended: {
    label: 'Ended',
    icon: <XCircle className="w-3.5 h-3.5" />,
    className: 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
  },
}

/* ─── Sidebar nav config ─── */
const NAV_GROUPS = [
  {
    label: 'Explore',
    items: [
      { id: 'discover' as ViewId, label: 'Discover', icon: <Compass className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Campaigns',
    items: [
      { id: 'all-campaigns' as ViewId, label: 'All Campaigns', icon: <Megaphone className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { id: 'overview' as ViewId, label: 'Overview', icon: <BarChart2 className="w-4 h-4" /> },
    ],
  },
]

/* ─── Helper: format number ─── */
function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

/* ─── View: Discover ─── */
function DiscoverView() {
  const [search, setSearch] = useState('')
  const [nicheFilter, setNicheFilter] = useState('All')

  const niches = ['All', 'Road Cycling', 'MTB & Gravel', 'Urban Cycling', 'E-Bike & Cargo', 'MTB Enduro', 'Gravel & Adventure']

  const filtered = MOCK_CREATORS.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.handle.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
    const matchNiche = nicheFilter === 'All' || c.niche === nicheFilter
    return matchSearch && matchNiche
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Discover Creators</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Find cycling creators and influencers to collaborate with your brand.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, handle or city..."
            className="input pl-9 w-full"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {niches.map((n) => (
            <button
              key={n}
              onClick={() => setNicheFilter(n)}
              className={clsx(
                'px-3 py-1.5 text-xs font-medium rounded-full border transition-colors whitespace-nowrap',
                nicheFilter === n
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-200 dark:border-secondary-600 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary'
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Creator grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No creators found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((creator) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  {creator.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{creator.name}</p>
                    {creator.platform === 'instagram' ? (
                      <Instagram className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                    ) : (
                      <Youtube className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{creator.handle}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {creator.location}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100 dark:border-secondary-700 mb-3">
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{fmtNum(creator.followers)}</p>
                  <p className="text-xs text-gray-400">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{creator.engagement}%</p>
                  <p className="text-xs text-gray-400">Engagement</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-0.5">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{creator.rating}</p>
                  </div>
                  <p className="text-xs text-gray-400">Rating</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {creator.niche}
                </span>
                <button className="text-xs font-semibold text-primary hover:text-primary-600 flex items-center gap-1 transition-colors">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── View: All Campaigns ─── */
function AllCampaignsView() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Campaigns</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your brand collaborations and creator campaigns.
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2 !py-2 !px-4 text-sm">
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      <div className="space-y-3">
        {MOCK_CAMPAIGNS.map((campaign) => {
          const status = STATUS_CONFIG[campaign.status]
          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{campaign.name}</h3>
                    <span className={clsx('flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full', status.className)}>
                      {status.icon}
                      {status.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {new Date(campaign.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' → '}
                    {new Date(campaign.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex gap-6 text-center flex-shrink-0">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{campaign.creators}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 justify-center">
                      <Users className="w-3 h-3" /> Creators
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {campaign.reach > 0 ? fmtNum(campaign.reach) : '—'}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 justify-center">
                      <Eye className="w-3 h-3" /> Reach
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">€{campaign.budget.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 justify-center">
                      <Target className="w-3 h-3" /> Budget
                    </p>
                  </div>
                </div>

                <button className="text-sm font-medium text-primary hover:text-primary-600 transition-colors flex-shrink-0">
                  View →
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── View: Analytics Overview ─── */
function OverviewView() {
  const metrics = [
    { label: 'Total Reach', value: '701K', change: '+18%', icon: <Eye className="w-5 h-5" />, positive: true },
    { label: 'Active Campaigns', value: '1', change: '2 ended', icon: <Megaphone className="w-5 h-5" />, positive: true },
    { label: 'Avg Engagement', value: '5.8%', change: '+0.4%', icon: <Heart className="w-5 h-5" />, positive: true },
    { label: 'Creators Worked', value: '8', change: 'All time', icon: <Users className="w-5 h-5" />, positive: true },
  ]

  const recentActivity = [
    { text: 'Marc Viladomat posted a story for Summer Gravel Season', time: '2h ago', icon: <Instagram className="w-4 h-4 text-pink-500" /> },
    { text: 'Laura Pedals uploaded a new review video', time: '1d ago', icon: <Youtube className="w-4 h-4 text-red-500" /> },
    { text: 'Spring MTB Collection campaign ended', time: '3d ago', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
    { text: 'Elena Gravel accepted collaboration invite', time: '5d ago', icon: <Users className="w-4 h-4 text-primary" /> },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Overview</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Track the performance of your brand campaigns and creator partnerships.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {m.icon}
              </div>
              <span className={clsx(
                'text-xs font-semibold px-2 py-0.5 rounded-full',
                m.positive
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                  : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
              )}>
                {m.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{m.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{m.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Reach by month placeholder */}
      <div className="card p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Reach by Month</h2>
        <div className="flex items-end gap-2 h-32">
          {[40, 55, 35, 70, 90, 65, 100].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md bg-primary/80 hover:bg-primary transition-colors"
                style={{ height: `${h}%` }}
              />
              <span className="text-xs text-gray-400">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-secondary-700 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300">{item.text}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Main brand page ─── */
export default function BrandPage() {
  const [activeView, setActiveView] = useState<ViewId>('discover')

  const PAGE_TITLES: Record<ViewId, string> = {
    discover: 'Discover',
    'all-campaigns': 'All Campaigns',
    overview: 'Overview',
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-gray-100 dark:border-secondary-700 bg-white dark:bg-secondary-800 hidden md:flex flex-col py-6 px-3">
        <div className="px-2 mb-6">
          <p className="text-xs font-bold text-primary uppercase tracking-widest">Brand Portal</p>
        </div>

        <nav className="flex-1 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={clsx(
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      activeView === item.id
                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-secondary-700 hover:text-gray-900 dark:hover:text-white'
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile tab bar */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-white dark:bg-secondary-800 border-t border-gray-100 dark:border-secondary-700 flex">
        {NAV_GROUPS.flatMap((g) => g.items).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={clsx(
              'flex-1 flex flex-col items-center py-2 text-xs font-medium gap-1 transition-colors',
              activeView === item.id ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
            )}
          >
            {item.icon}
            <span className="text-[10px]">{PAGE_TITLES[item.id]}</span>
          </button>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === 'discover' && <DiscoverView />}
              {activeView === 'all-campaigns' && <AllCampaignsView />}
              {activeView === 'overview' && <OverviewView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
