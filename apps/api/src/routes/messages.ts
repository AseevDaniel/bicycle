import type { FastifyInstance } from 'fastify'
import { MOCK_CONVERSATIONS } from '../data/mockData.js'

export default async function messagesRoutes(app: FastifyInstance) {
  app.get('/messages/conversations', async () => {
    const list = MOCK_CONVERSATIONS.map(c => ({
      id: c.id, listingId: c.listingId, listingTitle: c.listingTitle, listingPhoto: c.listingPhoto,
      participants: c.participants, unreadCount: c.unreadCount, updatedAt: c.updatedAt,
      lastMessage: c.messages[c.messages.length - 1],
    }))
    return { success: true, data: list }
  })

  app.get<{ Params: { id: string } }>('/messages/conversations/:id', async (request, reply) => {
    const conv = MOCK_CONVERSATIONS.find(c => c.id === request.params.id)
    if (!conv) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Conversation not found' } })
    return { success: true, data: conv }
  })

  app.post<{ Params: { id: string } }>('/messages/conversations/:id/messages', async (request) => {
    const body = request.body as any
    const conv = MOCK_CONVERSATIONS.find(c => c.id === request.params.id)
    const msg = { id: `msg_${Date.now()}`, senderId: 'me', senderName: 'Alex Johnson', senderAvatar: 'https://i.pravatar.cc/40?img=5', content: body?.content || '', type: 'text' as const, createdAt: new Date().toISOString(), isRead: false }
    if (conv) conv.messages.push(msg)
    return { success: true, data: msg }
  })
}
