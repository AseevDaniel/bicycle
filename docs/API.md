# API Specification

## Overview

- **Base URL**: `https://api.bicimarket.es/v1`
- **Protocol**: REST over HTTPS + WebSocket for real-time
- **Format**: JSON (Content-Type: application/json)
- **Auth**: Bearer JWT in Authorization header
- **Versioning**: URL-based (`/v1/`)
- **Rate limiting**: Redis-based, per user/IP, documented per endpoint

### Standard Response Envelope

```json
// Success
{
  "data": { ... },
  "meta": { "page": 1, "perPage": 20, "total": 150 }
}

// Error
{
  "error": {
    "code": "LISTING_NOT_FOUND",
    "message": "Listing with this ID does not exist",
    "details": {}
  }
}
```

### Standard Error Codes

| HTTP | Code | Description |
|------|------|-------------|
| 400 | `VALIDATION_ERROR` | Invalid request body |
| 401 | `UNAUTHORIZED` | Missing or invalid JWT |
| 403 | `FORBIDDEN` | Valid JWT but insufficient permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Duplicate resource |
| 422 | `UNPROCESSABLE` | Business logic error |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |

---

## Authentication

### `POST /auth/register`

```json
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "displayName": "Carlos García",
  "locale": "es"
}

// Response 201
{
  "data": {
    "user": { "id": "...", "email": "...", "displayName": "..." },
    "message": "Verification email sent"
  }
}
```

### `POST /auth/login`

```json
// Request
{ "email": "user@example.com", "password": "SecurePass123!" }

// Response 200
{
  "data": {
    "accessToken": "eyJ...",          // JWT, 15 min TTL
    "user": { "id": "...", "email": "...", "displayName": "...", "roles": ["buyer", "seller"] }
  }
}
// Sets httpOnly cookie: refreshToken (7 days)
```

### `POST /auth/refresh`

No body required — uses httpOnly refresh token cookie.

```json
// Response 200
{ "data": { "accessToken": "eyJ..." } }
```

### `POST /auth/logout`

Clears refresh token cookie, blacklists current access token in Redis.

### `POST /auth/verify-email`

```json
// Request
{ "token": "verification-token-from-email" }
```

### `POST /auth/forgot-password`

```json
{ "email": "user@example.com" }
```

### `POST /auth/reset-password`

```json
{ "token": "reset-token", "newPassword": "NewPass123!" }
```

### `POST /auth/social`

```json
// Request
{ "provider": "google", "idToken": "google-id-token" }

// Response 200 — same as login response
```

---

## Users

### `GET /users/me`

Auth required.

```json
// Response 200
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "Carlos García",
    "avatarUrl": "https://...",
    "bio": "Road cyclist based in Málaga",
    "city": "Málaga",
    "languages": ["es", "en"],
    "roles": ["buyer", "seller"],
    "verificationLevel": 1,
    "rating": 4.8,
    "reviewCount": 12,
    "responseRate": 95.5,
    "avgResponseHours": 2.3,
    "stripeAccountId": "acct_...",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### `PATCH /users/me`

```json
// Request (partial update)
{
  "displayName": "Carlos G.",
  "bio": "Updated bio",
  "city": "Marbella",
  "languages": ["es", "en", "de"]
}
```

### `POST /users/me/avatar`

Multipart form upload. Returns `{ avatarUrl: "..." }`.

### `GET /users/:id`

Public profile. Returns public fields only (no email, no stripe IDs).

### `GET /users/:id/reviews`

```
Query: page, perPage, role (buyer|seller)
```

### `GET /users/:id/listings`

```
Query: page, perPage, status (active|sold)
```

### `POST /users/me/roles`

```json
{ "roles": ["buyer", "seller", "renter"] }
```

### `POST /users/me/verify-phone`

```json
// Step 1
{ "phone": "+34612345678" }
// Response: { "message": "SMS sent" }

