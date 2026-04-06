import type { FastifyInstance } from 'fastify'
import { MOCK_RENTALS } from '../data/mockData.js'

export default async function rentalsRoutes(app: FastifyInstance) {
  app.get('/rentals', async (request) => {
    const q = request.query as Record<string, string>
    let results = [...MOCK_RENTALS]
    if (q.type) results = results.filter(r => r.bikeType === q.type)
    if (q.city) results = results.filter(r => r.location.city.toLowerCase().includes(q.city.toLowerCase()))
    if (q.maxPrice) results = results.filter(r => r.pricePerDay <= Number(q.maxPrice))
    return { success: true, data: results, meta: { total: results.length } }
  })

  app.get<{ Params: { id: string } }>('/rentals/:id', async (request, reply) => {
    const rental = MOCK_RENTALS.find(r => r.id === request.params.id)
    if (!rental) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Rental not found' } })
    return { success: true, data: rental }
  })

  app.post<{ Params: { id: string } }>('/rentals/:id/book', async (request) => {
    const body = request.body as any
    const ref = `BM-${Date.now().toString(36).toUpperCase()}`
    return {
      success: true,
      data: {
        bookingRef: ref,
        rentalId: request.params.id,
        startDate: body?.startDate,
        endDate: body?.endDate,
        totalPrice: body?.totalPrice,
        status: 'confirmed',
        message: `Booking confirmed! Your reference is ${ref}.`,
      }
    }
  })

  app.get<{ Params: { id: string } }>('/rentals/:id/availability', async (request) => {
    // Return blocked dates for demo
    const blocked = ['2025-01-10', '2025-01-11', '2025-01-12', '2025-01-20', '2025-01-21', '2025-02-14', '2025-02-15']
    return { success: true, data: { rentalId: request.params.id, blockedDates: blocked } }
  })
}
