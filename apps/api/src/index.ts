import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import listingsRoutes from './routes/listings.js'
import rentalsRoutes from './routes/rentals.js'
import repairsRoutes from './routes/repairs.js'
import authRoutes from './routes/auth.js'
import messagesRoutes from './routes/messages.js'
import usersRoutes from './routes/users.js'
import statsRoutes from './routes/stats.js'

const app = Fastify({ logger: { level: process.env.LOG_LEVEL || 'info' } })

await app.register(cors, {
  origin: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
  credentials: true,
})
await app.register(helmet, { contentSecurityPolicy: false })

// Health check
app.get('/health', async () => ({ status: 'ok', version: '0.1.0', timestamp: new Date().toISOString() }))

// API v1 routes
const V1 = '/v1'
await app.register(listingsRoutes, { prefix: V1 })
await app.register(rentalsRoutes, { prefix: V1 })
await app.register(repairsRoutes, { prefix: V1 })
await app.register(authRoutes, { prefix: V1 })
await app.register(messagesRoutes, { prefix: V1 })
await app.register(usersRoutes, { prefix: V1 })
await app.register(statsRoutes, { prefix: V1 })

const port = Number(process.env.PORT) || 4000
const host = process.env.HOST || '0.0.0.0'

try {
  await app.listen({ port, host })
  console.log(`\n🚴 BiciMarket API running on http://localhost:${port}`)
  console.log(`📚 Routes: /health | /v1/listings | /v1/rentals | /v1/repairs | /v1/auth | /v1/messages | /v1/stats\n`)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