// Step 2
{ "phone": "+34612345678", "code": "123456" }
```

---

## Listings

### `GET /listings`

Search and filter listings.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Full-text search query |
| `bikeType` | string[] | Comma-separated bike types |
| `brand` | string[] | Comma-separated brands |
| `priceMin` | integer | Min price EUR cents |
| `priceMax` | integer | Max price EUR cents |
| `condition` | string[] | Condition grades (A,B,C,D,F) |
| `lat` | float | Center latitude for geo search |
| `lng` | float | Center longitude |
| `radiusKm` | integer | Search radius in km (default: 50) |
| `frameSize` | string[] | Frame sizes |
| `wheelSize` | string[] | Wheel sizes |
| `groupsetBrand` | string | Groupset brand |
| `isEbike` | boolean | E-bikes only |
| `motorBrand` | string | E-bike motor brand |
| `suspensionType` | string | MTB suspension type |
| `listingType` | string | `sale`, `rent`, `both` |
| `sellerType` | string | `private`, `shop` |
| `sort` | string | `newest`, `price_asc`, `price_desc`, `nearest`, `relevance` |
| `page` | integer | Default: 1 |
| `perPage` | integer | Default: 20, max: 50 |

```json
// Response 200
{
  "data": [
    {
      "id": "uuid",
      "title": "Trek Émonda SL 5 Carbon Road Bike",
      "price": 140000,
      "priceNegotiable": false,
      "condition": "B",
      "bikeType": "road",
      "brand": "Trek",
      "model": "Émonda SL 5",
      "year": 2022,
      "city": "Málaga",
      "distanceKm": 12.5,
      "primaryPhoto": { "url": "...", "blurhash": "..." },
      "seller": {
        "id": "uuid",
        "displayName": "Carlos G.",
        "rating": 4.8,
        "verificationLevel": 1
      },
      "viewCount": 45,
      "favoriteCount": 8,
      "isFavorited": false,
      "isBoosted": false,
      "createdAt": "2024-03-01T10:00:00Z"
    }
  ],
  "meta": { "page": 1, "perPage": 20, "total": 87, "totalPages": 5 }
}
```

### `GET /listings/map`

Geospatial query returning lightweight markers for map view.

```
Query: lat, lng, bbox (minLat,minLng,maxLat,maxLng), + same filters as /listings
```

```json
// Response 200
{
  "data": [
    {
      "id": "uuid",
      "lat": 36.7213,
      "lng": -4.4214,
      "price": 140000,
      "bikeType": "road",
      "condition": "B",
      "primaryPhotoThumb": "https://..."
    }
  ]
}
```

### `POST /listings`

Auth required. Seller role required.

```json
// Request
{
  "title": "Trek Émonda SL 5 Carbon Road Bike 2022",
  "description": "Excellent condition, barely used. Full Ultegra groupset.",
  "price": 140000,
  "priceNegotiable": true,
  "condition": "B",
  "listingType": "sale",
  "bikeType": "road",
  "brand": "Trek",
  "model": "Émonda SL 5",
  "year": 2022,
  "color": ["black", "white"],
  "frameMaterial": "carbon",
  "frameSize": "M",
  "wheelSize": "700c",
  "numGears": 22,
  "groupsetBrand": "Shimano",
  "groupsetLevel": "Ultegra",
  "brakeType": "hydraulic_disc",
  "handlebarType": "drop",
  "location": { "lat": 36.7213, "lng": -4.4214 },
  "city": "Málaga",
  "photoIds": ["uuid1", "uuid2", "uuid3"]
}

// Response 201
{ "data": { "id": "uuid", "status": "active", ... } }
```

### `GET /listings/:id`

Full listing detail.

```json
// Response 200
{
  "data": {
    "id": "uuid",
    "title": "...",
    "description": "...",
    "price": 140000,
    "condition": "B",
    "bikeType": "road",
    "brand": "Trek",
    "model": "Émonda SL 5",
    "year": 2022,
    "frameMaterial": "carbon",
    "frameSize": "M",
    "wheelSize": "700c",
    "numGears": 22,
    "groupsetBrand": "Shimano",
    "groupsetLevel": "Ultegra",
    "brakeType": "hydraulic_disc",
    "handlebarType": "drop",
    "photos": [
      { "id": "uuid", "urlLarge": "...", "urlMedium": "...", "urlThumb": "...", "blurhash": "...", "sortOrder": 0 }
    ],
    "location": { "city": "Málaga", "region": "Andalusia", "country": "ES" },
    "aiAnalyzed": true,
    "aiNotes": "Identified as Trek carbon road bike. High confidence on groupset (Shimano Ultegra visible).",
    "seller": {
      "id": "uuid",
      "displayName": "Carlos G.",
      "avatarUrl": "...",
      "rating": 4.8,
      "reviewCount": 12,
      "verificationLevel": 1,
      "responseRate": 95.5,
      "memberSince": "2023-06-01T00:00:00Z"
    },
    "isFavorited": false,
    "similarListings": [ /* 4-6 similar listing cards */ ],
    "viewCount": 45,
    "createdAt": "2024-03-01T10:00:00Z"
  }
}
```

### `PATCH /listings/:id`

Auth required. Own listing only.

### `DELETE /listings/:id`

Auth required. Own listing only. Soft delete (sets status to 'deleted').

### `POST /listings/:id/favorite`

Toggles favorite. Returns `{ isFavorited: true }`.

### `POST /listings/:id/boost`

```json
// Request
{ "level": 1, "days": 7 }
// Initiates Stripe payment for boost fee
// Response: { "stripeClientSecret": "pi_..." }
```

### `POST /listings/:id/report`

```json
{ "reason": "suspected_stolen", "details": "Serial number matches reported stolen bike." }
```

---

## Photo Upload

### `POST /photos/upload-url`

Get presigned S3 URL for direct browser upload.

```json
// Request
{ "contentType": "image/jpeg", "fileSize": 3145728 }

