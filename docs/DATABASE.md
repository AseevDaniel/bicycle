# Database Schema & Data Models

## Overview

**Primary DB**: PostgreSQL 16 with PostGIS 3.x extension  
**ORM**: Prisma (type-safe queries, migrations)  
**Naming**: snake_case for all DB identifiers, camelCase in Prisma/TypeScript  

---

## Schema Diagram (Simplified)

```
users
  ├── user_roles (1:many)
  ├── listings (1:many)
  ├── rentals (1:many)
  ├── mechanic_profiles (1:1)
  ├── shop_profiles (1:1)
  ├── reviews_given (1:many)
  ├── reviews_received (1:many)
  ├── conversations_as_buyer (1:many)
  ├── conversations_as_seller (1:many)
  └── transactions (1:many)

listings
  ├── listing_photos (1:many)
  ├── listing_specs (1:1)
  ├── ebike_specs (1:1, optional)
  ├── mtb_specs (1:1, optional)
  ├── favorites (1:many)
  ├── views (1:many)
  ├── offers (1:many)
  └── transactions (1:many)

transactions
  ├── reviews (1:many, max 2)
  └── disputes (1:1, optional)

rental_listings
  ├── rental_bookings (1:many)
  └── rental_availability (1:many)

mechanic_profiles
  ├── mechanic_services (1:many)
  └── repair_bookings (1:many)
```

---

## 1. Users & Profiles

### `users`

```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  email_verified  BOOLEAN DEFAULT false,
  phone           VARCHAR(30),
  phone_verified  BOOLEAN DEFAULT false,
  password_hash   VARCHAR(255),           -- null for social auth
  display_name    VARCHAR(100) NOT NULL,
  avatar_url      TEXT,
  bio             TEXT,
  city            VARCHAR(100),
  location        GEOGRAPHY(POINT, 4326), -- approximate user location
  languages       VARCHAR(10)[],          -- ['en', 'es', 'de']
  verification_level  SMALLINT DEFAULT 0, -- 0=basic, 1=verified, 2=trusted, 3=pro
  stripe_customer_id  VARCHAR(100),
  stripe_account_id   VARCHAR(100),       -- for payouts (seller/mechanic)
  rating          DECIMAL(3,2),           -- cached, recalculated on new review
  review_count    INTEGER DEFAULT 0,
  response_rate   DECIMAL(5,2),           -- % of messages replied to
  avg_response_hours  DECIMAL(5,1),
  is_active       BOOLEAN DEFAULT true,
  is_banned       BOOLEAN DEFAULT false,
  ban_reason      TEXT,
  last_active_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_location ON users USING GIST(location);
CREATE INDEX idx_users_email ON users(email);
```

### `user_roles`

```sql
CREATE TABLE user_roles (
  user_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  role      VARCHAR(20) NOT NULL, -- 'buyer', 'seller', 'renter', 'tenant', 'mechanic', 'shop'
  active    BOOLEAN DEFAULT true,
  PRIMARY KEY (user_id, role)
);
```

### `user_verification_documents`

```sql
CREATE TABLE user_verification_documents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  type          VARCHAR(30) NOT NULL,   -- 'id_card', 'passport', 'drivers_license', 'business_reg'
  status        VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  stripe_identity_session_id  VARCHAR(100),
  submitted_at  TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at   TIMESTAMPTZ
);
```

### `social_accounts`

```sql
CREATE TABLE social_accounts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  provider    VARCHAR(20) NOT NULL, -- 'google', 'apple', 'facebook'
  provider_id VARCHAR(255) NOT NULL,
  UNIQUE(provider, provider_id)
);
```

---

## 2. Listings (Sale)

### `listings`

