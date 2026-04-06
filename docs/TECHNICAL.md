# Technical Architecture

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CDN (Cloudflare)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────┐      ┌──────────────────────────────┐    │
│  │   Next.js Frontend   │      │      API Server (Node.js)    │    │
│  │   (Vercel / SSR)     │◄────►│      Express / Fastify       │    │
│  │                      │      │                              │    │
│  │  - App Router        │      │  - REST API                  │    │
│  │  - React 19          │      │  - WebSocket server          │    │
│  │  - Three.js / R3F    │      │  - Background jobs           │    │
│  │  - Mapbox GL         │      │  - AI service integration    │    │
│  │  - next-intl (i18n)  │      │                              │    │
│  └──────────────────────┘      └──────────┬───────────────────┘    │
│                                            │                        │
│  ┌─────────────────────────────────────────┼───────────────────┐   │
│  │                    Data Layer            │                   │   │
│  │                                         │                   │   │
│  │  ┌──────────┐  ┌───────┐  ┌────────────┴──┐  ┌─────────┐  │   │
│  │  │PostgreSQL│  │ Redis │  │ Elasticsearch │  │   S3    │  │   │
│  │  │+ PostGIS │  │       │  │ / Meilisearch │  │ / R2    │  │   │
│  │  └──────────┘  └───────┘  └───────────────┘  └─────────┘  │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   External Services                          │   │
│  │                                                              │   │
│  │  Claude API  │  Stripe  │  Mapbox  │  SendGrid  │  Sentry   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## 2. Tech Stack Details

### 2.1 Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 15.x | Framework - SSR/SSG for SEO, App Router, API routes as BFF |
| **React** | 19.x | UI library with Server Components and Suspense |
| **TypeScript** | 5.x | Type safety across entire codebase |
| **Tailwind CSS** | 4.x | Utility-first styling, design tokens |
| **Three.js** | latest | 3D bicycle visualizations and landing page |
| **React Three Fiber** | latest | Declarative Three.js for React |
| **@react-three/drei** | latest | Helpers for R3F (OrbitControls, Environment, etc.) |
| **@react-three/postprocessing** | latest | Visual effects (bloom, depth of field) |
| **Framer Motion** | latest | Page transitions, scroll animations, micro-interactions |
| **GSAP** | latest | Complex timeline animations, ScrollTrigger for scroll-based 3D |
| **Mapbox GL JS** | latest | Interactive maps with clustering, custom markers |
| **react-map-gl** | latest | React wrapper for Mapbox GL |
| **next-intl** | latest | i18n - SSR-compatible, ICU message format |
| **Zustand** | latest | Client state management (lightweight) |
| **TanStack Query** | latest | Server state, caching, optimistic updates |
| **React Hook Form** | latest | Form management for listing creation |
| **Zod** | latest | Schema validation (shared frontend/backend) |
| **Uploadthing / S3 presigned** | latest | Image uploads with preview and compression |
| **Swiper** | latest | Image carousels for listings |

### 2.2 Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 22.x LTS | Runtime |
| **Fastify** | latest | HTTP framework (faster than Express, schema validation built-in) |
| **TypeScript** | 5.x | Same as frontend |
| **Prisma** | latest | ORM with PostgreSQL, type-safe queries, migrations |
| **PostgreSQL** | 16.x | Primary database |
| **PostGIS** | 3.x | Geospatial queries (nearby listings, map search, coverage areas) |
| **Redis** | 7.x | Caching, session store, rate limiting, real-time pub/sub |
| **BullMQ** | latest | Job queue (image processing, AI analysis, emails, notifications) |
| **Meilisearch** | latest | Full-text search with typo tolerance, faceted filtering, instant results |
| **Socket.io** | latest | Real-time messaging, notifications, live updates |
| **Sharp** | latest | Image processing (resize, compress, watermark) |
| **Passport.js / Auth.js** | latest | Authentication (email, Google, Apple, Facebook) |
| **Stripe SDK** | latest | Payments, escrow, payouts |
| **Anthropic SDK** | latest | Claude API for AI features (vision, text) |
| **Nodemailer + SendGrid** | latest | Transactional emails |
| **Winston** | latest | Structured logging |
| **Helmet / CORS** | latest | Security headers |

### 2.3 Monorepo & Tooling

