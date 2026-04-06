# Business Requirements & Market Analysis

## 1. Market Analysis

### 1.1 Spanish Bicycle Market

- Market size: ~1.5-2 billion EUR annually (new bikes + parts/accessories)
- ~1.3-1.5 million bicycles sold per year in Spain (AMBE data)
- Post-COVID normalization after the 2020-2021 boom
- Used bike market growing significantly, driven by Wallapop
- E-bike segment growing 20-30% YoY, reaching 10-15% of unit sales

### 1.2 Costa del Sol Specifics

**Why Costa del Sol is the perfect launch market:**

| Factor | Detail |
|--------|--------|
| Tourism volume | 12-13M visitors/year, Malaga airport 20M+ passengers/year |
| Tourist origin | UK, Germany, France, Netherlands, Scandinavia - strong cycling cultures |
| Climate | Year-round cycling, mild winters = inverse season to northern Europe |
| Cycling tourism | Peak Jan-Mar (road cycling training camps), Oct-May general |
| Expat community | Large British, Scandinavian, German communities with high bike turnover |
| Terrain | Coastal flat roads + sierra mountains = all bike types relevant |
| Infrastructure | Growing bike lane investment by Malaga and regional government |

**Seasonal demand patterns:**

| Season | Demand Type |
|--------|------------|
| Jan-Mar | Peak road cycling tourism, training camps, high rental demand |
| Mar-May | Spring buying season, local families, sport cyclists |
| Jun-Aug | Casual/evening cycling, e-bike rentals, beach town usage |
| Sep-Nov | Autumn buying, selling season (upgrades before winter tourists arrive) |
| Oct-May | General cycling tourism season |

**Key insight**: The inverse seasonality to northern Europe creates an arbitrage opportunity - bikes flow south in winter (tourists bringing/buying bikes for training) and demand for sales peaks in spring.

### 1.3 Competitive Landscape

| Competitor | Type | Strengths | Weaknesses | Our Advantage |
|-----------|------|-----------|------------|---------------|
| Wallapop | General C2C | Dominant in Spain, huge user base, local pickup | Not bike-specific, no verification, fraud risk | Bike expertise, AI tools, trust system |
| Milanuncios | General classifieds | Well-known brand | Dated UX, less mobile | Modern UX, bike-specific features |
| Facebook Marketplace | General | Large audience, free | No bike features, trust issues | Specialized, verified listings |
| BikeExchange | Bike marketplace | Bike-specific, dealers | Limited Spain traction, struggled financially | Local focus, C2C + services |
| Decathlon Second Life | Brand resale | Trusted brand, quality check | Decathlon brands only, limited selection | All brands, wider inventory |
| Local bike shops | Physical | Expert knowledge, test rides | No online presence, small inventory | Online reach + local presence |

**Gap in the market**: No platform combines bike-specific marketplace + AI assistance + rental + repair in one ecosystem, especially for the Spanish market.

### 1.4 E-bike Opportunity

- Fastest-growing segment in Spain
- Government subsidies (MOVES plans) support adoption
- Used e-bike market is immature - battery condition is the main trust barrier
- **Our opportunity**: AI-powered battery health assessment, standardized e-bike condition reports
- E-MTBs particularly popular given Spain's hilly terrain

## 2. Business Model

### 2.1 Revenue Streams

| Stream | Model | Estimated Revenue |
|--------|-------|------------------|
| **Listing fees** | Free basic listings, paid featured/promoted listings | 2-5 EUR per boost |
| **Transaction commission** | % of sale price for protected transactions | 5-8% (split buyer/seller) |
| **Rental commission** | % of rental price | 10-15% |
| **Repair booking commission** | % of repair service booking | 10-12% |
| **Premium subscriptions** | Pro seller/shop monthly plans | 15-50 EUR/month |
| **Advertising** | Bike brands, shops, tourism services | CPM/CPC |
| **Bike shop tools** | Inventory management, POS integration | 50-200 EUR/month |
| **Insurance partnerships** | Bike insurance, theft protection referrals | Referral fee |
| **Data insights** | Market data for bike industry | B2B pricing |

### 2.2 Pricing Strategy

**For sellers (C2C):**
- Free: up to 3 active listings, basic photos, standard visibility
- Boost: 2-5 EUR per listing for 7 days of promoted visibility
- Pro Seller: 15 EUR/month - unlimited listings, analytics, priority support