```sql
CREATE TABLE listings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id       UUID REFERENCES users(id) NOT NULL,
  status          VARCHAR(20) DEFAULT 'active',
  -- 'draft', 'active', 'paused', 'sold', 'expired', 'moderated', 'deleted'
  listing_type    VARCHAR(10) DEFAULT 'sale', -- 'sale', 'rent', 'both'
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  price           INTEGER NOT NULL,            -- in EUR cents
  price_negotiable BOOLEAN DEFAULT false,
  condition       CHAR(1) NOT NULL,            -- 'A', 'B', 'C', 'D', 'F'

  -- Location (approximate — city-level shown publicly, precise for meetup)
  location        GEOGRAPHY(POINT, 4326) NOT NULL,
  city            VARCHAR(100),
  region          VARCHAR(100),
  country         CHAR(2) DEFAULT 'ES',

  -- Core bike fields
  bike_type       VARCHAR(20) NOT NULL,        -- 'road', 'mtb', 'city', etc.
  brand           VARCHAR(100),
  model           VARCHAR(255),
  year            SMALLINT,
  color           VARCHAR(50)[],
  frame_material  VARCHAR(30),
  frame_size      VARCHAR(10),                 -- 'S', 'M', 'L', 'XL', '54cm', etc.
  wheel_size      VARCHAR(10),                 -- '700c', '29', '27.5', etc.
  serial_number   VARCHAR(100),

  -- Drivetrain
  num_gears       SMALLINT,
  groupset_brand  VARCHAR(50),
  groupset_level  VARCHAR(50),

  -- Components
  brake_type      VARCHAR(30),
  handlebar_type  VARCHAR(30),

  -- AI metadata
  ai_analyzed     BOOLEAN DEFAULT false,
  ai_confidence   DECIMAL(4,3),
  ai_notes        TEXT,

  -- Engagement
  view_count      INTEGER DEFAULT 0,
  favorite_count  INTEGER DEFAULT 0,

  -- Boost / featured
  is_boosted      BOOLEAN DEFAULT false,
  boosted_until   TIMESTAMPTZ,
  boost_level     SMALLINT DEFAULT 0, -- 0=none, 1=basic, 2=premium

  -- Moderation
  is_flagged      BOOLEAN DEFAULT false,
  flag_reason     TEXT,
  moderated_at    TIMESTAMPTZ,

  expires_at      TIMESTAMPTZ,
  sold_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_listings_location ON listings USING GIST(location);
CREATE INDEX idx_listings_seller ON listings(seller_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_bike_type ON listings(bike_type);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_created ON listings(created_at DESC);
```

### `listing_photos`

```sql
CREATE TABLE listing_photos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id    UUID REFERENCES listings(id) ON DELETE CASCADE,
  url_original  TEXT NOT NULL,
  url_large     TEXT,   -- 1200px wide WebP
  url_medium    TEXT,   -- 600px wide WebP
  url_thumb     TEXT,   -- 200px wide WebP
  url_avif      TEXT,   -- AVIF variant
  blurhash      VARCHAR(50),
  width         INTEGER,
  height        INTEGER,
  sort_order    SMALLINT DEFAULT 0,
  is_primary    BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_listing_photos_listing ON listing_photos(listing_id, sort_order);
```

### `ebike_specs`

```sql
CREATE TABLE ebike_specs (
  listing_id        UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
  motor_brand       VARCHAR(50),        -- 'Bosch', 'Shimano', 'Brose', etc.
  motor_type        VARCHAR(20),        -- 'mid-drive', 'hub'
  motor_model       VARCHAR(100),
  battery_wh        INTEGER,            -- e.g. 500
  battery_health_pct SMALLINT,          -- 0-100
  charge_cycles     INTEGER,
  range_km          INTEGER,
  max_speed_kmh     SMALLINT,           -- 25 or 45
  display_brand     VARCHAR(50),
  charger_included  BOOLEAN
);
```

### `mtb_specs`

```sql
CREATE TABLE mtb_specs (
  listing_id        UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
  suspension_type   VARCHAR(20),        -- 'hardtail', 'full', 'rigid'
  fork_brand        VARCHAR(50),
  fork_model        VARCHAR(100),
  fork_travel_mm    SMALLINT,
  rear_shock_brand  VARCHAR(50),
  rear_shock_model  VARCHAR(100),
  rear_travel_mm    SMALLINT,
  wheel_standard    VARCHAR(20)         -- 'boost', 'superboost', 'standard'
);
```

### `favorites`

```sql
CREATE TABLE favorites (
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  listing_id  UUID REFERENCES listings(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, listing_id)
);
```

### `listing_views`