| Tool | Purpose |
|------|---------|
| **Turborepo** | Monorepo build orchestration, caching |
| **pnpm** | Package manager (fast, disk-efficient) |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Vitest** | Unit testing |
| **Playwright** | E2E testing |
| **Storybook** | Component development and documentation |
| **Docker** | Local development environment (DB, Redis, Meilisearch) |
| **docker-compose** | Multi-service local dev setup |

## 3. Architecture Decisions

### 3.1 Why Monorepo (Turborepo)?

- Shared types between frontend and backend (bike specs, API contracts)
- Shared validation schemas (Zod)
- Atomic changes across packages
- Unified CI/CD pipeline
- Code reuse for AI prompt templates

### 3.2 Why Fastify over Express?

- 2-3x faster than Express in benchmarks
- Built-in JSON schema validation (Ajv)
- TypeScript-first plugin system
- Better error handling
- Native async/await support

### 3.3 Why Meilisearch over Elasticsearch?

- Easier setup and maintenance
- Typo-tolerant by default (important for bike model names)
- Faceted search built-in
- Lower resource requirements
- Excellent for the scale we need (< 1M documents)
- If we outgrow it, migration to Elasticsearch is straightforward

### 3.4 Why PostGIS?

- Geospatial queries are core to the product (map search, nearby listings)
- Industry standard for geospatial data
- ST_DWithin for radius search, ST_Contains for area search
- Native support for GeoJSON
- Efficient spatial indexing with GiST

### 3.5 Why Claude API for AI?

- Best-in-class vision model for photo analysis
- Excellent multilingual support (all 6 of our languages)
- Strong structured output (JSON mode for bike specs extraction)
- Large context window for complex search queries
- Tool use capability for multi-step AI workflows

## 4. Key Technical Patterns

### 4.1 API Design

```
/api/v1/
├── /auth
│   ├── POST   /register
│   ├── POST   /login
│   ├── POST   /logout
│   ├── POST   /refresh
│   ├── POST   /forgot-password
│   └── POST   /verify-email
├── /users
│   ├── GET    /me
│   ├── PATCH  /me
│   ├── GET    /:id
│   ├── GET    /:id/reviews
│   ├── GET    /:id/listings
│   └── POST   /me/verify
├── /listings
│   ├── GET    /                    # Search/filter listings
│   ├── POST   /                    # Create listing
│   ├── GET    /:id
│   ├── PATCH  /:id
│   ├── DELETE /:id
│   ├── POST   /:id/boost
│   ├── POST   /:id/favorite
│   └── GET    /map                 # Geospatial search for map view
├── /rentals
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /:id
│   ├── POST   /:id/book
│   ├── GET    /:id/availability
│   └── PATCH  /:id/availability
├── /repairs
│   ├── GET    /                    # Search mechanics
│   ├── POST   /                    # Register as mechanic
│   ├── GET    /:id
│   ├── POST   /:id/book
│   └── GET    /:id/availability
├── /ai
│   ├── POST   /analyze-photo       # AI bike recognition
│   ├── POST   /smart-search        # Natural language search
│   ├── POST   /price-estimate      # AI pricing suggestion
│   └── POST   /condition-assess    # AI condition assessment
├── /messages
│   ├── GET    /conversations
│   ├── GET    /conversations/:id
│   ├── POST   /conversations/:id/messages
│   └── WebSocket /ws               # Real-time messaging
├── /transactions
│   ├── POST   /create
│   ├── POST   /:id/confirm
│   ├── POST   /:id/dispute
│   └── GET    /history
├── /reviews
│   ├── POST   /
│   └── GET    /:transactionId
└── /admin
    ├── GET    /dashboard
    ├── GET    /reports
    └── PATCH  /listings/:id/moderate
```

### 4.2 Authentication Flow

```
1. User signs up (email/social)
2. Email verification sent
3. JWT access token (15 min) + refresh token (7 days) issued
4. Access token stored in memory, refresh token in httpOnly cookie
5. Silent refresh on token expiry
6. Optional: phone verification for enhanced trust
7. Optional: ID verification (Stripe Identity) for full verification
```

### 4.3 Real-time Architecture

```
WebSocket connections via Socket.io:
- Chat messages between buyer/seller
- New listing notifications (for saved searches)
- Price drop alerts
- Booking confirmations
- Transaction status updates

Redis Pub/Sub for horizontal scaling:
- Multiple API server instances share events
- BullMQ workers publish status updates
```

