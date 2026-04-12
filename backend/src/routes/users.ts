import type { FastifyInstance } from 'fastify'
import { MOCK_USERS, MOCK_LISTINGS, MOCK_REVIEWS } from '../data/mockData.js'

export default async function usersRoutes(app: FastifyInstance) {
  app.get<{ Params: { id: string } }>('/users/:id', async (request, reply) => {
    const user = MOCK_USERS.find(u => u.id === request.params.id)
    if (!user) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } })
    return { success: true, data: user }
  })

  app.get<{ Params: { id: string } }>('/users/:id/listings', async (request) => {
    const listings = MOCK_LISTINGS.filter(l => l.sellerId === request.params.id)
    return { success: true, data: listings }
  })

  app.get<{ Params: { id: string } }>('/users/:id/reviews', async (request) => {
    const reviews = MOCK_REVIEWS.filter(r => r.targetId === request.params.id)
    return { success: true, data: reviews }
  })
}
