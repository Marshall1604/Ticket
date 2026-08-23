# DESIGN SYSTEM — TICKETSHOW LUXURY TICKETING PLATFORM

> **Brand Positioning**: *"Your access to unforgettable moments."*  
> **Aesthetic Philosophy**: Minimal Luxury + Editorial + Premium Entertainment  
> **Core Principles**: Clarity > Unnecessary Effects | UX > Decoration | Ticket Conversion > Visual Complexity

---

## 1. Brand Personality & Values

- **Exclusive & Curated**: Feels like an art gallery or luxury fashion house presenting prestigious cultural events.
- **Contemporary & Trustworthy**: Clear seat information, authentic pricing, transparent ticket tiers, and frictionless checkout.
- **Effortless & Premium**: Rich typography, spacious layout, cinematic photography, calm and confident aesthetic.
- **Non-AI Aesthetic**: Avoids generic SaaS templates, neon borders, heavy glassmorphism, floating blobs, or aggressive animated gradients.

---

## 2. Color System & Design Tokens

### Core Palette

| Token Name | Hex / Value | Semantic Role |
| :--- | :--- | :--- |
| `--color-bg-primary` | `#F7F6F2` | **Luxury Ivory** — Primary canvas background for warmth and elegance |
| `--color-bg-secondary` | `#FFFFFF` | **Pure White** — Elevated card surfaces, search sheets, and active modals |
| `--color-bg-dark` | `#0A1C18` | **Deep Forest Dark Surface** — High-end editorial banners and dark surfaces |
| `--color-text-primary` | `#10231E` | **Deep Ink** — High-contrast primary headlines and body text |
| `--color-text-secondary`| `#66736E` | **Refined Sage Grey** — Subtitles, dates, venue metadata |
| `--color-text-muted` | `#9BA5A1` | **Muted Stone** — Placeholders, secondary labels, disabled states |
| `--color-brand-primary` | `#0E4437` | **Luxury Emerald** — Primary brand identity, primary CTA buttons |
| `--color-brand-hover` | `#093027` | **Deep Emerald** — Primary CTA hover state |
| `--color-accent-champagne`| `#D7BE8A` | **Warm Champagne** — Subtle badges, VIP tier highlights, accents |
| `--color-border-subtle` | `rgba(16, 35, 30, 0.10)` | **Subtle Ink Border** — Dividers and card borders |
| `--color-border-hover` | `rgba(16, 35, 30, 0.22)` | **Focused Border** — Hover/active card borders |
| `--color-surface-hover` | `rgba(14, 68, 55, 0.03)` | Subtle interactive highlight surface |

### Gradients (Subtle & Editorial only)
- **Background Warmth**: `linear-gradient(135deg, #F7F6F2 0%, #EFE9DC 100%)`
- **Emerald/Champagne Tint**: `linear-gradient(145deg, rgba(14, 68, 55, 0.06) 0%, rgba(215, 190, 138, 0.08) 100%)`
- **Dark Editorial Vignette**: `linear-gradient(180deg, rgba(10, 28, 24, 0.0) 0%, rgba(10, 28, 24, 0.85) 100%)`

---

## 3. Typography System

### Font Pairings
- **Display / Editorial Font**: `Bodoni Moda` (Google Fonts, serif, optical size auto, weights 400..700)  
  *Usage*: Wordmark logo, hero titles, major editorial headlines, featured show titles.
- **Alternative Serif**: `Cormorant Garamond`
- **UI / Body Font**: `Manrope` (Google Fonts, sans-serif, weights 400, 500, 600, 700)  
  *Usage*: Navigation, body paragraphs, buttons, filter chips, metadata, forms, ticket details.
- **Alternative Sans**: `Inter`

### Scale & Hierarchy

| Element | Desktop Size / Line-Height | Mobile Size / Line-Height | Weight & Tracking |
| :--- | :--- | :--- | :--- |
| **Hero Display** | 76–96px / 1.0 | 44–52px / 1.1 | 500 / `-0.03em` |
| **H1 Headline** | 56–72px / 1.05 | 38–46px / 1.15 | 500 / `-0.025em` |
| **H2 Section Title**| 40–52px / 1.15 | 30–36px / 1.2 | 500 / `-0.02em` |
| **H3 Subhead** | 26–32px / 1.25 | 22–26px / 1.3 | 500 / `-0.015em` |
| **Event Card Title**| 22–26px / 1.3 | 20–22px / 1.3 | 600 / `-0.01em` |
| **Body Large** | 18px / 1.6 | 17px / 1.55 | 400 / normal |
| **Body Regular** | 16px / 1.6 | 15px / 1.55 | 400 / normal |
| **Metadata / Badges**| 13–14px / 1.4 | 12–13px / 1.4 | 500–600 / `0.02em` uppercase |
| **Navigation / CTA**| 14–15px / 1.0 | 14px / 1.0 | 600 / `0.01em` |

---

## 4. Spacing, Grid & Layout

