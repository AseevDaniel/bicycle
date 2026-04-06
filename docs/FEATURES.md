# Features Specification & User Flows

## 1. Listing Creation (Sell a Bike)

### 1.1 Overview

The listing creation flow is the core of BiciMarket. The primary differentiator is AI-powered photo analysis that pre-fills all spec fields, making it dead-simple for casual sellers.

### 1.2 User Flow — Seller

```
[Start] → Choose: "AI Photo" OR "Manual Entry"
              │
    ┌─────────┴──────────┐
    │                    │
[AI Photo]          [Manual]
    │                    │
Upload 1-5 photos    Select bike type
    │                    │
AI analyzes          Select category
    │                    │
Pre-filled form      Fill specs manually
    │                    │
    └─────────┬──────────┘
              │
         Review/edit all fields
              │
         Add listing details
         (title, price, description)
              │
         Set location
         (postcode, city, or pin on map)
              │
         Choose listing type
         (Sale / Rent / Both)
              │
         Set photos order (drag & drop)
              │
         Preview listing
              │
         Publish → [Listed!]
```

### 1.3 Bike Specification Fields

All spec fields use structured enums with human-readable labels. Unknown values can be left as "Not sure" and marked for buyer visibility.

#### Core Fields (All Bikes)

| Field | Type | Options / Format |
|-------|------|-----------------|
| **Bike Type** | enum | Road, Mountain (MTB), City/Urban, Gravel, E-Bike, BMX, Kids, Folding, Cargo, Hybrid, Cyclocross, Track |
| **Brand** | autocomplete | 200+ brands + "Other" |
| **Model** | text | Free text |
| **Year** | select | 1980–current |
| **Condition** | enum | A (Like New), B (Excellent), C (Good), D (Fair), F (Project) |
| **Price (EUR)** | number | + "Open to offers" toggle |
| **Frame Size** | enum | XS/S/M/L/XL + cm (e.g. 54cm) |
| **Frame Material** | enum | Aluminium, Carbon, Steel, Titanium, Chromoly |
| **Wheel Size** | enum | 26", 27.5", 29", 700c, 650b, 20", 24" |
| **Color** | multi-select | 15 colors |
| **Serial Number** | text | Optional, for theft protection |
| **Location** | geo | Postcode or map pin |

#### Drivetrain Fields

| Field | Type | Options |
|-------|------|---------|
| **Number of Gears** | select | 1, 7, 8, 9, 10, 11, 12, 21, 24, 27 |
| **Groupset Brand** | enum | Shimano, SRAM, Campagnolo, microSHIFT, Other |
| **Groupset Level** | enum | Entry, Tiagra/SX, 105/GX, Ultegra/Force, Dura-Ace/Red, XX/XX1 |
| **Crankset** | text | Optional |
| **Derailleur** | text | Optional |

#### E-Bike Specific Fields

| Field | Type | Format |
|-------|------|--------|
| **Motor Brand** | enum | Bosch, Shimano, Brose, Yamaha, Fazua, Mahle, Other |
| **Motor Type** | enum | Mid-drive, Hub drive |
| **Battery Capacity (Wh)** | select | 250, 300, 400, 500, 625, 750, Other |
| **Battery Health (%)** | number | 0–100% (estimated) |
| **Range (km)** | number | Estimated |
| **Max Speed (km/h)** | select | 25 (standard), 45 (S-Pedelec) |
| **Charge Cycles** | number | Optional |

#### MTB Specific Fields

| Field | Type | Options |
|-------|------|---------|
| **Suspension Type** | enum | Hardtail, Full Suspension, Rigid |
| **Fork Travel (mm)** | select | 80, 100, 120, 130, 140, 150, 160, 170+ |
| **Rear Shock Travel (mm)** | select | 100, 115, 120, 130, 140, 150+ |
| **Fork Brand** | enum | Fox, RockShox, Manitou, Suntour, Other |

#### Brakes & Components

| Field | Type | Options |
|-------|------|---------|
| **Brake Type** | enum | Hydraulic Disc, Mechanical Disc, Rim (V-brake), Rim (Caliper), Coaster |
| **Brake Brand** | text | Shimano, SRAM, Magura, TRP, etc. |
| **Handlebar Type** | enum | Drop, Flat, Riser, Bullhorn, Aero |
| **Saddle Brand** | text | Optional |
| **Pedals** | enum | Flat, Clipless (SPD), Clipless (Look/SPD-SL), None (not included) |

### 1.4 "How to Find This" Guide

For each spec field, a ? icon opens an inline guide explaining:
- Where to find the information (headtube badge, receipt, online lookup)
- How to measure it (frame size measurement guide with diagram)
- What it means (accessible explanations for beginners)
- Why it matters (for buyers)

Visual guides are illustrated with photos of real bikes pointing to relevant parts.

### 1.5 Condition Grading Guide

Interactive grading wizard with photo examples:

| Grade | Label | Description | Visual Cue |
|-------|-------|-------------|-----------|
| A | Like New | Under 6 months old, < 200km, no scratches, original parts | Green badge |
| B | Excellent | 6-18 months, normal use, minor cosmetic marks, all original | Light green |
| C | Good | 1-4 years, well maintained, some wear, fully functional | Yellow |
| D | Fair | Worn parts, needs servicing, visible damage but rideable | Orange |
| F | Project | Needs significant work, may have missing parts | Red |

