# AI Features Specification

## Overview

BiciMarket uses Claude API (Anthropic) as its core AI engine for three primary features:
1. **Photo Recognition** — analyze bike photos and extract structured specifications
2. **Smart Search** — natural language query to structured search with ranking
3. **Price Estimation** — market-based pricing suggestions

All AI features are non-blocking: they enhance the experience but the platform works without them. Users can always override AI suggestions.

---

## 1. AI Photo Recognition

### 1.1 Goal

A seller takes 1–5 photos of their bike. The AI analyzes the images and returns a structured JSON object with all identifiable specifications pre-filled. The user then reviews, corrects if needed, and publishes.

### 1.2 What the AI Extracts

From visual inspection of photos, Claude Vision can identify:

| Field | Confidence | Notes |
|-------|-----------|-------|
| Bike type (road/MTB/city/etc.) | High | Frame geometry is a strong visual signal |
| Brand | High | Logo on frame, components, fork |
| Frame material (rough) | Medium | Carbon weave visible, aluminum welds |
| Wheel size | High | Can estimate from proportions + tire markings if visible |
| Groupset brand | High | Shimano/SRAM/Campagnolo logos and designs |
| Groupset level | Medium | Distinguishable for higher-end groupsets |
| Number of gears | Medium | Count chainrings + cassette visible |
| Suspension type | High | Clearly visible on MTBs |
| Fork brand | Medium | Logo and design |
| Brake type | High | Disc vs rim very obvious, hydraulic vs mechanical less so |
| Handlebar type | High | Drop, flat, riser, bullhorn clearly distinct |
| Saddle brand | Medium | Logo may be visible |
| Approximate condition | Medium | Visible scratches, rust, wear |
| E-bike motor | High | Very distinctive visual appearance |
| E-bike brand | Medium | Logo on motor/battery |

### 1.3 API Integration Flow

```
User uploads photos → S3 presigned URL (direct upload)
      │
Photos uploaded to S3
      │
BullMQ job: AI_ANALYZE_PHOTOS queued
      │
Job runs:
  1. Load photos from S3 (up to 5 images)
  2. Send to Claude API with structured prompt
  3. Parse JSON response
  4. Validate against bike spec schema
  5. Store result in Redis (TTL 1h) keyed by upload session ID
      │
Frontend polls /api/v1/ai/analysis/{sessionId} (or WebSocket push)
      │
Result returned to form → fields pre-filled
```

### 1.4 Prompt Engineering

The prompt is constructed dynamically and includes:

```
System prompt:
You are a bicycle expert assistant. Analyze the provided bike photos and extract structured specifications.
Return ONLY a valid JSON object matching the schema below. If a field cannot be determined from the photos, set it to null.
Be conservative: only set values you can clearly identify. Do not guess.

[JSON Schema of BikeSpecs type]

User message:
Please analyze these [N] photos of a bicycle for sale and extract all identifiable specifications.
The seller is listing this bike on BiciMarket, a bicycle marketplace in Spain.
```

### 1.5 Response Handling

```typescript
interface AIBikeAnalysisResult {
  bikeType: BikeType | null;
  brand: string | null;
  model: string | null;
  frameMaterial: FrameMaterial | null;
  wheelSize: WheelSize | null;
  groupsetBrand: GroupsetBrand | null;
  groupsetLevel: GroupsetLevel | null;
  numberOfGears: number | null;
  suspensionType: SuspensionType | null;
  brakeType: BrakeType | null;
  handlebarType: HandlebarType | null;
  condition: ConditionGrade | null;
  isEbike: boolean;
  ebike?: {
    motorBrand: EbikeMotorBrand | null;
    motorType: 'mid-drive' | 'hub' | null;
  };
  confidence: {
    overall: number; // 0-1
    perField: Record<string, number>; // 0-1 per field
  };
  aiNotes: string; // Human-readable notes about what was identified and any uncertainty
}
```

### 1.6 UI/UX for AI Results

- After upload, animated "Analyzing your bike..." state (3D bicycle spinning)
- Fields animate in as they're populated (staggered fade-in)
- Low-confidence fields highlighted in amber with "AI is unsure — please verify"
- High-confidence fields shown in green "AI identified"
- User can click any field to edit
- "AI Notes" section shows a plain-English summary of what was detected
- Option to "Re-analyze" if user uploads additional photos

### 1.7 Condition Assessment from Photos

Beyond specs, AI provides a visual condition assessment:

```typescript
interface AIConditionAssessment {
  suggestedGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  observations: string[]; // ["Paint in excellent condition", "Rear derailleur shows wear", ...]
  concerns: string[]; // ["Possible crack near dropout — please inspect closely"]
  confidence: number;
}
```

This is shown as an advisory to the seller (not mandatory to use).

---

## 2. AI Smart Search

### 2.1 Goal

User types a natural language description of what they need (e.g. "lightweight road bike for beginners, around 500 euros, near Málaga") and the AI translates this into structured search parameters, then ranks results by relevance.

### 2.2 User Flow

```
[Search bar with "Describe what you're looking for..."]
    │
User types: "I need a good e-bike for daily commuting in Fuengirola, 
             budget around 800-1200 EUR, prefer Bosch motor"
    │
POST /api/v1/ai/smart-search { query: "..." }
    │
Claude API: parse intent → structured filters + ranking criteria
    │
Execute search on Meilisearch with extracted filters
    │
Claude API: rank/score results by relevance to original query
    │
Return results with relevance explanations
```

### 2.3 Query Parsing Prompt

```
System:
You are a bicycle search assistant for BiciMarket, a marketplace in Spain.
Parse the user's natural language search query and extract structured search parameters.
Return ONLY a valid JSON object.

Available bike types: [Road, Mountain, City/Urban, Gravel, E-Bike, BMX, Kids, Folding, Cargo, Hybrid, Cyclocross]
Available brands: [full list]
Condition grades: A (Like new), B (Excellent), C (Good), D (Fair), F (Project bike)
Listing types: sale, rental

User query: "{userQuery}"

Extract:
- bikeTypes: string[] (relevant types based on described use)
- brands: string[] (if mentioned)
- priceMin: number | null (EUR)
- priceMax: number | null (EUR)
- location: string | null (city/area name)
- radiusKm: number (default 50)
- condition: string[] (minimum acceptable conditions)
- listingType: 'sale' | 'rental' | null
- keywords: string[] (for full-text search)
- rankingCriteria: string (what matters most to this user, for result ranking)
- searchIntent: string (brief description of what the user is looking for)
```

### 2.4 Result Ranking

After Meilisearch returns candidates, Claude scores each result against the original query:

```
For each result, provide a relevance score (0-10) and a one-sentence explanation of why this bike
matches or doesn't match what the user described.

User was looking for: {searchIntent}
User's ranking criteria: {rankingCriteria}

[List of top 20 candidates with specs]
```

### 2.5 UI Display

- Results show a "Match" badge (Excellent / Good / Fair) based on AI score
- Each result card shows a 1-line AI explanation: "Perfect match: E-bike with Bosch motor, priced within your budget"
- Filter panel shows the extracted filters so users can see/adjust what AI parsed
- "AI Search" indicator in search bar distinguishes from standard search
- Fallback: if AI query parsing fails, fall back to keyword search

### 2.6 Rental & Repair AI Search

Same system applies to:
- Rental search: "I need a road bike for training in January, 2 weeks, my height is 180cm"
- Repair search: "My e-bike Bosch motor is making grinding noise, near Marbella"

---

## 3. AI Price Estimation

### 3.1 Goal

When a seller creates a listing, suggest a fair market price based on the bike specs and current market data.

### 3.2 How It Works

```
Seller has filled specs (manually or via AI photo)
    │
POST /api/v1/ai/price-estimate { specs: BikeSpecs }
    │
Backend: Query similar sold listings from DB (same type, brand, condition, year range)
    │
Claude API:
  - Input: bike specs + similar listings with prices
  - Output: suggested price range + reasoning
    │
Show to seller: "Based on similar listings, we suggest 450–550 EUR"
```

### 3.3 Prompt Structure

```
You are a bicycle market pricing expert for Spain (specifically Andalusia / Costa del Sol).

The seller has a bike with these specifications:
{bikeSpecs}

Here are {N} similar bikes currently listed or recently sold on BiciMarket:
{similarListings}

Current market context:
- Season: {season} (note: Jan-Mar is peak cycling tourism season in Costa del Sol)
- Market trend: {trend}

Suggest a realistic asking price range in EUR. Consider:
1. Bike condition and age
2. Brand premium/discount
3. Current comparable listings
4. Seasonal demand
5. E-bike battery degradation if applicable

Return JSON: { priceMin: number, priceMax: number, suggestedPrice: number, reasoning: string, tips: string[] }
```