**For shops (B2B):**
- Starter: 50 EUR/month - up to 50 listings, basic analytics
- Business: 100 EUR/month - unlimited listings, full analytics, API access
- Enterprise: 200 EUR/month - multi-location, POS integration, white-label options

**For repair services:**
- Free listing with basic profile
- Pro Mechanic: 20 EUR/month - priority placement, booking management, reviews

**For renters:**
- Free to list rental bikes
- Commission: 10-15% per booking

### 2.3 Protected Transactions (Escrow)

For higher-value bikes (500+ EUR), offer optional protected transactions:
1. Buyer pays to BiciMarket (held in escrow via Stripe)
2. Buyer inspects bike in person or receives shipment
3. 48-hour inspection window
4. Release payment to seller after buyer confirmation
5. Commission: 5-8% split between buyer and seller

## 3. User Personas

### 3.1 Seller Personas

| Persona | Description | Needs |
|---------|-------------|-------|
| **Casual Seller** | Selling 1-2 bikes, doesn't know specs | AI photo recognition, guided listing, quick process |
| **Upgrader** | Cyclist selling old bike to fund new one | Fair pricing suggestions, quick sale, trusted buyers |
| **Expat Departing** | Leaving Spain, needs to sell fast | Time-sensitive features, shipping options, multilingual |
| **Shop Owner** | Bike shop selling used/new inventory | Bulk listing, inventory management, analytics |
| **Fleet Owner** | Rental company managing bike fleet | Fleet management, maintenance tracking, seasonal pricing |

### 3.2 Buyer Personas

| Persona | Description | Needs |
|---------|-------------|-------|
| **Cycling Tourist** | Visiting for 1-2 weeks, wants to ride | Rental or cheap used bike, map search near hotel |
| **Training Camper** | Serious cyclist, winter training | High-quality road bike rental, specific specs required |
| **New Cyclist** | Doesn't know what they need | AI recommendation, educational content, budget options |
| **Expat Settling** | Just moved, needs daily transport | City/e-bike, local pickup, seller trust verification |
| **Sport Enthusiast** | Knows exactly what they want | Advanced spec filters, condition reports, price comparison |

### 3.3 Service Provider Personas

| Persona | Description | Needs |
|---------|-------------|-------|
| **Independent Mechanic** | Freelance bike repair | Booking system, visibility, reviews, mobile repair support |
| **Bike Shop Mechanic** | Shop offering repair services | Integration with shop profile, parts ordering, scheduling |
| **Mobile Mechanic** | Comes to customer location | Map-based coverage area, route planning, mobile payments |

## 4. User Roles & Profile System

When creating a profile, users select one or more roles:

| Role | Capabilities |
|------|-------------|
| **Buyer** | Search, purchase, rent, book repairs, leave reviews |
| **Seller** | Create listings, manage inventory, receive payments |
| **Renter** | List bikes for rent, manage availability calendar |
| **Tenant** | Search and book rental bikes |
| **Mechanic** | Offer repair services, manage bookings, parts inventory |
| **Shop** | All seller + renter + mechanic capabilities, plus shop management tools |

Users can hold multiple roles simultaneously. Role-specific dashboard sections appear based on active roles.

## 5. Trust & Safety

### 5.1 User Verification Levels

| Level | Requirements | Badge |
|-------|-------------|-------|
| Basic | Email + phone verified | Grey checkmark |
| Verified | ID document uploaded + selfie verification | Blue checkmark |
| Trusted | 5+ successful transactions + 4.5+ rating | Gold checkmark |
| Pro | Business registration verified + insurance | Purple checkmark |

### 5.2 Listing Verification

- **AI-assisted verification**: Compare listing photos against specs (detect mismatches)
- **Serial number registry**: Optional serial number logging for theft protection
- **Stolen bike check**: Integration with national/European stolen bike databases where available
- **Condition grading**: Standardized A-F grading with photo evidence requirements
  - A: Like new (< 6 months, minimal use)
  - B: Excellent (well-maintained, minor cosmetic wear)
  - C: Good (normal wear, fully functional)
  - D: Fair (needs minor repairs, visible wear)
  - F: Project bike (needs significant work)

### 5.3 Review System

