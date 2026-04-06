# Deployment & DevOps

## Overview

BiciMarket uses a cloud-native deployment architecture optimized for cost-efficiency at startup scale, with a clear path to scale as traffic grows.

```
GitHub → GitHub Actions CI/CD → Vercel (frontend) + Railway (backend)
                                      ↓
                              Neon (PostgreSQL + PostGIS)
                              Upstash Redis
                              Meilisearch Cloud
                              Cloudflare R2 (file storage)
                              Cloudflare (CDN + DNS)
```

---

## 1. Infrastructure

### 1.1 Frontend — Vercel

**Why Vercel**: Native Next.js support, zero-config deployments, automatic preview deployments per PR, edge network, ISR support.

```
Plan: Pro ($20/month)
- Automatic deployments on push to main
- Preview deployments for every PR
- Edge network (CDN) globally
- Analytics built-in
- Web Vitals monitoring

Regions:
- Production: EU West (Frankfurt/Amsterdam) — closest to Spain
- Edge functions available globally
```

Environment variables set in Vercel dashboard (encrypted at rest).

### 1.2 Backend — Railway

**Why Railway**: Simple Dockerfile-based deployment, private networking, easy PostgreSQL alternative but we use Neon. Supports autoscaling. Good EU data residency options.

```
Plan: Hobby → Pro as traffic grows ($5–20/month)

Services on Railway:
- api-server (Node.js/Fastify) — 2 replicas minimum in production
- bullmq-worker (background job processor) — 1-2 replicas
- meilisearch (self-hosted) OR use Meilisearch Cloud

Resources:
- API server: 512MB RAM, 0.5 vCPU minimum → scale up as needed
- Worker: 1GB RAM (processes images, calls Claude API)
```

### 1.3 Database — Neon

**Why Neon**: Serverless PostgreSQL with PostGIS support, branching (database branches for each PR), autoscaling, pay-per-use.

```
Plan: Launch ($19/month)
- 10GB storage
- Autoscaling compute
- Branching for dev/staging/PR previews
- Daily automated backups
- EU region (Frankfurt)

Connection:
- Use connection pooling via PgBouncer (Neon provides this)
- Prisma connects via connection string from Neon
```

### 1.4 Redis — Upstash

**Why Upstash**: Serverless Redis, pay-per-request, EU region, REST API (works in edge environments), free tier generous.

```
Plan: Pay-as-you-go (~$5-20/month depending on usage)
- Used for: caching, session data, rate limiting, BullMQ queue
- Max message size: 1MB (sufficient for our use)
- Region: EU West
```

### 1.5 File Storage — Cloudflare R2

**Why R2**: S3-compatible API, zero egress fees (major cost advantage over AWS S3), free tier (10GB), globally distributed.

```
Bucket structure:
  bicimarket-prod/
  ├── listings/
  │   ├── {listing-id}/
  │   │   ├── original/
  │   │   ├── large/      (1200px WebP)
  │   │   ├── medium/     (600px WebP)
  │   │   └── thumb/      (200px WebP)
  ├── avatars/
  ├── shops/
  └── temp/               (pre-upload staging, TTL 24h)

Access:
- Public read via Cloudflare CDN custom domain: cdn.bicimarket.es
- Write via presigned URLs (time-limited, 5 min)
- Direct browser upload (no proxy through our servers)
```

### 1.6 Search — Meilisearch Cloud

```
Plan: Build ($30/month)
- 100K documents
- 3 indexes
- EU hosting

Indexes: listings, rentals, mechanics
Sync: BullMQ job syncs on every listing create/update/delete
```

### 1.7 CDN & DNS — Cloudflare

```
- DNS management for bicimarket.es
- CDN for all static assets and R2 bucket
- DDoS protection (always-on free tier)
- Web Application Firewall (WAF) on Pro plan when needed
- Analytics (real-time traffic, threats)
- Workers for edge redirects and locale detection
```

### 1.8 Email — Resend

**Why Resend**: Modern email API, great developer experience, better than SendGrid for startups, React Email templates.

```
Plan: Pro ($20/month)
- 50K emails/month
- Custom domain: noreply@bicimarket.es
- Webhooks for delivery tracking

Email types:
- Welcome / email verification
- Password reset
- New message notification
- Booking confirmation
- Transaction updates
- Weekly saved search digest
- Review reminder
```

---

## 2. CI/CD Pipeline

### 2.1 GitHub Actions Workflows

