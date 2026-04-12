'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Search, ArrowLeft, Tag } from 'lucide-react'
import { clsx } from 'clsx'
import { useAuth } from '@/lib/auth'
import Link from 'next/link'
import { useParams } from 'next/navigation'

/* ─── Types ─── */
interface Message {
  id: string
  from: 'me' | 'them'
  text: string
  time: string
}

interface Conversation {
  id: string
  withUser: { name: string; avatar: string }
  listing: { title: string; photo: string }
  messages: Message[]
  unread: number
}

/* ─── Mock data ─── */
const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    withUser: { name: 'James Wilson', avatar: 'https://i.pravatar.cc/40?img=3' },
    listing: { title: 'Trek Domane SL 6', photo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=60&q=80' },
    messages: [
      { id: 'm1', from: 'them', text: 'Hi! Is the Trek still available?', time: '10:30' },
      { id: 'm2', from: 'me', text: 'Yes, still available! Are you interested?', time: '10:45' },
      { id: 'm3', from: 'them', text: 'Very interested. Can you do €2500?', time: '11:00' },
      { id: 'm4', from: 'me', text: 'I can do €2650, it was just serviced.', time: '11:15' },
    ],
    unread: 1,
  },
  {
    id: 'c2',
    withUser: { name: 'Sofia Martinez', avatar: 'https://i.pravatar.cc/40?img=9' },
    listing: { title: 'Specialized Allez Sprint', photo: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=60&q=80' },
    messages: [
      { id: 'm1', from: 'them', text: 'What frame size is it exactly?', time: 'Yesterday' },
      { id: 'm2', from: 'me', text: "It's a 54cm, which fits roughly 175-180cm height.", time: 'Yesterday' },
      { id: 'm3', from: 'them', text: "Perfect, that's my size! Can I come see it this weekend?", time: '09:00' },
    ],
    unread: 0,
  },
  {
    id: 'c3',
    withUser: { name: 'Thomas Berger', avatar: 'https://i.pravatar.cc/40?img=7' },
    listing: { title: 'Giant TCR Advanced', photo: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=60&q=80' },
    messages: [
      { id: 'm1', from: 'me', text: 'Hi Thomas, the bike is sold now. Sorry!', time: 'Mon' },
      { id: 'm2', from: 'them', text: 'No problem, thanks for letting me know. Keep me posted if you get another one.', time: 'Mon' },
    ],
    unread: 0,
  },
  {
    id: 'c4',
    withUser: { name: 'Lucia Fernandez', avatar: 'https://i.pravatar.cc/40?img=5' },
    listing: { title: 'Cannondale SuperSix EVO', photo: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=60&q=80' },
    messages: [
      { id: 'm1', from: 'them', text: 'Does the bike come with the original pedals?', time: 'Sun' },
      { id: 'm2', from: 'them', text: 'Also interested in the saddle bag if included', time: 'Sun' },
    ],
    unread: 2,
  },
]

/* ─── Offer modal ─── */
function OfferModal({ listing, onClose, onSend }: {
  listing: { title: string }
  onClose: () => void
  onSend: (amount: string) => void
}) {
  const [amount, setAmount] = useState('')
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-secondary-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Make an Offer</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">for {listing.title}</p>
        <div className="relative mb-4">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">€</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input pl-8"
            placeholder="Your offer"
            autoFocus
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-outline !py-2 text-sm">Cancel</button>
          <button
            onClick={() => { if (amount) onSend(amount); onClose() }}
            disabled={!amount}
            className="flex-1 btn-primary !py-2 text-sm"
          >
            Send Offer
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Main messages page ─── */
export default function MessagesPage() {
  const { user } = useAuth()
  const params = useParams()
  const locale = params?.locale as string | undefined
  const localePath = locale && locale !== 'en' ? `/${locale}` : ''

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS)
  const [activeId, setActiveId] = useState<string | null>('c1')
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showOffer, setShowOffer] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConv = conversations.find((c) => c.id === activeId)

  const filteredConvs = conversations.filter((c) =>
    c.withUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConv?.messages])

  const selectConv = (id: string) => {
    setActiveId(id)
    setMobileSidebarOpen(false)
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    )
  }

  const sendMessage = (text: string) => {
    if (!text.trim() || !activeId) return
    const newMsg: Message = {
      id: `m${Date.now()}`,
      from: 'me',
      text: text.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId ? { ...c, messages: [...c.messages, newMsg] } : c
      )
    )
    setNewMessage('')

    // Simulate a reply after 2s
    setTimeout(() => {
      const replies = [
        'Sounds good, let me think about it.',
        'Great, can we meet in Marbella?',
        'That works for me!',
        'Thanks for the info.',
      ]
      const reply: Message = {
        id: `m${Date.now()}_r`,
        from: 'them',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, messages: [...c.messages, reply] } : c
        )
      )
    }, 2000)
  }

  const handleOffer = (amount: string) => {
    sendMessage(`I'd like to offer €${amount} for the ${activeConv?.listing.title}.`)
  }

  const lastMessage = (conv: Conversation) => {
    const last = conv.messages[conv.messages.length - 1]
    return last ? `${last.from === 'me' ? 'You: ' : ''}${last.text}` : ''
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Sign in to view your messages.</p>
          <Link href={`${localePath}/login`} className="btn-primary inline-flex">Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 h-[calc(100vh-80px)]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex gap-4"
      >
        {/* ─── Sidebar ─── */}
        <div className={clsx(
          'flex flex-col w-full md:w-80 lg:w-96 flex-shrink-0',
          'md:flex',
          mobileSidebarOpen ? 'flex' : 'hidden md:flex'
        )}>
          <div className="card flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-secondary-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Messages</h2>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="input pl-9 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConvs.length === 0 ? (
                <div className="text-center py-8 text-gray-400 dark:text-gray-600 text-sm">
                  No conversations found
                </div>
              ) : (
                filteredConvs.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => selectConv(conv.id)}
                    className={clsx(
                      'w-full flex gap-3 p-4 text-left border-b border-gray-50 dark:border-secondary-700/50 transition-colors',
                      activeId === conv.id
                        ? 'bg-primary/5 dark:bg-primary/10 border-l-2 border-l-primary'
                        : 'hover:bg-gray-50 dark:hover:bg-secondary-700/50'
                    )}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={conv.withUser.avatar}
                        alt={conv.withUser.name}
                        className="w-11 h-11 rounded-full object-cover"
                      />
                      {conv.unread > 0 && (
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-[10px] text-white font-bold">{conv.unread}</span>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={clsx('text-sm font-semibold truncate', conv.unread > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300')}>
                          {conv.withUser.name}
                        </span>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0">
                          {conv.messages[conv.messages.length - 1]?.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {conv.listing.title}
                      </p>
                      <p className={clsx(
                        'text-xs truncate mt-0.5',
                        conv.unread > 0 ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-400 dark:text-gray-500'
                      )}>
                        {lastMessage(conv)}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ─── Chat panel ─── */}
        <div className={clsx(
          'flex-1 flex flex-col min-w-0',
          'md:flex',
          !mobileSidebarOpen ? 'flex' : 'hidden md:flex'
        )}>
          {activeConv ? (
            <div className="card flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-secondary-700">
                {/* Back button (mobile) */}
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-secondary-700"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img src={activeConv.withUser.avatar} alt={activeConv.withUser.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">{activeConv.withUser.name}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 truncate">Re: {activeConv.listing.title}</div>
                </div>
                {/* Listing thumbnail */}
                <div className="hidden sm:flex items-center gap-2 bg-gray-50 dark:bg-secondary-700/50 rounded-xl px-3 py-1.5">
                  <img src={activeConv.listing.photo} alt={activeConv.listing.title} className="w-8 h-8 rounded-lg object-cover" />
                  <span className="text-xs text-gray-600 dark:text-gray-300 font-medium max-w-[120px] truncate">{activeConv.listing.title}</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeConv.messages.map((msg, index) => {
                  const isMe = msg.from === 'me'
                  const prevMsg = index > 0 ? activeConv.messages[index - 1] : null
                  const showAvatar = !isMe && (!prevMsg || prevMsg.from !== 'them')

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={clsx('flex items-end gap-2', isMe ? 'justify-end' : 'justify-start')}
                    >
                      {!isMe && (
                        <div className="w-7 h-7 flex-shrink-0">
                          {showAvatar && (
                            <img
                              src={activeConv.withUser.avatar}
                              alt={activeConv.withUser.name}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                          )}
                        </div>
                      )}
                      <div className={clsx('max-w-[70%]', isMe ? 'items-end' : 'items-start', 'flex flex-col gap-0.5')}>
                        <div
                          className={clsx(
                            'px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm',
                            isMe
                              ? 'bg-primary text-white rounded-br-sm'
                              : 'bg-gray-100 dark:bg-secondary-700 text-gray-800 dark:text-gray-200 rounded-bl-sm'
                          )}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 px-1">{msg.time}</span>
                      </div>
                    </motion.div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="p-4 border-t border-gray-100 dark:border-secondary-700">
                {/* Make offer button */}
                <div className="mb-2 flex justify-end">
                  <button
                    onClick={() => setShowOffer(true)}
                    className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-600 px-3 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    Make Offer
                  </button>
                </div>
                <form
                  onSubmit={(e) => { e.preventDefault(); sendMessage(newMessage) }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="input flex-1 py-2.5 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className={clsx(
                      'w-11 h-11 rounded-xl flex items-center justify-center transition-all',
                      newMessage.trim()
                        ? 'bg-primary text-white hover:bg-primary-600 active:scale-95'
                        : 'bg-gray-100 dark:bg-secondary-700 text-gray-400 cursor-not-allowed'
                    )}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="card flex-1 flex items-center justify-center text-center p-8">
              <div>
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">No conversation selected</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">Choose a conversation from the left to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Offer modal */}
      <AnimatePresence>
        {showOffer && activeConv && (
          <OfferModal
            listing={activeConv.listing}
            onClose={() => setShowOffer(false)}
            onSend={handleOffer}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
