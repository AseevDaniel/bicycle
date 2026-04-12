import type { FastifyInstance } from 'fastify'
import { MOCK_MECHANICS } from '../data/mockData.js'

export default async function repairsRoutes(app: FastifyInstance) {
  app.get('/repairs/mechanics', async (request) => {
    const q = request.query as Record<string, string>
    let results = [...MOCK_MECHANICS]
    if (q.city) results = results.filter(m => m.location.city.toLowerCase().includes(q.city.toLowerCase()))
    if (q.mobile === 'true') results = results.filter(m => m.isMobile)
    if (q.specialty) results = results.filter(m => m.specialties.some(s => s.toLowerCase().includes(q.specialty.toLowerCase())))
    return { success: true, data: results, meta: { total: results.length } }
  })

  app.get<{ Params: { id: string } }>('/repairs/mechanics/:id', async (request, reply) => {
    const mechanic = MOCK_MECHANICS.find(m => m.id === request.params.id)
    if (!mechanic) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Mechanic not found' } })
    return { success: true, data: mechanic }
  })

  app.post('/repairs/book', async (request) => {
    const body = request.body as any
    const ref = `RP-${Date.now().toString(36).toUpperCase()}`
    return {
      success: true,
      data: {
        bookingRef: ref,
        mechanicId: body?.mechanicId,
        serviceId: body?.serviceId,
        date: body?.date,
        status: 'pending',
        message: `Repair booking request sent! Reference: ${ref}. The mechanic will confirm within their stated response time.`,
      }
    }
  })

  app.get('/repairs/services', async () => {
    const catalog = [
      { category: 'maintenance', services: [{ name: 'Basic Tune-Up', description: 'Derailleur adjustment, brake check, lube', priceRange: '€25–45', duration: '1 hour' }, { name: 'Full Overhaul', description: 'Complete strip, clean, rebuild', priceRange: '€80–150', duration: '4–6 hours' }] },
      { category: 'repair', services: [{ name: 'Puncture Repair', description: 'Inner tube or tubeless sealant', priceRange: '€10–20', duration: '20 min' }, { name: 'Brake Bleed', description: 'Hydraulic disc brake bleeding', priceRange: '€20–35', duration: '30 min' }] },
      { category: 'upgrade', services: [{ name: 'Tubeless Conversion', description: 'Convert to tubeless with sealant', priceRange: '€30–50', duration: '1 hour' }, { name: 'Bike Fit', description: 'Professional saddle, cleat, bar position', priceRange: '€60–120', duration: '1.5–2 hours' }] },
    ]
    return { success: true, data: catalog }
  })
}