#### `ci.yml` — Runs on every PR

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo lint
      - run: pnpm turbo type-check

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgis/postgis:16-3.4
        env: { POSTGRES_DB: test, POSTGRES_USER: test, POSTGRES_PASSWORD: test }
      redis:
        image: redis:7-alpine
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test
          REDIS_URL: redis://localhost:6379

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: npx playwright install --with-deps chromium
      - run: pnpm turbo e2e
        env:
          BASE_URL: http://localhost:3000
          # ... test env vars

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo build
```

#### `deploy.yml` — Runs on merge to main

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        run: |
          curl -fsSL https://railway.app/install.sh | sh
          railway up --service api-server
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-worker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy worker to Railway
        run: |
          curl -fsSL https://railway.app/install.sh | sh
          railway up --service bullmq-worker
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  # Frontend deploys automatically via Vercel GitHub integration
  # No explicit step needed — Vercel detects push to main
```

#### `db-migrate.yml` — Runs migrations after API deploy

```yaml
name: Run DB Migrations

on:
  workflow_run:
    workflows: ["Deploy"]
    types: [completed]

jobs:
  migrate:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter api prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## 3. Environments

| Environment | Frontend | Backend | Database | Purpose |
|------------|---------|---------|----------|---------|
| **Development** | localhost:3000 | localhost:4000 | Docker postgres | Local dev |
| **Preview** | vercel-pr-xxx.vercel.app | Railway preview | Neon branch | PR review |
| **Staging** | staging.bicimarket.es | staging-api.bicimarket.es | Neon staging branch | Pre-prod testing |
| **Production** | bicimarket.es | api.bicimarket.es | Neon production | Live site |

### Preview Deployments

- Every PR gets automatic preview deployment on Vercel
- Neon database branching: each PR gets a database branch (copy of staging data)
- Railway: manual preview deployments for backend (auto-preview when budget allows)

---

## 4. Docker — Local Development

### `docker-compose.yml`

```yaml
version: '3.9'

services:
  postgres:
    image: postgis/postgis:16-3.4
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: bicimarket
      POSTGRES_USER: bici
      POSTGRES_PASSWORD: bici_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bici"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  meilisearch:
    image: getmeili/meilisearch:latest
    ports:
      - "7700:7700"
    environment:
      MEILI_MASTER_KEY: dev_master_key
      MEILI_ENV: development
    volumes:
      - meilisearch_data:/meili_data

  mailpit:
    image: axllent/mailpit:latest
    ports:
      - "1025:1025"   # SMTP
      - "8025:8025"   # Web UI to view emails

volumes:
  postgres_data:
  redis_data:
  meilisearch_data:
```

### Getting Started

```bash
# 1. Start infrastructure
docker compose up -d

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env.local
# Fill in ANTHROPIC_API_KEY, STRIPE_* keys (test keys), MAPBOX_TOKEN

# 4. Run database migrations + seed
pnpm --filter api prisma migrate dev
pnpm --filter api prisma db seed

# 5. Start Meilisearch index sync
pnpm --filter api run seed:search

# 6. Start dev servers
pnpm dev
# Frontend: http://localhost:3000
# API: http://localhost:4000
# Meilisearch UI: http://localhost:7700
# Mailpit (email preview): http://localhost:8025
```

---

## 5. Environment Variables

### Complete Reference

```env
# ===================
# DATABASE
# ===================
DATABASE_URL=postgresql://bici:bici_dev@localhost:5432/bicimarket
# Production: Neon pooled connection string

# ===================
# REDIS
# ===================
REDIS_URL=redis://localhost:6379
# Production: Upstash Redis URL

# ===================
# SEARCH
# ===================
MEILISEARCH_URL=http://localhost:7700
MEILISEARCH_KEY=dev_master_key
# Production: Meilisearch Cloud URL + API key

# ===================
# AUTH
# ===================
JWT_SECRET=dev-jwt-secret-change-in-production-min-32-chars
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production-min-32-chars
NEXTAUTH_SECRET=dev-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Social auth (create apps at each provider)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

# ===================
# AI (Anthropic)
# ===================
ANTHROPIC_API_KEY=sk-ant-...

# ===================
# PAYMENTS (Stripe)
# ===================
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ===================
# FILE STORAGE (Cloudflare R2 / AWS S3 compatible)
# ===================
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
S3_BUCKET=bicimarket-dev
S3_REGION=auto
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
NEXT_PUBLIC_CDN_URL=https://cdn.bicimarket.es

# ===================
# MAPS (Mapbox)
# ===================
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ...

# ===================
# EMAIL (Resend)
# ===================
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@bicimarket.es

# Dev: use Mailpit SMTP
SMTP_HOST=localhost
SMTP_PORT=1025

# ===================
# MONITORING (Sentry)
# ===================
SENTRY_DSN=https://...
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_ORG=bicimarket
SENTRY_PROJECT=web