### Container Max Widths & Gutters
- **Desktop Max-Width**: `1280px` (with `32px` gutter padding)
- **Laptop (1024px – 1200px)**: `24px` gutter padding
- **Mobile (< 768px)**: `20px` gutter padding

### Column Grid
- **Desktop (≥ 1024px)**: 12-column fluid grid
- **Tablet (768px – 1023px)**: 8-column fluid grid
- **Mobile (< 768px)**: 4-column / single-column flow

### Section Vertical Spacing
- **Desktop**: `100px – 140px`
- **Tablet**: `80px`
- **Mobile**: `56px – 72px`

---

## 5. UI Components Specification

### Button System
1. **Primary Button**:
   - Background: `#0E4437` (Luxury Emerald), Text: `#FFFFFF`
   - Height: `52px`, Padding: `0 26px`, Radius: `999px` (Pill shape)
   - Hover: Background `#093027`, subtle `transform: translateY(-1px)`, transition `180ms ease`
   - Focus: Visible accessible focus ring `2px solid #D7BE8A` with `2px` offset.
2. **Secondary Button**:
   - Background: `transparent`, Border: `1px solid #0E4437`, Text: `#10231E`
   - Height: `52px` (or `44px` compact), Padding: `0 24px`, Radius: `999px`
   - Hover: Background `rgba(14, 68, 55, 0.05)`, `translateY(-1px)`
3. **Ghost / Editorial Link Button**:
   - Background: `transparent`, Text: `#10231E`, Underline transition on hover.
4. **Disabled / Sold Out Button**:
   - Background: `#E5E7EB`, Text: `#9BA5A1`, Cursor `not-allowed`.

### Card System
- **Hero Editorial Cards**:
  - Ratio: `16:9` or `3:2`
  - Rounded border: `24px`
  - Subtle dark gradient overlay for crystal clear contrast on text
  - Hover: Image zoom `1.03`, Arrow translate `+5px`, smooth 240ms transition
- **Featured Artist Cards**:
  - Ratio: `4:5` (Portrait format, rectangular with `24px` rounded corners, strictly NOT circular avatar)
  - Typography: Bodoni Moda artist name + Manrope genre label below portrait
  - Hover: subtle image scale `1.04` and text underline
- **Standard Event Discovery Cards**:
  - White surface `#FFFFFF`, `1px solid rgba(16, 35, 30, 0.08)`, Radius `20px`
  - Scannable in 2–3 seconds: Date badge, Category, Title, Artist, Venue, Price (*"Từ 650.000đ"*), Action CTA (*"Xem vé"*).

### Navigation & Header
- **Desktop Header**:
  - Height: `76px`
  - Sticky at top, Ivory translucent background (`rgba(247, 246, 242, 0.88)`), `backdrop-filter: blur(12px)`
  - Fine bottom hairline border (`rgba(16, 35, 30, 0.08)`) appearing on scroll
  - Wordmark Logo in `Bodoni Moda`
  - Nav links: `SHOW ALL`, `VÉ CỦA TÔI`, `ABOUT`, `CONTACT`
  - Action: `Đăng nhập / Đăng ký` (or User Profile trigger when authenticated)
- **Mobile Header**:
  - Logo + Search button + Account link + Mobile drawer trigger.

### Form Inputs & Filters
- **Input Fields**:
  - Height: `50px`, Background: `#FFFFFF`, Border: `1px solid rgba(16, 35, 30, 0.14)`, Radius: `12px`
  - Focus: Border `#0E4437`, ring `3px rgba(14, 68, 55, 0.12)`
- **Filter Chips**:
  - Height: `38px`, Radius: `999px`, Border `1px solid rgba(16, 35, 30, 0.12)`
  - Active State: Background `#0E4437`, Text `#FFFFFF`, Border `#0E4437`

---

## 6. Image & Photography Guidelines

- **Style**: High-fidelity concert photography, stage lighting, artist portraits, dramatic mood, deep shadows, authentic live music moments.
- **Treatment**: `object-fit: cover`, subtle editorial tone curves, no cheap vector cliparts or generic AI blobs.
- **Performance**: Responsive `srcset` / Next.js Image with WebP/AVIF formats, Hero LCP image priority preload.

---

## 7. Motion & Accessibility System

### Motion Rules
- **Entrance Animation**: Fade + `translateY(16px)`, `500ms – 650ms` cubic-bezier(0.16, 1, 0.3, 1).
- **Interactive Hover**: `180ms – 240ms` ease-out.
- **Precaution**: Strict adherence to `@media (prefers-reduced-motion: reduce)`. When enabled, animations convert to instant or simple opacity fade.

### Accessibility Standards
- **WCAG Level**: AA minimum.
- **Contrast**: Deep Ink `#10231E` on Luxury Ivory `#F7F6F2` achieves `12.5:1` (exceeding standard 4.5:1 requirement).
- **Keyboard Navigation**: All interactive elements (buttons, links, quantity pickers, filter chips, dialogs) have distinct focus rings and trap focus in modals.
