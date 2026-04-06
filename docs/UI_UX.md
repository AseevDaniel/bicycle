# UI/UX Design System & Visual Identity

## 1. Design Philosophy

BiciMarket's visual identity is built on three principles:

1. **Motion as meaning** — animations communicate status, not just delight. A loading spinner is a 3D spinning wheel. A successful upload is a bike taking off. Motion is purposeful.
2. **Sport meets marketplace** — the feel of a premium cycling brand (think Wahoo, Specialized, Canyon) combined with the accessibility of a modern marketplace (Airbnb, Depop).
3. **3D depth in a flat world** — Three.js 3D elements add dimensionality without sacrificing clarity. 3D is used on hero sections and key interactions, not everywhere.

---

## 2. Color System

### 2.1 Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#FF4D00` | Orange — CTAs, active states, highlights |
| `--color-primary-dark` | `#CC3D00` | Hover states for primary |
| `--color-primary-light` | `#FF7A40` | Tints, gradients |
| `--color-secondary` | `#1A1A2E` | Dark navy — primary text, dark backgrounds |
| `--color-secondary-mid` | `#16213E` | Dark blue-navy — card backgrounds dark mode |
| `--color-accent` | `#00D4AA` | Teal/mint — success, AI features indicator |
| `--color-accent-yellow` | `#FFD60A` | Yellow — trust badges, ratings stars |

### 2.2 Neutral Scale

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-neutral-50` | `#FAFAFA` | Page backgrounds (light mode) |
| `--color-neutral-100` | `#F4F4F5` | Card backgrounds |
| `--color-neutral-200` | `#E4E4E7` | Borders, dividers |
| `--color-neutral-400` | `#A1A1AA` | Placeholder text |
| `--color-neutral-600` | `#52525B` | Secondary text |
| `--color-neutral-900` | `#18181B` | Primary text |

### 2.3 Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#22C55E` | Condition A badge, confirmed states |
| `--color-warning` | `#F59E0B` | Condition C/D, AI low-confidence |
| `--color-error` | `#EF4444` | Errors, Condition F, disputes |
| `--color-info` | `#3B82F6` | Info messages, verified badge |

### 2.4 Dark Mode

All tokens have dark mode variants. The platform ships with system-preference detection and a manual toggle.

Dark mode strategy:
- `--color-neutral-50` → `#09090B` (almost black)
- `--color-neutral-100` → `#18181B`
- Primary orange and teal remain the same (pop on dark backgrounds)
- 3D scenes use HDR environment maps optimized for dark backgrounds

---

## 3. Typography

### 3.1 Font Stack

| Font | Weight | Usage |
|------|--------|-------|
| **Geist** (Vercel) | 400, 500, 600, 700 | Primary UI font — clean, modern, technical |
| **Cal Sans** | 600 | Display headings, hero text |
| **JetBrains Mono** | 400 | Prices, specs data, serial numbers |

All fonts loaded via `next/font` (zero layout shift, self-hosted).

### 3.2 Type Scale

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | 12px | 16px | Meta, tags, timestamps |
| `text-sm` | 14px | 20px | Secondary text, labels |
| `text-base` | 16px | 24px | Body text |
| `text-lg` | 18px | 28px | Lead paragraphs |
| `text-xl` | 20px | 28px | Section headings |
| `text-2xl` | 24px | 32px | Page headings |
| `text-3xl` | 30px | 36px | Hero subheadings |
| `text-4xl` | 36px | 40px | Display text |
| `text-5xl` | 48px | 52px | Hero headlines |
| `text-7xl` | 72px | 80px | Landing page max impact |

---

## 4. Component Library

Built with **shadcn/ui** as the base (Radix UI primitives + Tailwind), customized to BiciMarket's design system.

### 4.1 Core Components

#### Button

```
Variants: primary, secondary, outline, ghost, destructive
Sizes: sm, md, lg, icon
States: default, hover, active, disabled, loading

Primary: orange bg, white text, subtle scale on hover (transform: scale(1.02))
Loading: replaced with animated spinner (custom SVG bicycle wheel)
```

#### Card

```
ListingCard:
  - Aspect ratio 4:3 photo area with blurhash placeholder
  - Condition badge (colored pill) top-right on photo
  - Price (JetBrains Mono, bold)
  - Title (clamp to 2 lines)
  - Location + distance
  - Seller avatar + rating mini
  - Hover: lift shadow (box-shadow transition) + photo zoom (transform: scale(1.05))
  - Favorite heart button (animated fill on click)

MechanicCard:
  - Avatar (large)
  - Verification badge
  - Service types (colored chips)
  - Rating + review count
  - Response time
  - Distance
```

