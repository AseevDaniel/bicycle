import type { FastifyInstance } from 'fastify'
import { MOCK_USERS } from '../data/mockData.js'

const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo.demo'

export default async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', async (request) => {
    const body = request.body as any
    const user = { ...MOCK_USERS[0], id: `u_${Date.now()}`, name: body?.name || 'New User', email: body?.email || 'user@example.com' }
    return { success: true, data: { user, token: MOCK_TOKEN, refreshToken: MOCK_TOKEN } }
  })

  app.post('/auth/login', async (request) => {
    const body = request.body as any
    const user = MOCK_USERS.find(u => u.email === body?.email) || MOCK_USERS[0]
    return { success: true, data: { user, token: MOCK_TOKEN, refreshToken: MOCK_TOKEN } }
  })

  app.post('/auth/logout', async () => {
    return { success: true, data: { message: 'Logged out successfully' } }
  })

  app.get('/auth/me', async () => {
    return { success: true, data: MOCK_USERS[0] }
  })
}