- Dual reviews: both buyer and seller rate each other
- Category ratings: Communication, Accuracy, Timeliness, Overall
- Reviews only from verified transactions
- 14-day review window after transaction
- Dispute resolution process for contested reviews

## 6. Go-to-Market Strategy

### Phase 1: MVP Launch (Months 1-3)
- Core marketplace with AI photo listing
- Costa del Sol focus (Malaga, Marbella, Estepona, Fuengirola)
- Partner with 5-10 local bike shops for initial inventory
- Target expat Facebook groups and cycling clubs
- Languages: English + Spanish

### Phase 2: Services Expansion (Months 4-6)
- Add rental functionality
- Add repair services directory
- Map-based search
- Partner with cycling tourism companies
- Add German language (large expat community)

### Phase 3: AI & Trust (Months 7-9)
- AI smart search (natural language)
- AI pricing suggestions based on market data
- Enhanced trust system with verification levels
- Protected transactions (escrow)
- Add French, Russian, Ukrainian languages

### Phase 4: Growth (Months 10-12)
- Expand to Barcelona, Valencia, Madrid
- Mobile app (React Native or Expo)
- Affiliate partnerships (bike brands, insurance)
- B2B tools for shops
- Data insights product

### Phase 5: Scale (Year 2+)
- Expand to Portugal, southern France, Italy
- Logistics partnerships for bike shipping
- Bike financing options
- Community features (routes, events, groups)

## 7. Key Metrics (KPIs)

| Metric | Target (Year 1) |
|--------|-----------------|
| Registered users | 10,000 |
| Active listings | 2,000+ |
| Monthly transactions | 200+ |
| Rental bookings/month | 100+ |
| Repair bookings/month | 50+ |
| Average transaction value | 400 EUR |
| Take rate (blended) | 7% |
| Monthly GMV | 80,000 EUR |
| Monthly revenue | 5,600 EUR |
| NPS | 50+ |

## 8. Legal & Compliance

### 8.1 Business Registration
- Register as SL (Sociedad Limitada) in Malaga
- Minimum capital: 3,000 EUR
- Obtain CIF (tax identification)
- Register for IVA (VAT at 21%)

### 8.2 Regulatory Compliance
- GDPR (data protection) - mandatory for EU
- LSSI (Spanish e-commerce law) - legal notice, cookies, commercial communications
- Ley de Consumidores - consumer protection, 14-day withdrawal for online purchases
- PSD2 - payment services compliance (via Stripe)
- Ley Crea y Crece - electronic invoicing requirements
- AML/KYC for escrow services above thresholds

### 8.3 Insurance
- Professional liability insurance
- Cyber insurance (data breach protection)
- Consider product liability for verified listings

## 9. Marketing Strategy

### 9.1 Channels

| Channel | Strategy | Budget Priority |
|---------|----------|----------------|
| **SEO** | Bike-specific long-tail keywords in ES/EN, local SEO for Costa del Sol | High |
| **Cycling clubs** | Partnerships with local clubs, sponsor rides | Medium |
| **Expat communities** | Facebook groups, expat forums, community events | High |
| **Tourism** | Hotel/hostel partnerships, tourist info centers | Medium |
| **Social media** | Instagram (visual), YouTube (bike reviews), TikTok | Medium |
| **Google Ads** | "Buy bike Malaga", "bike rental Costa del Sol" | High |
| **Content marketing** | Cycling routes blog, bike buying guides, maintenance tips | Medium |
| **Partnerships** | Bike shops, rental companies, cycling events | High |

### 9.2 Unique Selling Proposition

**"Snap, List, Sell - The AI-powered bike marketplace"**

Core message: Selling a bike should be as easy as taking a photo. Buying should be as easy as describing what you need. BiciMarket uses AI to bridge the knowledge gap between casual sellers and expert buyers.

## 10. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Low initial inventory | High | High | Partner with shops, seed with own listings, incentivize first sellers |
| Wallapop dominance | High | Medium | Differentiate on bike expertise, AI features, services |
| Fraud | Medium | High | Escrow system, verification, stolen bike checks |
| Seasonal revenue dips | Medium | Medium | Diversified revenue (rentals peak when sales dip), subscription model |
| AI accuracy issues | Medium | Medium | Human review option, continuous model improvement, user corrections |
| Regulatory changes | Low | Medium | Legal counsel, compliance monitoring |
| Technical scalability | Low | High | Cloud-native architecture, auto-scaling |