# ===================
# APP CONFIG
# ===================
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:4000
LOG_LEVEL=debug

# Feature flags
ENABLE_AI_FEATURES=true
ENABLE_RENTALS=true
ENABLE_REPAIRS=true
ENABLE_ESCROW=false  # Phase 3
```

---

## 6. Monitoring & Observability

### 6.1 Error Tracking — Sentry

```
- Frontend: Next.js Sentry SDK (catches React errors, API route errors)
- Backend: Fastify Sentry plugin
- Source maps uploaded on deploy (shows original TS code in stack traces)
- Alerts: Slack notification on new error or error rate spike
```

### 6.2 Application Performance Monitoring

```
- Vercel Analytics: Web Vitals (LCP, FCP, CLS, INP) per route
- Vercel Speed Insights: Real user monitoring
- Railway metrics: CPU, RAM, request rate for API server
- Upstash Redis: Request count, latency
```

### 6.3 Logging — Winston (Backend)

```javascript
// Structured JSON logs
{
  "level": "info",
  "message": "Listing created",
  "listingId": "uuid",
  "userId": "uuid",
  "duration": 120,
  "timestamp": "2024-03-01T10:00:00Z"
}

// Log levels: error, warn, info, http, debug
// Production: error + warn + info only
// Development: all levels
```

Log shipping: Railway → Datadog or Logtail (affordable option).

### 6.4 Uptime Monitoring — Better Stack

```
- HTTP checks every 60 seconds from EU locations
- Check: bicimarket.es, api.bicimarket.es/health
- Alert: email + Slack within 1 minute of downtime
- Status page: status.bicimarket.es (public)
```

### 6.5 Health Check Endpoint

```
GET /health
Response 200:
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2024-03-01T10:00:00Z",
  "services": {
    "database": "ok",
    "redis": "ok",
    "meilisearch": "ok"
  }
}
```

---

## 7. Security Practices

### 7.1 Secrets Management

- Never commit secrets to git (`.env` in `.gitignore`)
- Vercel: environment variables encrypted in Vercel dashboard
- Railway: environment variables encrypted in Railway dashboard
- Rotation: JWT secrets rotated quarterly
- Stripe: use restricted API keys with minimal permissions

### 7.2 Dependency Security

```bash
# Run weekly (automated via GitHub Actions schedule)
pnpm audit
npx snyk test

# Dependabot enabled for automatic PR on vulnerable deps
```

### 7.3 HTTPS / TLS

- Vercel: automatic TLS via Let's Encrypt
- Railway: automatic TLS
- Cloudflare: full strict SSL mode (Cloudflare ↔ origin encrypted)
- HSTS header: `Strict-Transport-Security: max-age=31536000; includeSubDomains`

### 7.4 Security Headers

Set via Next.js `next.config.js` and Fastify Helmet:

```javascript
// Security headers
Content-Security-Policy: default-src 'self'; img-src 'self' https://cdn.bicimarket.es; ...
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=()
```

---

## 8. Scaling Plan

### Current Architecture (0-10K users)

- Vercel Hobby/Pro — sufficient
- Railway single instance per service
- Neon serverless — auto-scales
- Upstash — serverless, auto-scales
- Meilisearch Cloud Build plan

### Growth (10K-100K users)

- Vercel Pro — add more bandwidth
- Railway: 2 API replicas, 2 worker replicas
- Neon: upgrade storage tier
- Meilisearch Cloud: Scale plan
- Add Cloudflare CDN caching for API responses (public endpoints)

### Scale (100K+ users)

- Consider moving to AWS/GCP for more control and cost optimization
- API: ECS Fargate or Kubernetes
- Separate read replicas for DB-heavy reporting queries
- Elasticsearch if Meilisearch limits reached
- CDN: Cloudflare Enterprise for advanced features

---

## 9. Backup & Disaster Recovery

### Database Backups

- Neon: automatic daily backups (retained 7 days on Launch plan)
- Manual: weekly pg_dump exported to R2 (retained 30 days)
- Point-in-time recovery: Neon supports 7-day PITR

### Recovery Targets

| Metric | Target |
|--------|--------|
| RTO (Recovery Time Objective) | < 1 hour |
| RPO (Recovery Point Objective) | < 24 hours |

### Incident Response

1. Alert fires (Sentry / Better Stack)
2. On-call engineer notified (PagerDuty or Better Stack)
3. Check Railway/Vercel status pages
4. Assess: rollback vs fix-forward
5. Rollback: Vercel instant rollback (1 click) / Railway rollback
6. Post-mortem within 48 hours for P0 incidents