```sql
CREATE TABLE listing_views (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID REFERENCES listings(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL, -- null for anonymous
  session_id  VARCHAR(64),
  ip_hash     VARCHAR(64),   -- hashed for privacy
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_listing_views_listing ON listing_views(listing_id);
```

### `offers`

```sql
CREATE TABLE offers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  amount      INTEGER NOT NULL,    -- EUR cents
  status      VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'countered', 'expired'
  counter_amount INTEGER,          -- if seller countered
  message     TEXT,
  expires_at  TIMESTAMPTZ DEFAULT NOW() + INTERVAL '48 hours',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Rental Module

### `rental_listings`

```sql
CREATE TABLE rental_listings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID REFERENCES listings(id) ON DELETE CASCADE,
  owner_id        UUID REFERENCES users(id) NOT NULL,
  price_day       INTEGER NOT NULL,    -- EUR cents/day
  price_week      INTEGER,             -- EUR cents/week (optional discount)
  price_month     INTEGER,             -- EUR cents/month
  deposit         INTEGER DEFAULT 0,  -- security deposit EUR cents
  min_days        SMALLINT DEFAULT 1,
  max_days        SMALLINT,
  instant_book    BOOLEAN DEFAULT false,
  pickup_type     VARCHAR(20) DEFAULT 'pickup',  -- 'pickup', 'delivery', 'both'
  pickup_address  TEXT,
  delivery_km     SMALLINT,           -- max delivery radius
  delivery_fee_per_km INTEGER,        -- EUR cents per km
  included_extras TEXT[],             -- ['helmet', 'lock', 'lights', 'panniers']
  rules           TEXT,
  status          VARCHAR(20) DEFAULT 'active',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### `rental_bookings`

```sql
CREATE TABLE rental_bookings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_listing_id UUID REFERENCES rental_listings(id) ON DELETE CASCADE,
  tenant_id         UUID REFERENCES users(id) NOT NULL,
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,
  days              INTEGER NOT NULL,
  total_price       INTEGER NOT NULL,   -- EUR cents
  deposit           INTEGER DEFAULT 0,
  extras            JSONB DEFAULT '{}', -- {"helmet": true, "lock": true}
  extras_total      INTEGER DEFAULT 0,
  status            VARCHAR(20) DEFAULT 'pending',
  -- 'pending', 'confirmed', 'active', 'completed', 'cancelled', 'disputed'
  tenant_message    TEXT,
  stripe_payment_intent_id  VARCHAR(100),
  deposit_intent_id         VARCHAR(100),
  confirmed_at      TIMESTAMPTZ,
  cancelled_at      TIMESTAMPTZ,
  cancel_reason     TEXT,
  checkin_at        TIMESTAMPTZ,
  checkout_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rental_bookings_listing ON rental_bookings(rental_listing_id);
CREATE INDEX idx_rental_bookings_dates ON rental_bookings(start_date, end_date);
```

### `rental_blocked_dates`

```sql
CREATE TABLE rental_blocked_dates (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_listing_id UUID REFERENCES rental_listings(id) ON DELETE CASCADE,
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,
  reason            TEXT            -- 'owner use', 'maintenance', etc.
);
```

---

## 4. Repair Services

### `mechanic_profiles`

```sql
CREATE TABLE mechanic_profiles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  business_name     VARCHAR(255),
  description       TEXT,
  location          GEOGRAPHY(POINT, 4326),
  address           TEXT,
  city              VARCHAR(100),
  service_type      VARCHAR(20) NOT NULL,  -- 'workshop', 'mobile', 'both'
  coverage_area     GEOGRAPHY(POLYGON, 4326),  -- for mobile mechanics
  coverage_km       SMALLINT,
  certifications    TEXT[],
  bike_types_served VARCHAR(20)[],         -- bike types they work on
  brands_specialized VARCHAR(50)[],        -- e-bike brands certified for
  accepts_parts_orders BOOLEAN DEFAULT false,
  working_hours     JSONB,                 -- {"mon": {"open": "09:00", "close": "18:00"}, ...}
  response_hours    SMALLINT DEFAULT 24,   -- typical response time
  rating            DECIMAL(3,2),
  review_count      INTEGER DEFAULT 0,
  is_verified       BOOLEAN DEFAULT false,
  is_active         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mechanic_location ON mechanic_profiles USING GIST(location);
CREATE INDEX idx_mechanic_coverage ON mechanic_profiles USING GIST(coverage_area);
```

