# BiciMarket - Bicycle Marketplace Platform

> AI-powered bicycle marketplace with rental, repair services, and smart search.
> Starting in Costa del Sol, Spain.

## Vision

BiciMarket is a comprehensive bicycle ecosystem platform that combines:
- **Marketplace** for buying and selling new & used bicycles
- **AI-powered listing** - snap a photo, AI fills in all bike specs automatically
- **Smart search** - describe what you need in natural language, AI finds the best match
- **Rental service** - short and long-term bicycle rentals
- **Repair services** - find and book bicycle mechanics
- **Map-based discovery** - search listings, rentals, and repair shops on an interactive map
- **Trust system** - user profiles with ratings, transaction history, and verification

## Why BiciMarket?

The used bicycle market in Spain is served by generalist platforms (Wallapop, Milanuncios) that lack:
- Bicycle-specific expertise and structured specifications
- AI-assisted listing creation (most sellers don't know their bike's specs)
- Integrated rental and repair services
- Trust mechanisms designed for high-value sporting goods
- Cycling-specific search (by riding style, terrain, body fit)

## Target Market

**Primary**: Costa del Sol, Andalusia, Spain
- 12-13M tourists/year, many from cycling-strong countries (UK, Germany, Netherlands, Scandinavia)
- Large expat community with high bike turnover
- Year-round cycling weather (inverse season to northern Europe)
- Strong road cycling tourism (Jan-Mar peak for training camps)

**Expansion**: All of Spain, then EU markets

## Tech Stack Overview

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| 3D & Animation | Three.js / React Three Fiber, Framer Motion, GSAP |
| Styling | Tailwind CSS 4 |
| Backend | Node.js, Express or Fastify |
| Database | PostgreSQL + PostGIS (geospatial) |
| Cache | Redis |
| Search | Elasticsearch / Meilisearch |
| AI | Claude API (vision + text), embeddings for semantic search |
| File Storage | AWS S3 / Cloudflare R2 |
| Maps | Mapbox GL JS |
| Auth | NextAuth.js / Auth.js |
| i18n | next-intl (6 languages: EN, ES, RU, UK, DE, FR) |
| Payments | Stripe |
| Real-time | Socket.io / WebSockets |
| Deployment | Vercel (frontend) + Railway/Fly.io (backend) |
| CI/CD | GitHub Actions |

## Documentation

| Document | Description |
|----------|-------------|
| [Business Requirements](docs/BUSINESS.md) | Market analysis, monetization, go-to-market strategy |
| [Technical Architecture](docs/TECHNICAL.md) | System architecture, infrastructure, tech decisions |
| [Features Specification](docs/FEATURES.md) | Detailed feature specs and user flows |
| [AI Features](docs/AI_FEATURES.md) | AI photo recognition, smart search, recommendations |
| [UI/UX & Design](docs/UI_UX.md) | Design system, 3D visuals, animations |
| [Database Schema](docs/DATABASE.md) | Data models, relationships, migrations |
| [API Specification](docs/API.md) | REST & WebSocket API endpoints |
| [Localization](docs/LOCALIZATION.md) | i18n strategy, translation workflow |
| [Deployment & DevOps](docs/DEPLOYMENT.md) | Infrastructure, CI/CD, monitoring |

## Quick Start

```bash
# Clone
git clone https://github.com/aseevdaniel/bicycle.git
cd bicycle

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
npm run db:migrate

# Seed database with bike categories & specifications
npm run db:seed

# Start development
npm run dev
```

## Project Structure

```
bicycle/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── app/             # App Router pages
│   │   │   ├── [locale]/    # i18n routing
│   │   │   ├── api/         # API routes (BFF)
│   │   ├── components/      # React components
│   │   │   ├── ui/          # Base UI kit
│   │   │   ├── 3d/          # Three.js 3D scenes
│   │   │   ├── maps/        # Map components
│   │   │   ├── listings/    # Listing components
│   │   │   ├── profile/     # Profile components
│   │   │   └── shared/      # Shared components
│   │   ├── lib/             # Utilities, hooks, helpers
│   │   ├── messages/        # i18n translation files
│   │   └── public/          # Static assets, 3D models
│   └── api/                 # Backend API server
│       ├── src/
│       │   ├── routes/      # API routes
│       │   ├── services/    # Business logic
│       │   ├── models/      # Database models
│       │   ├── middleware/   # Auth, validation, etc.
│       │   ├── ai/          # AI service integrations
│       │   └── utils/       # Helpers
│       └── prisma/          # Prisma schema & migrations
├── packages/
│   ├── shared/              # Shared types, constants, utils
│   ├── bike-specs/          # Bicycle specification database
│   └── ai-helpers/          # AI prompt templates & utilities
├── docs/                    # Project documentation
├── turbo.json               # Turborepo config
└── package.json             # Root package.json
```

## License

Private / Proprietary