### 3.4 Price Display

- Shown as "Suggested: 450–550 EUR" above the price field
- "How did we calculate this?" expandable section shows reasoning
- Tips like "E-bikes sell faster if you include battery health report" or "Considered lowering price 10%—similar bikes have been listed 30+ days"

---

## 4. AI Condition Assessment (Repair Context)

When a user submits a repair request with photos, AI helps the mechanic:

- Pre-diagnose the issue based on photos
- Suggest relevant service types
- Estimate likely repair cost range

```
System prompt:
You are an expert bicycle mechanic. A customer has submitted photos and a description of their bike issue.
Analyze the photos and description to help the mechanic prepare for the job.

Issue description: {userDescription}
Bike type: {bikeType}

Provide:
1. Likely diagnosis (based on photos and description)
2. Recommended service types from our catalog
3. Estimated parts that may be needed
4. Estimated time and cost range
5. Any safety concerns that should be addressed immediately

Return JSON with these fields.
```

---

## 5. AI Recommendations (Future Feature)

### 5.1 Personalized Feed

Based on user behavior (views, saves, purchases), AI generates a personalized home feed:

- "Based on bikes you've viewed, you might like these"
- "New listings matching your saved searches"
- "Hot deals: similar to your saved bikes but 20% cheaper"

### 5.2 Complementary Product Suggestions

When viewing a listing:
- "This bike is often bought with: helmet, lights, lock, panniers"
- Cross-sells to accessories listed by other sellers or affiliate partners

### 5.3 Seasonal Recommendations

- January: "Training camp season — check out road bike rentals near Ronda"
- Summer: "E-bike rentals perfect for beach towns"
- Autumn: "Best time to buy — end-of-season deals"

---

## 6. AI Infrastructure

### 6.1 Rate Limiting & Cost Control

| Feature | Model | Calls/Day Limit | Estimated Cost |
|---------|-------|----------------|----------------|
| Photo analysis | claude-opus-4-6 (vision) | 500/day | ~0.05 USD/analysis |
| Smart search | claude-sonnet-4-6 | 2000/day | ~0.01 USD/query |
| Price estimation | claude-haiku-4-5 | 5000/day | ~0.002 USD/estimate |
| Condition reports | claude-sonnet-4-6 | 200/day | ~0.03 USD/report |

### 6.2 Caching Strategy

- Photo analysis results cached in Redis by photo hash (SHA-256) — TTL 24h
- Price estimates cached by spec hash — TTL 1h (market prices change)
- Smart search results NOT cached (queries are unique)

### 6.3 Fallback Behavior

If Claude API is unavailable:
- Photo analysis: show all fields empty with "AI unavailable — please fill manually"
- Smart search: fall back to keyword extraction via regex + standard Meilisearch query
- Price estimation: show median price from DB for similar bikes without AI explanation

### 6.4 Quality Monitoring

Track and log:
- AI accuracy: when seller edits AI-pre-filled fields, log what changed
- Smart search satisfaction: CTR on results, did user refine query?
- Price estimation accuracy: compare suggested price vs final listed price
- Model: use A/B testing to compare different prompt versions

### 6.5 AI Usage Package `packages/ai-helpers/`

Shared package in the monorepo:

```
packages/ai-helpers/
├── src/
│   ├── prompts/
│   │   ├── photo-analysis.ts       # Photo analysis prompt builder
│   │   ├── smart-search.ts         # Search query parser prompt
│   │   ├── price-estimation.ts     # Price suggestion prompt
│   │   └── condition-report.ts     # Repair diagnosis prompt
│   ├── parsers/
│   │   ├── bike-specs.parser.ts    # Validate & type AI JSON output
│   │   ├── search-query.parser.ts  # Parse search intent
│   │   └── price.parser.ts
│   ├── client.ts                   # Anthropic SDK singleton
│   └── index.ts
```

### 6.6 Model Selection Guide

| Use Case | Model | Reason |
|----------|-------|--------|
| Photo analysis (vision) | claude-opus-4-6 | Best vision accuracy |
| Smart search query parsing | claude-sonnet-4-6 | Balanced speed + quality |
| Price estimation | claude-haiku-4-5 | Fast, cheap, sufficient |
| Repair diagnosis (with photos) | claude-opus-4-6 | Needs vision + technical reasoning |
| Personalized recommendations | claude-haiku-4-5 | High volume, simple task |