---

## 2. Search & Discovery

### 2.1 Standard Search Filters

**Quick Filters (visible on results page):**
- Bike Type (chips/pills)
- Price range (slider)
- Condition (checkboxes)
- Location radius (10km, 25km, 50km, 100km, All Spain)
- Listing type (Sale / Rent / Both)

**Advanced Filters (collapsible panel):**
- Brand (multi-select with search)
- Frame size
- Wheel size
- Frame material
- Groupset brand/level
- Year range
- E-bike: motor brand, battery Wh
- MTB: suspension type, travel
- Seller type (Private / Shop / Verified)
- With photos only
- New listings (last 24h / 7 days)

### 2.2 Sort Options

- Newest first (default)
- Price: low to high
- Price: high to low
- Nearest first (requires location)
- Best match (AI relevance score when using AI search)
- Most viewed
- Ending soon (for auction-style or time-limited listings)

### 2.3 List vs Map Toggle

Results page has two view modes:
- **List**: Cards with photo, title, price, location, condition badge
- **Map**: Mapbox map with clustered pins, sidebar with scrollable results synced to visible area

In Map mode:
- Clicking a cluster zooms in and expands
- Clicking a pin shows a mini-card popup with photo, title, price, "View Listing" button
- Map pans/zooms trigger new search for visible area
- Filter sidebar visible alongside map

### 2.4 Saved Searches & Alerts

- Users can save any search with filters
- Receive push/email notifications when new listings match saved search
- Manage saved searches in profile dashboard

---

## 3. Listing Detail Page

### 3.1 Page Structure

```
[Photos carousel - full width or split layout]
[Title] [Condition badge] [Listed X days ago]
[Price] [Make offer button] [Save/Favourite]

[Seller card with rating + verification badge]
[Message Seller] [Call] [Report]

[Spec table - all confirmed specs]
[Description - free text]
[AI-generated condition notes]

[Map - approximate location]

[Similar listings - horizontal scroll]
[Seller's other listings]

[Safety tips section]
[Report listing link]
```

### 3.2 Photo Gallery

- Up to 10 photos per listing
- Swipe on mobile, arrow navigation on desktop
- Zoom on click
- Blurhash placeholders while loading
- Watermark with BiciMarket.es on images

### 3.3 Offer System

For "Open to offers" listings:
1. Buyer submits offer price
2. Seller gets notification
3. Seller can: Accept / Counter / Decline
4. If accepted → initiate transaction flow

---

## 4. User Profiles

### 4.1 Profile Setup Flow

```
1. Register (email / Google / Apple / Facebook)
2. Verify email
3. Choose your roles:
   □ I want to Buy bikes
   □ I want to Sell bikes
   □ I want to Rent out my bike(s)
   □ I want to Rent a bike
   □ I offer Repair services
   □ I represent a Bike Shop
4. Fill profile info:
   - Display name
   - Profile photo
   - City/Location (not exact address)
   - Languages spoken
   - Short bio (optional)
5. Optional verification:
   - Phone number → SMS code
   - ID document (Stripe Identity)
```

### 4.2 Profile Dashboard Sections

Shown/hidden based on active roles:

| Section | Shown When |
|---------|-----------|
| My Listings | Seller role |
| My Rentals | Renter role |
| My Bookings | Tenant role |
| My Repair Services | Mechanic role |
| Shop Management | Shop role |
| Purchase History | All |
| Sales History | Seller role |
| Messages | All |
| Reviews | All |
| Saved Listings | All |
| Saved Searches | All |
| Wallet / Payouts | Seller / Renter / Mechanic |
| Settings | All |

### 4.3 Public Profile Page

Visible to all users:

- Avatar + display name + verification badges
- Member since date
- Response rate + avg response time
- Overall rating (stars) + number of reviews
- Breakdown: Communication, Accuracy, Timeliness
- Active listings
- Review excerpts
- "Message" button (auth required)

### 4.4 Trust & Rating System

- Ratings only from completed verified transactions
- Both parties rate each other within 14 days
- Rating categories: Communication (1-5), Accuracy of description (1-5), Timeliness (1-5)
- Overall = weighted average
- Minimum 3 reviews to show public rating
- Rating algorithm: recency-weighted (last 12 months count 2x)

---

## 5. Messaging System

### 5.1 In-App Messaging

- Real-time chat via WebSockets (Socket.io)
- Conversation threads per listing
- Image sharing in chat (photos of damage, meeting point, etc.)
- Pre-written quick replies (e.g., "Is this still available?", "Can you do [price]?")
- Read receipts
- Typing indicators

### 5.2 Notification Channels

| Event | In-App | Push | Email |
|-------|--------|------|-------|
| New message | ✓ | ✓ | If offline > 1h |
| Offer received | ✓ | ✓ | ✓ |
| Offer accepted | ✓ | ✓ | ✓ |
| Price drop on saved listing | ✓ | Optional | Optional |
| Saved search match | ✓ | Optional | Optional |
| Transaction confirmed | ✓ | ✓ | ✓ |
| Review received | ✓ | ✓ | ✓ |
| Rental booking | ✓ | ✓ | ✓ |