#### Search Bar

```
Standard: Icon + placeholder + filter button
AI mode: Gradient border animation (orange → teal cycling),
         "AI" badge, expanded textarea on focus,
         Character count, submit on Enter or button click
```

#### Spec Table

```
Grid layout with icon per spec category
Unknown fields shown as "—" in muted color
AI-detected fields with subtle AI sparkle icon
Editable inline version for listing creation form
```

---

## 5. 3D Visual System

### 5.1 Technology

- **Three.js** + **React Three Fiber (R3F)** + **@react-three/drei**
- **@react-three/postprocessing** for visual effects
- **GSAP ScrollTrigger** for scroll-driven 3D animations
- 3D models: GLTF/GLB format, optimized with `gltf-pipeline` + `draco` compression

### 5.2 Landing Page — Hero Scene

The hero is a 3D interactive cycling scene:

```
Scene setup:
- Camera: slightly elevated, perspective, mild depth of field
- Environment: HDRI sky (coastal/sunny day)
- Ground: stylized with subtle grid lines suggesting a road

Center piece:
- High-quality 3D road bicycle model (GLB, ~500KB compressed)
- Slowly rotating on Y axis (autorotation, pauses on hover)
- Custom shader: chrome frame reflects environment
- Wheels: animated spinning (continuous)
- Post-processing: subtle bloom on highlights, chromatic aberration on edges

Text overlay (HTML, positioned in 3D space via R3F):
- "BiciMarket" in Cal Sans 72px (white, drop shadow)
- Tagline fades in with delay
- CTA buttons below

On scroll (GSAP ScrollTrigger):
- Camera pulls back, bike shrinks
- City background elements (blurred) rise up
- Marketplace grid fades in below the 3D scene
- Transition from hero 3D to standard page content
```

### 5.3 Category Selection — 3D Bike Models

On the homepage below hero, each bike type is represented by a 3D model that reacts on hover:

```
Bike type cards (horizontal scroll on mobile, grid on desktop):
[Road] [MTB] [City] [E-Bike] [Gravel] [Kids] [Cargo]

Each card:
- Mini 3D canvas (200×150px) with bike silhouette
- On hover: bike tilts toward viewer (rotation X: -10deg → 0deg)
          + color accent highlight underneath (point light)
          + card rises (translateY: -4px)
- Click: navigates to filtered listings

Models are lazy loaded (only load when card enters viewport)
LOD: low-poly versions for category cards, high-poly for detail views
```

### 5.4 AI Analysis Loading State

When photos are being analyzed:

```
3D scene: bicycle parts assembling themselves in space
  - Frame appears first
  - Wheels roll in from sides and attach
  - Components appear (derailleur, handlebars, saddle)
  - Final assembled bike spins once
  - Subtle particle effect (specs text floating around bike)

Duration: 8-15 seconds (matches API response time)
Text: "Analyzing your bike..." → "Identifying components..." → "Almost there..."
```

### 5.5 Empty States

Each empty state has a unique 3D micro-animation:

```
No search results:
  A 3D magnifying glass scanning empty space, question mark floats up

No listings yet:
  A bike with a "For Sale" tag slowly spinning

No messages:
  Two chat bubbles floating toward each other, never quite meeting
```

### 5.6 Success States

```
Listing published:
  A bike launches upward like a rocket, confetti particles

Booking confirmed:
  Calendar page flips, checkmark draws itself, fireworks

Review submitted:
  Stars fill one by one with satisfying pop animation
```

---

## 6. Animation System

### 6.1 Principles

- Duration: micro (50-100ms), standard (200-300ms), deliberate (400-600ms), showcase (800ms+)
- Easing: `ease-out` for entering elements, `ease-in` for leaving, `spring` for interactive feedback
- No animation > 1s unless it's a showcase (hero, loading, success state)
- Respect `prefers-reduced-motion`: all animations gracefully disabled

### 6.2 Framer Motion — Page & Component Transitions

```typescript
// Page transition — shared layout between routes
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
}

// Staggered list (search results, listing cards)
const containerVariants = {
  animate: { transition: { staggerChildren: 0.05 } }
}
const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 }
}

// Spec field fill animation (AI pre-fill)
const fieldFillVariant = {
  initial: { backgroundColor: 'transparent' },
  animate: { backgroundColor: ['#FF4D0020', 'transparent'], transition: { duration: 0.8 } }
}
```

