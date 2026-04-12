import type { FastifyInstance } from 'fastify'
import { MOCK_LISTINGS, MOCK_RENTALS, MOCK_MECHANICS, MOCK_USERS } from '../data/mockData.js'

export default async function statsRoutes(app: FastifyInstance) {
  app.get('/stats', async () => {
    const cities = new Set(MOCK_LISTINGS.map(l => l.location.city))
    return {
      success: true,
      data: {
        totalListings: MOCK_LISTINGS.length,
        totalUsers: MOCK_USERS.length,
        totalCities: cities.size,
        totalMechanics: MOCK_MECHANICS.length,
        totalRentals: MOCK_RENTALS.length,
        avgResponseTime: '2h',
        totalTransactions: 847,
        happyCustomers: 1243,
      }
    }
  })
}