---

## 6. Rental Module

### 6.1 Listing a Bike for Rent

Additional fields beyond sale listing:
- Daily price (EUR/day)
- Weekly price (EUR/week, discounted)
- Monthly price (EUR/month)
- Security deposit amount
- Minimum rental duration (1 day, 3 days, 1 week)
- Maximum rental duration
- Available from / to dates
- Included accessories (helmet, lock, lights, panniers, etc.)
- Pickup / delivery options
  - Pickup only (address set in profile)
  - Delivery within X km radius (price per km)
  - Partner with hotel/hostel for dropoff

### 6.2 Booking Flow (Renter/Tenant)

```
[View rental listing]
    │
Select dates (availability calendar)
    │
Select extras (helmet +5 EUR/day, lock +2 EUR/day, etc.)
    │
Review total: X days × Y EUR/day + extras + deposit
    │
[Request to Book] OR [Instant Book] (if owner enabled)
    │
    ├── Request → Owner has 24h to accept/decline
    └── Instant → Confirmed immediately
         │
[Payment via Stripe — deposit held, rental charged on pickup]
    │
[Booking confirmation + pickup instructions]
    │
[Day of rental: QR code check-in]
    │
[Return → deposit released within 48h if no damage]
```

### 6.3 Availability Calendar

- Visual calendar showing available dates (green), booked (grey), blocked by owner (red)
- Owner can block dates manually
- Auto-blocks dates when booking is confirmed
- Syncs with Google Calendar (optional)

---

## 7. Repair Services Module

### 7.1 Mechanic Profile Setup

Additional profile fields:
- Service types offered (tune-up, flat repair, brake adjustment, full overhaul, etc.)
- Bike types serviced (road, MTB, e-bike, kids, etc.)
- Service location: workshop address / mobile (comes to you) / both
- Coverage area (for mobile mechanics — draw on map)
- Workshop hours / availability
- Price list (per service type)
- Certifications (Bosch eBike Certified, Shimano EP8, etc.)
- Parts sourcing (can order parts / customer brings parts)

### 7.2 Booking a Repair

```
[Find mechanic — search by location, specialty, rating]
    │
[View mechanic profile]
    │
Describe issue (text + optional photo)
    │
Select service type (or "Diagnostic")
    │
Choose date & time slot
    │
[Request booking]
    │
Mechanic confirms within X hours
    │
[Payment: upfront deposit or pay on completion]
    │
[Day of repair: arrive / mechanic arrives]
    │
[Mechanic marks job complete + issues digital invoice]
    │
[Customer confirms + leaves review]
    │
[Payout to mechanic within 3 days]
```

### 7.3 Service Catalog (Pre-defined)

Standardized service types with suggested price ranges:

| Service | Suggested Range (EUR) |
|---------|----------------------|
| Basic tune-up | 30–60 |
| Full overhaul | 80–150 |
| Flat tire repair | 10–20 |
| Brake adjustment | 15–30 |
| Gear adjustment | 15–30 |
| Cable replacement | 20–40 |
| Chain replacement | 20–40 |
| Wheel true (per wheel) | 20–40 |
| Bottom bracket replacement | 40–80 |
| E-bike diagnostic | 40–80 |
| E-bike motor service | 80–200 |

---

## 8. Transaction & Payment Flow

### 8.1 Direct Transaction (No Escrow)

1. Buyer and seller agree via chat
2. Exchange contact details
3. Meet in person / ship
4. No platform involvement in payment

### 8.2 Protected Transaction (Escrow)

Available for listings 500 EUR+ (optional):

```
[Buyer clicks "Buy with Protection"]
    │
Review total: Price + Platform fee (2.5%) + Buyer protection (2.5%)
    │
[Enter payment details → Stripe]
    │
Funds held in escrow
    │
Seller ships bike (tracking required) OR arranges in-person handover
    │
[Buyer confirms receipt]
    │
48-hour inspection window starts
    │
    ├── Buyer confirms all OK → Payment released to seller
    └── Buyer raises dispute → Platform mediates
         │
     Evidence review (max 72h)
         │
     Ruling: full/partial refund or release to seller
```

### 8.3 Fees Summary

| Transaction Type | Buyer Fee | Seller Fee |
|----------------|-----------|------------|
| Direct (no escrow) | Free | Free |
| Protected (escrow) | 2.5% | 2.5% |
| Rental booking | Free | 10-15% |
| Repair booking | Free | 10% |

---

## 9. Admin & Moderation

### 9.1 Moderation Queue

Auto-flagged listings (AI detects):
- Potential stolen bike (serial number match)
- Suspected fraud (price too low relative to market)
- Inappropriate photos
- Spam listing (duplicate)

Manual reports from users.

### 9.2 Admin Dashboard

- Listing moderation queue
- User reports
- Transaction disputes
- Revenue metrics
- User growth charts
- Fraud indicators
- Feature flags (enable/disable features per market)