// Response 200
{
  "data": {
    "photoId": "uuid",
    "uploadUrl": "https://s3.amazonaws.com/...presigned...",
    "expiresIn": 300
  }
}
```

### `POST /photos/:id/confirm`

Called after successful S3 upload to trigger processing.

```json
// Response 200
{ "data": { "status": "processing" } }
```

---

## AI Endpoints

Rate limited: 20 req/min per user.

### `POST /ai/analyze-photo`

```json
// Request
{ "photoIds": ["uuid1", "uuid2", "uuid3"] }

// Response 200 — immediate or 202 (async)
{
  "data": {
    "sessionId": "uuid",
    "status": "processing"  // or "complete" if fast path
  }
}
```

### `GET /ai/analyze-photo/:sessionId`

Poll for analysis result.

```json
// Response 200
{
  "data": {
    "status": "complete",
    "result": {
      "bikeType": "road",
      "brand": "Trek",
      "frameMaterial": "carbon",
      "groupsetBrand": "Shimano",
      "groupsetLevel": "Ultegra",
      "brakeType": "hydraulic_disc",
      "handlebarType": "drop",
      "condition": "B",
      "confidence": { "overall": 0.87, "perField": { "bikeType": 0.98, "brand": 0.91 } },
      "aiNotes": "Clearly a Trek carbon road bike. Shimano Ultegra groupset visible on derailleur and crankset."
    }
  }
}
```

### `POST /ai/smart-search`

```json
// Request
{
  "query": "Lightweight road bike for beginners, around 500 euros, near Málaga",
  "locale": "en"
}

// Response 200
{
  "data": {
    "extractedFilters": {
      "bikeTypes": ["road"],
      "priceMax": 60000,
      "location": "Málaga",
      "radiusKm": 30,
      "condition": ["A", "B", "C"],
      "keywords": ["lightweight", "beginners"]
    },
    "searchIntent": "Beginner-friendly road bike under 500 EUR near Málaga",
    "listings": [
      {
        "listing": { /* standard listing card */ },
        "matchScore": 9.2,
        "matchReason": "Budget road bike in excellent condition, 8km from Málaga"
      }
    ]
  },
  "meta": { "total": 12 }
}
```

### `POST /ai/price-estimate`

```json
// Request
{
  "bikeType": "road",
  "brand": "Trek",
  "model": "Émonda SL 5",
  "year": 2022,
  "condition": "B",
  "frameMaterial": "carbon",
  "groupsetLevel": "Ultegra"
}

// Response 200
{
  "data": {
    "priceMin": 120000,
    "priceMax": 160000,
    "suggestedPrice": 140000,
    "reasoning": "Carbon road bikes with Ultegra groupset in excellent condition sell for 1,200–1,600 EUR in Spain. Your 2022 model is recent enough to command the higher end.",
    "tips": [
      "Include battery of photos from all angles to justify the price",
      "Mention any recent service or new components"
    ]
  }
}
```

---

## Rentals

### `GET /rentals`

Same filter structure as `/listings` plus:
- `startDate`, `endDate` — availability filtering
- `priceMin`/`priceMax` — per day price

### `GET /rentals/:id`

Full rental listing detail including calendar.

### `POST /rentals`

Create rental listing (requires `renter` role).

### `POST /rentals/:id/book`

```json
// Request
{
  "startDate": "2024-06-01",
  "endDate": "2024-06-07",
  "extras": { "helmet": true, "lock": false },
  "message": "I'll be arriving from the airport on June 1st morning."
}