### `mechanic_services`

```sql
CREATE TABLE mechanic_services (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mechanic_id     UUID REFERENCES mechanic_profiles(id) ON DELETE CASCADE,
  service_key     VARCHAR(50) NOT NULL,    -- 'tune_up', 'flat_repair', 'overhaul', etc.
  custom_name     VARCHAR(255),            -- if custom service
  description     TEXT,
  price_min       INTEGER,                 -- EUR cents
  price_max       INTEGER,
  duration_hours  DECIMAL(4,1),            -- estimated hours
  is_active       BOOLEAN DEFAULT true
);
```

### `repair_bookings`

```sql
CREATE TABLE repair_bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mechanic_id     UUID REFERENCES mechanic_profiles(id) NOT NULL,
  customer_id     UUID REFERENCES users(id) NOT NULL,
  service_id      UUID REFERENCES mechanic_services(id),
  bike_listing_id UUID REFERENCES listings(id),  -- optional, if bike is on platform
  bike_description TEXT NOT NULL,
  issue_description TEXT NOT NULL,
  photos          TEXT[],                  -- S3 URLs of issue photos
  scheduled_at    TIMESTAMPTZ,
  location_type   VARCHAR(20),             -- 'workshop', 'customer_location'
  customer_address TEXT,
  status          VARCHAR(20) DEFAULT 'pending',
  -- 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
  diagnosis       TEXT,                    -- mechanic fills in after inspection
  quoted_price    INTEGER,                 -- EUR cents (after diagnosis)
  final_price     INTEGER,
  ai_diagnosis    JSONB,                   -- AI pre-diagnosis
  stripe_payment_intent_id VARCHAR(100),
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Transactions & Payments

### `transactions`

```sql
CREATE TABLE transactions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id          UUID REFERENCES listings(id),
  buyer_id            UUID REFERENCES users(id) NOT NULL,
  seller_id           UUID REFERENCES users(id) NOT NULL,
  type                VARCHAR(20) NOT NULL,  -- 'sale', 'rental', 'repair'
  amount              INTEGER NOT NULL,      -- EUR cents
  platform_fee        INTEGER NOT NULL,      -- EUR cents
  seller_payout       INTEGER NOT NULL,      -- EUR cents
  currency            CHAR(3) DEFAULT 'EUR',
  status              VARCHAR(20) DEFAULT 'pending',
  -- 'pending', 'escrowed', 'released', 'refunded', 'disputed', 'failed'
  payment_method      VARCHAR(20),           -- 'stripe', 'direct'
  stripe_payment_intent_id VARCHAR(100),
  stripe_transfer_id       VARCHAR(100),
  inspection_window_hours  SMALLINT DEFAULT 48,
  inspection_ends_at  TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  refunded_at         TIMESTAMPTZ,
  refund_reason       TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);
```

### `disputes`

```sql
CREATE TABLE disputes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id  UUID REFERENCES transactions(id) UNIQUE,
  opened_by       UUID REFERENCES users(id) NOT NULL,
  reason          TEXT NOT NULL,
  evidence_buyer  JSONB,   -- { photos: [], text: "..." }
  evidence_seller JSONB,
  status          VARCHAR(20) DEFAULT 'open',   -- 'open', 'resolved', 'escalated'
  resolution      VARCHAR(20),                  -- 'full_refund', 'partial_refund', 'released'
  resolution_amount INTEGER,
  admin_notes     TEXT,
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. Reviews

### `reviews`

```sql
CREATE TABLE reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id  UUID REFERENCES transactions(id) NOT NULL,
  reviewer_id     UUID REFERENCES users(id) NOT NULL,
  reviewee_id     UUID REFERENCES users(id) NOT NULL,
  role            VARCHAR(10) NOT NULL,   -- 'buyer' (reviewer was buyer), 'seller'
  rating_overall  SMALLINT NOT NULL,      -- 1-5
  rating_communication SMALLINT,
  rating_accuracy SMALLINT,
  rating_timeliness SMALLINT,
  comment         TEXT,
  is_public       BOOLEAN DEFAULT true,
  reply           TEXT,                   -- reviewee can reply
  reply_at        TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(transaction_id, reviewer_id)
);

CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id, created_at DESC);
```