### 4.4 Image Processing Pipeline

```
1. User uploads photo(s) via presigned S3 URL
2. Upload complete → BullMQ job triggered
3. Job: Sharp resizes to multiple sizes (thumb, medium, large, original)
4. Job: Sharp generates WebP + AVIF variants
5. Job: Generate blurhash placeholder
6. If AI analysis requested → separate BullMQ job
7. AI job: Send original to Claude Vision API
8. AI job: Parse structured bike specs from response
9. Return processed URLs + AI specs to frontend
```

### 4.5 Search Architecture

```
Meilisearch indexes:
- listings: Full listing data with facets (type, brand, price, size, condition, location)
- rentals: Rental bikes with availability
- mechanics: Repair service providers with specialties

Geospatial search:
- PostGIS for precise radius/polygon queries
- Mapbox for frontend map rendering with clustering
- Combined: Meilisearch for text/facets → PostGIS for geo-filtering

AI semantic search:
- User prompt → Claude API → extract intent, preferences, constraints
- Map to Meilisearch filters + weighted scoring
- Rank results by AI relevance score
```

## 5. Security

### 5.1 Authentication & Authorization
- JWT with short-lived access tokens
- RBAC (Role-Based Access Control) for user roles
- Rate limiting per endpoint (Redis-based)
- CORS whitelist
- CSRF protection for state-changing operations

### 5.2 Data Protection
- All PII encrypted at rest (PostgreSQL TDE or application-level)
- bcrypt for password hashing (cost factor 12)
- Presigned URLs for S3 (no public bucket access)
- Input sanitization on all user-generated content
- SQL injection prevention via Prisma parameterized queries
- XSS prevention via React's default escaping + CSP headers

### 5.3 Payment Security
- PCI compliance via Stripe (no card data touches our servers)
- Escrow via Stripe Connect Custom accounts
- Webhook signature verification for Stripe events

### 5.4 Infrastructure Security
- HTTPS everywhere (TLS 1.3)
- Security headers (Helmet.js)
- Dependency scanning (npm audit, Snyk)
- Secret management via environment variables (Vercel/Railway encrypted)
- Database connections via private network only

## 6. Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.5s |
| Cumulative Layout Shift | < 0.1 |
| API response time (p95) | < 200ms |
| Search response time | < 50ms |
| Image upload → processed | < 10s |
| AI photo analysis | < 15s |
| WebSocket message delivery | < 100ms |
| Map render with 1000 markers | < 1s |

### Performance Strategies

- **Next.js**: SSR for SEO pages, ISR for listing pages, CSR for dashboard
- **Images**: WebP/AVIF with blurhash placeholders, lazy loading
- **3D**: Progressive loading, LOD (Level of Detail), lazy load Three.js bundle
- **Maps**: Marker clustering, viewport-based loading, debounced search
- **API**: Redis caching, database query optimization, connection pooling
- **Search**: Meilisearch in-memory index, pre-computed facets
- **Bundle**: Code splitting, tree shaking, dynamic imports for heavy components

## 7. Development Environment

### 7.1 docker-compose.yml services

```yaml
services:
  postgres:
    image: postgis/postgis:16-3.4
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: bicimarket
      POSTGRES_USER: bici
      POSTGRES_PASSWORD: bici_dev

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  meilisearch:
    image: getmeili/meilisearch:latest
    ports: ["7700:7700"]
    environment:
      MEILI_MASTER_KEY: dev_master_key

  mailpit:
    image: axllent/mailpit
    ports: ["1025:1025", "8025:8025"]
```

### 7.2 Environment Variables

```env
# Database
DATABASE_URL=postgresql://bici:bici_dev@localhost:5432/bicimarket

# Redis
REDIS_URL=redis://localhost:6379

# Meilisearch
MEILISEARCH_URL=http://localhost:7700
MEILISEARCH_KEY=dev_master_key

# Auth
JWT_SECRET=dev-secret-change-in-production
NEXTAUTH_SECRET=dev-secret-change-in-production
NEXTAUTH_URL=http://localhost:3000

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ...

# S3 / R2
S3_BUCKET=bicimarket-dev
S3_REGION=eu-west-1
S3_ACCESS_KEY=...
S3_SECRET_KEY=...

# Email
SENDGRID_API_KEY=SG...

# Sentry
SENTRY_DSN=https://...
```
