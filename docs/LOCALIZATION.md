# Localization Strategy (i18n)

## Overview

BiciMarket supports 6 languages from launch (Phase 1: EN + ES, Phase 2-3: DE, FR, RU, UK).

**Primary language**: English (en) — default fallback  
**Market language**: Spanish (es) — local market, SEO priority  
**Community languages**: German (de), French (fr), Russian (ru), Ukrainian (uk)

---

## 1. Technical Implementation

### 1.1 Library

**next-intl** — the standard for Next.js App Router i18n.

- SSR-compatible (messages available on server during render — critical for SEO)
- ICU message format (supports plurals, variables, date/number formatting)
- Type-safe with auto-generated types from message keys
- Zero client bundle overhead for server components

### 1.2 URL Structure

Language prefix routing:

```
/en/           → English (default, also /en/ prefix shown)
/es/           → Spanish
/de/           → German
/fr/           → French
/ru/           → Russian
/uk/           → Ukrainian
```

Redirect logic in `middleware.ts`:
1. Check `Accept-Language` header
2. Check `NEXT_LOCALE` cookie (user's manual choice — persists)
3. Default to `en` if no match

### 1.3 Directory Structure

```
apps/web/
└── messages/
    ├── en.json
    ├── es.json
    ├── de.json
    ├── fr.json
    ├── ru.json
    └── uk.json
```

### 1.4 Message File Structure

```json
// messages/en.json
{
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong",
    "retry": "Try again",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "back": "Back",
    "next": "Next",
    "confirm": "Confirm",
    "seeAll": "See all"
  },
  "nav": {
    "buy": "Buy",
    "rent": "Rent",
    "repair": "Repair",
    "sell": "Sell a Bike",
    "signIn": "Sign In",
    "signUp": "Join BiciMarket",
    "myListings": "My Listings",
    "messages": "Messages",
    "profile": "Profile",
    "settings": "Settings",
    "signOut": "Sign Out"
  },
  "home": {
    "hero": {
      "title": "Buy, Sell & Rent Bicycles",
      "subtitle": "The AI-powered bike marketplace for Costa del Sol and beyond",
      "searchPlaceholder": "Search bikes...",
      "aiSearchPlaceholder": "Describe the bike you're looking for...",
      "aiSearchBadge": "AI Search",
      "ctaSell": "Sell Your Bike",
      "ctaBrowse": "Browse Listings"
    },
    "categories": {
      "title": "Find Your Ride",
      "road": "Road",
      "mtb": "Mountain",
      "city": "City",
      "ebike": "E-Bike",
      "gravel": "Gravel",
      "kids": "Kids",
      "cargo": "Cargo"
    },
    "stats": {
      "listings": "{count} bikes for sale",
      "users": "{count} cyclists",
      "cities": "Available in {count} cities"
    }
  },
  "listing": {
    "create": {
      "title": "List Your Bike",
      "stepPhotos": "Add Photos",
      "stepSpecs": "Bike Details",
      "stepPrice": "Set Your Price",
      "stepLocation": "Location",
      "stepReview": "Review & Publish",
      "aiAnalyzing": "Analyzing your bike...",
      "aiSuccess": "AI identified {count} specs",
      "aiLowConfidence": "AI is unsure about this — please verify",
      "uploadPhotos": "Upload Photos",
      "uploadHint": "Add up to 10 photos. First photo will be the cover.",
      "orFillManually": "Or fill in details manually"
    },
    "specs": {
      "bikeType": "Bike Type",
      "brand": "Brand",
      "model": "Model",
      "year": "Year",
      "condition": "Condition",
      "frameMaterial": "Frame Material",
      "frameSize": "Frame Size",
      "wheelSize": "Wheel Size",
      "numGears": "Number of Gears",
      "groupsetBrand": "Groupset Brand",
      "brakeType": "Brake Type",
      "color": "Color",
      "serialNumber": "Serial Number",
      "notSure": "Not sure"
    },
    "condition": {
      "A": "Like New",
      "B": "Excellent",
      "C": "Good",
      "D": "Fair",
      "F": "Project Bike",
      "guide": "Condition Guide"
    },
    "detail": {
      "contactSeller": "Contact Seller",
      "makeOffer": "Make an Offer",
      "buyWithProtection": "Buy with Protection",
      "saveListing": "Save",
      "saved": "Saved",
      "shareLink": "Share",
      "reportListing": "Report",
      "postedAgo": "Posted {time} ago",
      "views": "{count} views",
      "similarListings": "Similar Bikes",
      "sellerListings": "More from this seller",
      "locationApproximate": "Approximate location — exact address shared after contact"
    }
  },
  "search": {
    "title": "Search Results",
    "noResults": "No bikes found",
    "noResultsHint": "Try adjusting your filters or broadening your search",
    "filterTitle": "Filters",
    "sortBy": "Sort by",
    "sort": {
      "newest": "Newest first",
      "priceAsc": "Price: Low to High",
      "priceDesc": "Price: High to Low",
      "nearest": "Nearest first",
      "relevance": "Best match"
    },
    "viewList": "List",
    "viewMap": "Map",
    "savedSearch": "Save Search",
    "searchSaved": "Search saved! We'll notify you of new matches."
  },
  "rental": {
    "title": "Rent a Bike",
    "perDay": "/day",
    "perWeek": "/week",
    "perMonth": "/month",
    "deposit": "Deposit",
    "book": "Book Now",
    "checkAvailability": "Check Availability",
    "selectDates": "Select Dates",
    "available": "Available",
    "unavailable": "Unavailable",
    "instantBook": "Instant Book",
    "requestToBook": "Request to Book",
    "included": "Included",
    "extras": "Optional Extras"
  },
  "repair": {
    "title": "Find a Mechanic",
    "workshop": "Workshop",
    "mobile": "Mobile Mechanic",
    "bookRepair": "Book Repair",
    "services": "Services",
    "certifications": "Certifications",
    "typicalResponse": "Typically responds in {hours}h",
    "serviceTypes": {
      "tune_up": "Basic Tune-Up",
      "full_overhaul": "Full Overhaul",
      "flat_repair": "Flat Tire Repair",
      "brake_adjustment": "Brake Adjustment",
      "gear_adjustment": "Gear Adjustment",
      "chain_replacement": "Chain Replacement",
      "wheel_true": "Wheel Truing",
      "ebike_diagnostic": "E-Bike Diagnostic",
      "ebike_motor": "E-Bike Motor Service"
    }
  },
  "profile": {
    "member": "Member since {date}",
    "verificationLevel": {
      "0": "Basic",
      "1": "Verified",
      "2": "Trusted",
      "3": "Pro"
    },
    "rating": "{rating} ({count} reviews)",
    "responseRate": "{rate}% response rate",
    "reviews": "Reviews",
    "listings": "Listings",
    "editProfile": "Edit Profile",
    "roles": {
      "buyer": "Buyer",
      "seller": "Seller",
      "renter": "Bike Owner",
      "tenant": "Renter",
      "mechanic": "Mechanic",
      "shop": "Bike Shop"
    }
  },
  "messages": {
    "title": "Messages",
    "typeMessage": "Type a message...",
    "send": "Send",
    "noConversations": "No messages yet",
    "noConversationsHint": "Start a conversation by contacting a seller",
    "quickReplies": {
      "isAvailable": "Is this still available?",
      "canYouDo": "Can you do {price}?",
      "whereToMeet": "Where can we meet?",
      "stillInterested": "I'm still interested"
    }
  },
  "auth": {
    "signIn": "Sign In",
    "signUp": "Create Account",
    "email": "Email",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "displayName": "Your Name",
    "forgotPassword": "Forgot Password?",
    "resetPassword": "Reset Password",
    "orContinueWith": "Or continue with",
    "alreadyHaveAccount": "Already have an account? {link}",
    "dontHaveAccount": "Don't have an account? {link}",
    "termsAgreement": "By signing up, you agree to our {terms} and {privacy}",
    "verifyEmail": "Please verify your email address",
    "verifyEmailHint": "We sent a verification link to {email}"
  },
  "errors": {
    "required": "This field is required",
    "invalidEmail": "Please enter a valid email address",
    "passwordTooShort": "Password must be at least 8 characters",
    "passwordMismatch": "Passwords do not match",
    "generic": "Something went wrong. Please try again.",
    "networkError": "Connection error. Please check your internet.",
    "unauthorized": "Please sign in to continue"
  }
}
```

### 1.5 Locale-Specific Number & Date Formatting

Using next-intl's formatting utilities:

```typescript
// Price formatting
const t = useTranslations()
const { formatNumber } = useFormatter()

// EUR formatting per locale
formatNumber(price / 100, { style: 'currency', currency: 'EUR' })
// en: €1,400.00
// es: 1.400,00 €
// de: 1.400,00 €
// fr: 1 400,00 €
// ru: 1 400,00 €

// Date formatting
formatDateTime(date, { dateStyle: 'long' })
// en: March 1, 2024
// es: 1 de marzo de 2024
// de: 1. März 2024
// ru: 1 марта 2024 г.

// Relative time
formatRelativeTime(date)
// "3 hours ago" / "hace 3 horas" / "vor 3 Stunden"
```

---

## 2. Language Details

### English (en) — Default

- Base language, all keys defined here
- Neutral international English (avoid idioms)
- Date format: Month Day, Year
- Number: 1,400.00

### Spanish (es) — SEO Priority

- Formal "usted" avoided — use informal "tú" for the young, active user base
- Bicycle terms: "bicicleta" (full), "bici" (casual)
- E-bike: "bicicleta eléctrica" or "ebike"
- MTB: "mountain bike" (commonly used in ES without translation)
- Date format: DD de MMMM de YYYY
- Consider regional variations (Latin America vs Spain) — use ES-ES

### German (de) — Expat Community

- Formal "Sie" vs informal "du" — use informal "du" (marketplace tone)
- Compound nouns: "Fahrradmarktplatz", "Gebrauchtfahrrad"
- German-speaking expats on Costa del Sol
- Date format: DD.MM.YYYY

### French (fr) — Tourism

- Informal "tu" for marketplace feel
- "Vélo" (common), "bicyclette" (formal)
- Large French cycling tourism presence on Costa del Sol
- Date format: DD/MM/YYYY

### Russian (ru) — Expat Community

- Large Russian-speaking community in Malaga/Marbella area
- Cyrillic script — ensure fonts support Cyrillic well (Geist does)
- "Велосипед" (velosiped)
- Date format: DD.MM.YYYY

### Ukrainian (uk) — Community

- Similar to Russian but distinct language — never mix them
- Cyrillic script
- "Велосипед" (velosyped)
- Date format: DD.MM.YYYY

---

## 3. Translation Workflow

### 3.1 Source of Truth

`messages/en.json` is the source of truth. All other languages are translations of English.

### 3.2 Translation Management

**Recommended**: [Lingo.dev](https://lingo.dev) or [Crowdin](https://crowdin.com)

Integration:
1. Push `en.json` to translation platform
2. Professional translators translate to target languages
3. Pull translated files via CLI
4. Commit to repo as `messages/{locale}.json`

### 3.3 Missing Translations

next-intl fallback strategy: if a key is missing in `es.json`, fall back to `en.json` value. This ensures no broken UI during incremental translation.

### 3.4 Translation Key Conventions

```
{section}.{subsection}.{key}
Examples:
  listing.create.stepPhotos
  nav.sell
  errors.required
  bikeTypes.road
```

Keys are camelCase. Never use translated strings as keys.

### 3.5 Dynamic Content

User-generated content (listing titles, descriptions, messages) is NOT translated by the platform. Users write in their language. In future, optional machine translation could be added as a feature (translate listing description button).

---

## 4. SEO Localization

### 4.1 Hreflang Tags

Every page includes `<link rel="alternate">` hreflang tags:

```html
<link rel="alternate" hreflang="en" href="https://bicimarket.es/en/listings" />
<link rel="alternate" hreflang="es" href="https://bicimarket.es/es/listings" />
<link rel="alternate" hreflang="de" href="https://bicimarket.es/de/listings" />
<link rel="alternate" hreflang="fr" href="https://bicimarket.es/fr/listings" />
<link rel="alternate" hreflang="ru" href="https://bicimarket.es/ru/listings" />
<link rel="alternate" hreflang="uk" href="https://bicimarket.es/uk/listings" />
<link rel="alternate" hreflang="x-default" href="https://bicimarket.es/en/listings" />
```

### 4.2 Localized Metadata

Each page generates locale-specific `<title>` and `<meta description>`:

```typescript
// app/[locale]/listings/page.tsx
export async function generateMetadata({ params }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'seo' })
  return {
    title: t('listings.title'),          // "Buy Used Bikes in Spain | BiciMarket"
    description: t('listings.description'), // "Find quality used bicycles..."
    alternates: { languages: { ... } }
  }
}
```

### 4.3 Localized URLs

All routes use the locale prefix but content paths stay in English:
- `/es/listings` ✓ (locale prefix, English path)
- `/es/anuncios` ✗ (translated paths — too complex, SEO gain minimal)

Exception: Consider translating high-value landing pages for ES market:
- `/es/vender-bicicleta` → redirects to `/es/listings/create`
- `/es/alquiler-bicicletas-malaga` → landing page with Málaga rentals

### 4.4 Blog / Content SEO

Cycling guides, maintenance tips, and route articles should be:
- Written in both English and Spanish (highest priority)
- SEO-optimized for local Costa del Sol keywords
- Examples:
  - "Best cycling routes Costa del Sol" / "Rutas de ciclismo Costa del Sol"
  - "How to buy a second-hand bike in Spain"
  - "E-bike rental Malaga"

---

## 5. Language Switcher UI

### 5.1 Desktop

Dropdown in the top navigation bar:
```
🌐 EN ▾
   ES — Español
   DE — Deutsch
   FR — Français
   RU — Русский
   UK — Українська
```

Flags are shown as emoji or SVG flags (not CSS flags for accessibility).

### 5.2 Mobile

Language option in the hamburger menu / settings screen.

### 5.3 Auto-detection

On first visit:
1. Detect `Accept-Language` from browser headers
2. If detected language is in our supported list → show in that language
3. Show a banner: "We detected you speak German. Switch to Deutsch?" with Accept/Dismiss
4. User choice saved in `NEXT_LOCALE` cookie (30 days)

---

## 6. RTL Support

Not required for current 6 languages (all LTR). Architecture should be RTL-ready for future Arabic support (tourist demographic in southern Spain):
- Use logical CSS properties (`margin-inline-start` vs `margin-left`)
- Tailwind 3+ has RTL variant support built in
- Add `dir={dir}` to root `<html>` element via next-intl

---

## 7. Font Coverage

**Geist** covers Latin (EN, ES, DE, FR) and Cyrillic (RU, UK) scripts.

Verify Cyrillic coverage in Geist before launch. Fallback: use **Inter** which has excellent Cyrillic support.

```typescript
// apps/web/app/[locale]/layout.tsx
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  variable: '--font-geist'
})
```