---

## 7. Messaging

### `conversations`

```sql
CREATE TABLE conversations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id    UUID REFERENCES listings(id) ON DELETE SET NULL,
  participant_1 UUID REFERENCES users(id) NOT NULL,
  participant_2 UUID REFERENCES users(id) NOT NULL,
  last_message_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(listing_id, participant_1, participant_2)
);

CREATE INDEX idx_conversations_p1 ON conversations(participant_1, last_message_at DESC);
CREATE INDEX idx_conversations_p2 ON conversations(participant_2, last_message_at DESC);
```

### `messages`

```sql
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID REFERENCES users(id) NOT NULL,
  body            TEXT,
  attachment_url  TEXT,
  attachment_type VARCHAR(20),  -- 'image', 'file'
  read_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at ASC);
```

---

## 8. Saved Searches & Notifications

### `saved_searches`

```sql
CREATE TABLE saved_searches (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(255),
  filters     JSONB NOT NULL,     -- serialized filter state
  notify_push BOOLEAN DEFAULT true,
  notify_email BOOLEAN DEFAULT false,
  last_notified_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### `notifications`

```sql
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  type        VARCHAR(50) NOT NULL,  -- 'new_message', 'offer_received', 'booking_confirmed', etc.
  title       VARCHAR(255),
  body        TEXT,
  data        JSONB,                 -- context data (listing_id, conversation_id, etc.)
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
```

---

## 9. Shop Profiles

### `shop_profiles`

```sql
CREATE TABLE shop_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  logo_url        TEXT,
  cover_url       TEXT,
  location        GEOGRAPHY(POINT, 4326),
  address         TEXT,
  city            VARCHAR(100),
  website         VARCHAR(255),
  phone           VARCHAR(30),
  working_hours   JSONB,
  specialties     TEXT[],
  brands_carried  TEXT[],
  is_verified     BOOLEAN DEFAULT false,
  subscription_tier VARCHAR(20) DEFAULT 'starter',  -- 'starter', 'business', 'enterprise'
  subscription_expires TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 10. Search Indexing (Meilisearch Sync)

A background job keeps Meilisearch in sync with PostgreSQL.

### Index: `listings`

```json
{
  "id": "uuid",
  "title": "...",
  "description": "...",
  "bikeType": "road",
  "brand": "Trek",
  "model": "Émonda SL",
  "year": 2022,
  "condition": "B",
  "price": 140000,
  "priceNegotiable": false,
  "frameMaterial": "carbon",
  "frameSize": "M",
  "wheelSize": "700c",
  "groupsetBrand": "Shimano",
  "numGears": 22,
  "brakeType": "hydraulic_disc",
  "isEbike": false,
  "city": "Málaga",
  "region": "Andalusia",
  "country": "ES",
  "_geo": { "lat": 36.7213, "lng": -4.4214 },
  "sellerRating": 4.8,
  "isVerifiedSeller": true,
  "viewCount": 120,
  "createdAt": 1710000000
}
```

Facets configured: `bikeType`, `brand`, `condition`, `frameMaterial`, `frameSize`, `groupsetBrand`, `brakeType`, `country`, `region`, `isEbike`

### Geosearch

Meilisearch `_geo` field + `geoPoint` filter for radius search:
```
filter: "_geoRadius(36.7213, -4.4214, 25000)"  // 25km radius in meters
```

---

## 11. Migrations Strategy

Using Prisma Migrate:

```
prisma/
├── schema.prisma          # Source of truth
├── migrations/
│   ├── 001_initial/       # Base tables
│   ├── 002_rental/        # Rental module
│   ├── 003_repairs/       # Repair module
│   └── ...
└── seed.ts                # Seed data (bike brands, categories, service types)
```

Seed data includes:
- All bike brands (200+)
- Bike type taxonomy
- Service type catalog with suggested prices
- Spanish cities with coordinates
- Sample listings for local development
