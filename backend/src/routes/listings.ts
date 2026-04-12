import type { FastifyInstance } from 'fastify'
import { MOCK_LISTINGS } from '../data/mockData.js'

export default async function listingsRoutes(app: FastifyInstance) {
  app.get('/listings', async (request) => {
    const q = request.query as Record<string, string>
    let results = [...MOCK_LISTINGS]
    if (q.type) results = results.filter(l => l.bikeType === q.type)
    if (q.minPrice) results = results.filter(l => l.price >= Number(q.minPrice))
    if (q.maxPrice) results = results.filter(l => l.price <= Number(q.maxPrice))
    if (q.condition) results = results.filter(l => l.condition === q.condition)
    if (q.brand) results = results.filter(l => l.brand.toLowerCase() === q.brand.toLowerCase())
    if (q.city) results = results.filter(l => l.location.city.toLowerCase().includes(q.city.toLowerCase()))
    if (q.search) {
      const s = q.search.toLowerCase()
      results = results.filter(l => l.title.toLowerCase().includes(s) || l.brand.toLowerCase().includes(s) || l.model.toLowerCase().includes(s))
    }
    if (q.sort === 'priceAsc') results.sort((a, b) => a.price - b.price)
    else if (q.sort === 'priceDesc') results.sort((a, b) => b.price - a.price)
    else results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const page = Number(q.page || 1), limit = Number(q.limit || 12)
    const total = results.length
    const items = results.slice((page - 1) * limit, page * limit)
    return { success: true, data: items, meta: { page, limit, total, pages: Math.ceil(total / limit) } }
  })

  app.get('/listings/featured', async () => {
    return { success: true, data: MOCK_LISTINGS.filter(l => l.isFeatured).slice(0, 6) }
  })

  app.get('/listings/recent', async () => {
    const recent = [...MOCK_LISTINGS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8)
    return { success: true, data: recent }
  })

  app.get<{ Params: { id: string } }>('/listings/:id', async (request, reply) => {
    const listing = MOCK_LISTINGS.find(l => l.id === request.params.id)
    if (!listing) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Listing not found' } })
    listing.views++
    return { success: true, data: listing }
  })

  app.post<{ Params: { id: string } }>('/listings/:id/favorite', async (request) => {
    const listing = MOCK_LISTINGS.find(l => l.id === request.params.id)
    if (listing) listing.favoritesCount++
    return { success: true, data: { favorited: true } }
  })
}