### 6.3 GSAP ScrollTrigger — Scroll-Driven Animations

```javascript
// Hero bike parallax
gsap.to('.hero-bike', {
  y: -100,
  rotation: 15,
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1
  }
})

// Category section — bikes slide in from alternating sides
gsap.from('.bike-category:nth-child(odd)', {
  x: -80, opacity: 0,
  scrollTrigger: { trigger: '.categories', start: 'top 80%', toggleActions: 'play none none reverse' }
})

// Stats counter animation
gsap.from('.stat-number', {
  textContent: 0,
  duration: 2,
  snap: { textContent: 1 },
  scrollTrigger: { trigger: '.stats', start: 'top 70%' }
})
```

### 6.4 Micro-interactions

| Interaction | Animation |
|------------|-----------|
| Button hover | scale(1.02) + subtle shadow increase |
| Button click | scale(0.98) spring back |
| Favorite/heart | Heartbeat animation + fill |
| Price input focus | Border color transition to primary |
| Form field error | Shake (translateX) |
| Photo upload drag zone | Border pulse animation |
| Star rating hover | Stars fill progressively left-to-right |
| Map pin hover | Pin bounces up slightly |
| Message send | Bubble slides in from right with ease-out |

---

## 7. Responsive Layout

### 7.1 Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Wide screens */
```

### 7.2 Mobile-First Approach

All components designed mobile-first. 3D scenes on mobile:
- Reduced polygon count (LOD mobile preset)
- Disabled postprocessing effects
- Shorter animation durations
- Touch gestures for 3D model rotation (OrbitControls with touch support)

### 7.3 Key Layout Decisions

- **Search results**: 1 col mobile → 2 col tablet → 3 col desktop → 4 col wide
- **Map search**: Full-screen map on mobile (toggle between map/list), split view on desktop (40% list, 60% map)
- **Listing detail**: Stack on mobile, 2-column on desktop (60% photos/info, 40% seller/action)
- **Navigation**: Bottom tab bar on mobile, top navbar on desktop

---

## 8. Navigation Structure

### 8.1 Main Navigation (Desktop)

```
[BiciMarket Logo] [Buy] [Rent] [Repair] [AI Search] [Language] [Login/Avatar]
```

### 8.2 Mobile Bottom Tab Bar

```
[🏠 Home] [🔍 Search] [➕ Sell] [💬 Messages] [👤 Profile]
```

### 8.3 "Sell" Quick Action

The ➕ button is always prominently accessible. On mobile, it's a floating action button with the BiciMarket orange color. Tapping it opens a bottom sheet:
```
How do you want to list?
[📸 Snap a photo — AI fills specs]
[✏️  Enter details manually]
[🚴 List for rent]
```

---

## 9. Illustration & Icon System

### 9.1 Icons

- **Lucide Icons** as the base icon set (consistent, clean, open-source)
- Custom icons for bike-specific concepts (bike types, components)
- All icons are SVG, available in multiple sizes (16, 20, 24, 32)

### 9.2 Spot Illustrations

- Custom vector illustrations for empty states, onboarding, and marketing
- Style: geometric, flat, with orange/navy/teal palette
- Bicycle-themed throughout (wheels, gears, helmets, maps)

### 9.3 3D Asset Library

Stored in `apps/web/public/models/`:

```
models/
├── road-bike.glb         # High-poly hero bike
├── mtb.glb
├── city-bike.glb
├── ebike.glb
├── gravel-bike.glb
├── kids-bike.glb
├── cargo-bike.glb
├── categories/           # Low-poly versions for cards
│   ├── road-bike-lo.glb
│   ├── mtb-lo.glb
│   └── ...
└── ui/                   # UI elements (wheel, gears, etc.)
    ├── wheel.glb
    ├── gear.glb
    └── magnifier.glb
```

---

## 10. Accessibility

- WCAG 2.1 AA compliance target
- All interactive elements keyboard navigable
- Focus-visible styles on all focusable elements
- ARIA labels on icon buttons
- Color contrast ratios: min 4.5:1 for text, 3:1 for UI components
- `prefers-reduced-motion` support for all animations
- 3D scenes include `aria-hidden` with text alternatives
- Screen reader friendly with semantic HTML throughout
- Language switcher accessible via keyboard