// Response 201
{
  "data": {
    "bookingId": "uuid",
    "totalPrice": 42000,
    "deposit": 10000,
    "status": "pending",
    "stripeClientSecret": "pi_..."  // if instant book
  }
}
```

### `GET /rentals/:id/availability`

```json
// Response 200
{
  "data": {
    "bookedDates": [["2024-06-10", "2024-06-15"], ["2024-06-20", "2024-06-22"]],
    "blockedDates": [["2024-07-01", "2024-07-07"]],
    "priceDay": 6000,
    "priceWeek": 35000
  }
}
```

---

## Repair Services

### `GET /repairs`

```
Query: lat, lng, radiusKm, serviceType, bikeType, isMobile, sort
```

### `GET /repairs/:id`

Mechanic profile + services + availability.

### `POST /repairs`

Create mechanic profile (requires `mechanic` role).

### `POST /repairs/:id/book`

```json
// Request
{
  "serviceId": "uuid",          // optional if 'diagnostic'
  "bikeDescription": "2021 Trek road bike",
  "issueDescription": "Rear derailleur not shifting properly, making grinding noise",
  "photos": ["uuid1", "uuid2"],
  "scheduledAt": "2024-05-15T10:00:00Z",
  "locationType": "workshop"
}
```

---

## Messages

### `GET /messages/conversations`

List all conversations for authenticated user.

```json
// Response 200
{
  "data": [
    {
      "id": "uuid",
      "listing": { "id": "uuid", "title": "...", "primaryPhotoThumb": "..." },
      "otherParticipant": { "id": "uuid", "displayName": "...", "avatarUrl": "..." },
      "lastMessage": { "body": "Is this still available?", "createdAt": "..." },
      "unreadCount": 2
    }
  ]
}
```

### `GET /messages/conversations/:id`

```
Query: page, perPage (messages, paginated newest-first)
```

### `POST /messages/conversations`

Start a new conversation.

```json
{ "listingId": "uuid", "recipientId": "uuid", "body": "Is this still available?" }
```

### `POST /messages/conversations/:id`

Send message in existing conversation.

```json
{ "body": "Yes, still available! When can you come?" }
// or attach photo:
{ "photoId": "uuid" }
```

---

## Transactions

### `POST /transactions/create`

Initiate protected transaction (escrow).

```json
{
  "listingId": "uuid",
  "amount": 140000,
  "paymentMethodId": "pm_..."  // Stripe payment method
}

// Response 201
{
  "data": {
    "transactionId": "uuid",
    "stripeClientSecret": "pi_...",
    "status": "pending"
  }
}
```

### `POST /transactions/:id/confirm-receipt`

Buyer confirms they received and inspected the bike.

```json
{ "confirmed": true }
// Triggers payment release to seller
```

### `POST /transactions/:id/dispute`

```json
{
  "reason": "Bike condition significantly worse than described",
  "evidence": {
    "text": "The frame has a crack not visible in photos",
    "photoIds": ["uuid1", "uuid2"]
  }
}
```

### `GET /transactions/history`

User's transaction history (buyer + seller).

---

## Reviews

### `POST /reviews`

```json
{
  "transactionId": "uuid",
  "ratingOverall": 5,
  "ratingCommunication": 5,
  "ratingAccuracy": 5,
  "ratingTimeliness": 4,
  "comment": "Great seller, bike was exactly as described. Highly recommended!"
}
```

### `POST /reviews/:id/reply`

```json
{ "reply": "Thank you! It was a pleasure doing business with you." }
```

---

## WebSocket API

**Endpoint**: `wss://api.bicimarket.es/ws`  
**Auth**: `?token=<accessToken>` query param on connection

### Events (Server → Client)

| Event | Payload | Description |
|-------|---------|-------------|
| `message:new` | `{ conversationId, message }` | New chat message |
| `message:read` | `{ conversationId, messageId }` | Message read receipt |
| `notification:new` | `{ notification }` | New notification |
| `booking:status` | `{ bookingId, status }` | Booking status changed |
| `transaction:status` | `{ transactionId, status }` | Transaction status changed |
| `offer:received` | `{ offerId, listingId, amount }` | New offer on your listing |
| `offer:updated` | `{ offerId, status }` | Offer accepted/declined |

### Events (Client → Server)

| Event | Payload | Description |
|-------|---------|-------------|
| `message:send` | `{ conversationId, body, photoId? }` | Send message |
| `message:read` | `{ conversationId, messageId }` | Mark as read |
| `typing:start` | `{ conversationId }` | Typing indicator |
| `typing:stop` | `{ conversationId }` | Stop typing indicator |

---

## Admin API

Accessible only with `admin` role JWT.

### `GET /admin/dashboard`

Key metrics: active listings, new users, revenue, disputes.

### `GET /admin/moderation/queue`

Flagged listings pending review.

### `PATCH /admin/listings/:id/moderate`

```json
{ "action": "approve" | "reject" | "delete", "reason": "..." }
```

### `PATCH /admin/users/:id/ban`

```json
{ "banned": true, "reason": "Fraudulent listings" }
```
