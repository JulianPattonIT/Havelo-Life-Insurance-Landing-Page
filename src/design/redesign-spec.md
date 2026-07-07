# InsureLeads — SelectQuote-Inspired Redesign Specification

## Reference: SelectQuote (life.selectquote.com/termlife)

**Date observed:** 2026-07-06

---

## 1. Executive Summary

This document captures the key design patterns, messaging style, and user experience decisions observed on SelectQuote's term life landing page, and translates them into actionable recommendations for the InsureLeads platform. The goal is to make InsureLeads feel more like a **consumer-facing insurance marketplace** — less like a B2B lead gen tool and more like a trusted place where consumers want to submit their information.

**Three core shifts:**
1. **Consumer-first messaging** — Talk directly to the end customer, not the agent
2. **Radical simplicity** — Minimal form, social proof, clear value prop
3. **Teal-based brand identity** — SelectQuote uses a distinctive teal/cyan (`#00AEC7`) as its primary CTA color, not blue

---

## 2. Key Observations from SelectQuote

### 2.1 Page Structure (Top to Bottom)

```
┌─────────────────────────────────────────────────┐
│ TOP BAR: "Speak to a licensed insurance agent"   │
│          1-855-241-3666                          │
├─────────────────────────────────────────────────┤
│ NAV: [Logo]                        [Secure Rates]│
│                                    (CTA button)  │
├─────────────────────────────────────────────────┤
│ HERO:                                            │
│ "Instantly compare rates from top carriers"      │
│ [Get a Free Quote button]                        │
│ "Jay • $500K for $19/month" (social proof)       │
│ "America's #1 Term Life Sales Agency"            │
├─────────────────────────────────────────────────┤
│ CONTENT:                                         │
│ "We shop highly rated insurance companies to     │
│  save you time & money."                         │
│ "Why buy life insurance?" + explanation          │
├─────────────────────────────────────────────────┤
│ REVIEWS:                                         │
│ Trustpilot: Rated 4.5 / 5 • 11,971 reviews       │
│ (4 customer review cards with star ratings)      │
├─────────────────────────────────────────────────┤
│ FOOTER CTA:                                      │
│ "We do the shopping. You do the saving."         │
│ [ZIP input] [Get a Free Quote button]            │
├─────────────────────────────────────────────────┤
│ FOOTER: Logo, social, legal links, badges        │
└─────────────────────────────────────────────────┘
```

### 2.2 Color Palette Observed

| Color | Hex/RGB | Usage |
|-------|---------|-------|
| Teal (Primary) | `#00AEC7` / `rgb(0, 174, 199)` | CTA buttons, form field borders, active elements |
| Dark text | `#212529` | Body text, headings |
| White | `#FFFFFF` | Background, button text |
| Focus ring | `#0d6efd40` | Form field focus (Bootstrap default blue) |
| Link | `#0d6efd` | Standard blue links |
| Success | `#198754` | Bootstrap green |
| Error | `#dc3545` | Bootstrap red |

### 2.3 Typography Observed

| Level | Font | Weight | Size |
|-------|------|--------|------|
| Headings | **Montserrat** | Bold (700) | Varies |
| Body | System UI stack | Normal (400) | 16px |
| Buttons | Montserrat | Bold (700) | 16px |
| Form inputs | Montserrat | Normal (400) | 16px |

### 2.4 Key UX Patterns

1. **Single-field form** — Just a ZIP code input. Reduces friction dramatically.
2. **Phone number front and center** — "Speak to a licensed insurance agent 1-855-241-3666" in the top bar builds trust.
3. **Social proof in the hero** — "Jay • $500K for $19/month" with a real-looking testimonial right next to the CTA.
4. **Trustpilot integration** — 4.5 stars, 11,971 reviews, with actual review cards.
5. **Pill-shaped buttons** — `border-radius: 1.25rem` (20px), giving a friendly, approachable feel.
6. **No form card** — The form is not in a card; it's a clean inline input + button.
7. **Teal color** — The distinctive teal (`#00AEC7`) is their brand signature, not blue.
8. **Minimalist hero** — No illustration, no heavy graphics. Just text, button, and social proof.
9. **Bootstrap-based** — Uses Bootstrap 5, giving it a clean, familiar layout.
10. **Sticky CTA** — The footer CTA (ZIP + button) is always visible near the bottom.

---

## 3. Recommended Changes for InsureLeads

### 3.1 Brand Color Shift

**Recommendation:** Adopt teal as the primary CTA color, replacing the current blue.

| Token | Current | Proposed | Rationale |
|-------|---------|----------|-----------|
| Primary CTA | `#2563EB` (Blue) | `#00AEC7` (Teal) | Distinctive, consumer-friendly, different from every other insurance site |
| Button hover | `#1D4ED8` | `#0098AE` | Darker teal |
| Focus ring | `#2563EB/20` | `#00AEC7/30` | Match new primary |
| Form border | `#CBD5E1` | `#00AEC7` | Active/focused state |
| Header accent | Navy | Teal | Underline/highlight elements |

**Keep from existing palette:**
- Navy (`#1B2A4A`) — still works for header, footer, sidebar
- Gold (`#D4A843`) — keep for trust badges/accents
- Neutral slate palette — keep for body text, backgrounds
- Success green (`#059669`) — keep for checkmarks

### 3.2 Typography Change

**Recommendation:** Switch from Inter to **Montserrat** for headings, keeping Inter for body text.

| Level | Font | Rationale |
|-------|------|-----------|
| Headings (H1-H3) | **Montserrat** (700) | Matches SelectQuote's consumer-friendly feel |
| Body text | **Inter** (400) | Better readability at small sizes |
| Buttons | **Montserrat** (700) | Bold, punchy CTA text |
| Form inputs | **Inter** (400) | Clean, professional |

### 3.3 Landing Page Layout Redesign

#### New Layout (Desktop)

```
┌─────────────────────────────────────────────────┐
│ TOP BAR (teal bg): ▲ Phone: 1-855-241-3666      │
│           "Speak to a licensed insurance agent"  │
├─────────────────────────────────────────────────┤
│ HEADER: [Logo]          [Get a Free Quote]       │
│                         (teal pill button)       │
├─────────────────────────────────────────────────┤
│ HERO (centered, no illustration):               │
│                                                 │
│     "Get Pre-Qualified Life Insurance           │
│      Leads Delivered to Your CRM"               │
│                                                 │
│     [Enter ZIP Code] [Get a Free Quote →]       │
│     (inline form, no card)                      │
│                                                 │
│     "Jay • $500K policy for $19/month"          │
│     (social proof testimonial strip)            │
│                                                 │
│     ★★★★★ "America's #1 Lead Source"           │
│     (Trustpilot-style rating)                   │
│                                                 │
├─────────────────────────────────────────────────┤
│ TRUST BAR (logo row):                           │
│ [Trustpilot 4.5★] [BBB A+] [Licensed ✓] [Secure]│
├─────────────────────────────────────────────────┤
│ HOW IT WORKS (3 steps, icon-based):             │
│ 1. Consumer enters ZIP                          │
│ 2. We match with top carriers                   │
│ 3. Lead delivered to your CRM                   │
├─────────────────────────────────────────────────┤
│ TESTIMONIALS (2-3 agent reviews):               │
│ "InsureLeads doubled my close rate" - Agent     │
├─────────────────────────────────────────────────┤
│ FOOTER CTA:                                     │
│ "We do the shopping. You do the closing."       │
│ [ZIP input] [Get a Free Quote →]                │
├─────────────────────────────────────────────────┤
│ FOOTER: [Logo] Privacy • Terms • Disclosures    │
│         © 2026 InsureLeads. All rights reserved.│
└─────────────────────────────────────────────────┘
```

#### Key Layout Changes

| Element | Current (InsureLeads) | Proposed (SelectQuote-inspired) |
|---------|----------------------|--------------------------------|
| Hero layout | Two-column (text + form card) | Single column, centered, minimal |
| Form | 7 fields in a card with header | 1 field (ZIP) inline, no card |
| Phone number | Not shown | Prominent in top bar |
| Social proof | Trust pills with checkmarks | Testimonial quote + pricing example |
| Trustpilot | Not present | Rating badge + review cards |
| Illustration | hero-family.svg | None needed (or optional) |
| Sticky CTA | None | Footer CTA with ZIP input |

### 3.4 Form Simplification

**Current form:** 7 fields — full name, phone, email, DOB, product interest, coverage amount, ZIP

**Proposed approach:** Two-step progressive disclosure

**Step 1 (Hero):** Just ZIP code
```
[Enter ZIP Code] [Get a Free Quote →]
```

**Step 2 (After ZIP):** Modal or next page with remaining fields
```
Full Name:     [________________]
Phone:         [________________]
Email:         [________________]
Date of Birth: [________________]
Product Interest: [Dropdown]
Coverage:      [Dropdown]
```

**Rationale:** SelectQuote's minimal form approach reduces abandonment. Start with ZIP, then collect the rest after the user is committed.

### 3.5 Button Styling Update

| Property | Current | Proposed (SelectQuote-inspired) |
|----------|---------|--------------------------------|
| Background | `#2563EB` (blue) | `#00AEC7` (teal) |
| Border radius | 8px (rounded-lg) | 20px (pill shape, `rounded-full`) |
| Font | Inter Semibold | Montserrat Bold (700) |
| Padding | `px-6 py-3` | `px-8 py-3` (wider) |
| Hover | `#1D4ED8` | `#0098AE` (darker teal) |
| Shadow | `shadow-sm` | `shadow-md` with teal tint |
| Transition | 150ms | 150ms, including box-shadow |

### 3.6 Top Bar (New Element)

Add a thin utility bar above the main header:

```tsx
<div className="bg-teal-600 px-4 py-2 text-center text-sm font-medium text-white">
  <span>Speak to a licensed insurance agent </span>
  <a href="tel:1-855-241-3666" className="font-bold underline">
    1-855-241-3666
  </a>
</div>
```

### 3.7 Social Proof Integration

**In hero (below form):**
```tsx
<div className="mt-6 flex items-center justify-center gap-2 text-sm text-neutral-600">
  <span className="font-semibold text-neutral-900">Jay</span>
  <span className="text-neutral-300">•</span>
  <span>$500K policy for <span className="font-bold text-teal-600">$19/month</span></span>
</div>
```

**Trustpilot-style badge:**
```tsx
<div className="mt-4 flex items-center justify-center gap-2">
  <div className="flex text-gold-500">★★★★★</div>
  <span className="text-sm font-medium text-neutral-700">
    Rated <strong>4.5</strong> / 5 based on <strong>11,971 reviews</strong>
  </span>
  <img src="/images/trustpilot.svg" alt="Trustpilot" className="h-5" />
</div>
```

### 3.8 Component Updates

#### Header Component
```tsx
// Top bar with phone
<div className="bg-teal-600">
  <div className="mx-auto flex max-w-[1200px] items-center justify-end px-6 py-1.5">
    <span className="text-xs font-medium text-white">
      Speak to a licensed insurance agent
    </span>
    <a href="tel:1-855-241-3666" className="ml-2 text-xs font-bold text-white underline">
      1-855-241-3666
    </a>
  </div>
</div>

// Main nav
<header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
  <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
    <img src="/images/logo.svg" alt="InsureLeads" className="h-8" />
    <a href="#quote" className="rounded-full bg-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-teal-700">
      Get a Free Quote
    </a>
  </div>
</header>
```

#### Primary CTA Button (Teal Pill)
```tsx
<button className="rounded-full bg-teal-600 px-8 py-3 text-base font-bold text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-2">
  Get a Free Quote
</button>
```

#### Inline Form (ZIP + Button)
```tsx
<form className="flex items-center gap-3">
  <input
    type="text"
    placeholder="Enter ZIP Code"
    maxLength={5}
    className="h-12 w-40 rounded-full border-2 border-teal-600 px-5 text-center text-base font-medium text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
  />
  <button className="h-12 rounded-full bg-teal-600 px-8 text-base font-bold text-white shadow-md transition-all hover:bg-teal-700">
    Get a Free Quote →
  </button>
</form>
```

#### Social Proof Strip
```tsx
<div className="mt-6 flex flex-col items-center gap-2">
  {/* Testimonial */}
  <div className="flex items-center gap-2 text-sm text-neutral-600">
    <span className="font-semibold text-neutral-900">Jay</span>
    <span className="text-neutral-300">•</span>
    <span>$500K policy for <span className="font-bold text-teal-600">$19/month</span></span>
  </div>
  {/* Trustpilot rating */}
  <div className="flex items-center gap-2">
    <div className="flex text-gold-500">★★★★★</div>
    <span className="text-sm font-medium text-neutral-600">
      Rated <strong>4.5</strong> / 5 • <strong>11,971</strong> reviews
    </span>
  </div>
</div>
```

#### Trust Bar (Logos/Seals)
```tsx
<div className="flex flex-wrap items-center justify-center gap-8 border-t border-neutral-200 bg-neutral-50 py-6">
  <img src="/images/trustpilot-logo.svg" alt="Trustpilot 4.5★" className="h-8" />
  <img src="/images/bbb-logo.svg" alt="BBB A+" className="h-8" />
  <div className="flex items-center gap-2 text-sm text-neutral-600">
    <svg className="h-5 w-5 text-green-600" ...>✓</svg>
    Licensed & Bonded
  </div>
  <div className="flex items-center gap-2 text-sm text-neutral-600">
    <svg className="h-5 w-5 text-green-600" ...>🔒</svg>
    256-bit Encrypted
  </div>
</div>
```

---

## 4. Updated Tailwind Theme Additions

Add these to the existing `@theme` block in `app.css`:

```css
@theme {
  /* ─── Teal (New Primary) ──────────────────────────── */
  --color-teal-600: #00AEC7;
  --color-teal-700: #0098AE;
  --color-teal-500: #00C4DF;
  --color-teal-100: #CCF4FA;
  --color-teal-50: #E6FAFD;

  /* ─── Keep existing colors ────────────────────────── */
  /* Navy, Gold, Blue, Neutral, Success, Error, Warning */
}
```

---

## 5. Updated Font Loading

Add Montserrat alongside Inter in the root route:

```tsx
// src/routes/__root.tsx
export const Route = createRootRoute({
  head: () => ({
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800&display=swap" },
    ],
  }),
});
```

---

## 6. Recommended Implementation Order

| Priority | Change | Effort | Impact |
|----------|--------|--------|--------|
| P0 | **Teal CTA color** (change primary button from blue to teal) | Low | High |
| P0 | **Pill-shaped buttons** (change border-radius to rounded-full) | Low | High |
| P0 | **Top bar with phone number** (new component) | Low | High |
| P1 | **Hero simplification** (single column, centered, form inline) | Medium | High |
| P1 | **Social proof in hero** (testimonial + Trustpilot badge) | Low | High |
| P1 | **Montserrat for headings** (font swap) | Low | Medium |
| P2 | **Two-step form** (ZIP first, then rest) | Medium | High |
| P2 | **Trustpilot review cards** (below hero) | Medium | Medium |
| P2 | **Trust bar with logos** (below hero) | Low | Medium |
| P3 | **Footer CTA** (sticky ZIP + button) | Low | Medium |

---

## 7. Rationale Summary

| Change | Why it matters |
|--------|---------------|
| **Teal over blue** | Blue is ubiquitous in insurance (everyone uses it). Teal is distinctive, modern, and signals "we're different." |
| **Pill-shaped buttons** | Softer, more approachable, less "corporate" — matches consumer expectations |
| **Phone in top bar** | Builds immediate trust. Consumers want to know they can talk to a real person. |
| **Single-field form** | Dramatically reduces friction. Get the ZIP first, then collect more data. |
| **Social proof in hero** | "Jay $500K for $19/month" makes the benefit concrete and relatable. |
| **Montserrat headings** | Bolder, more confident typography. Inter is great for body, but Montserrat has more personality for headlines. |
| **No form card** | Removes visual barriers. The form should feel like a natural part of the page, not a separate "transaction." |
| **Trustpilot reviews** | Third-party validation is the strongest trust signal. 11,971 reviews is hard to ignore. |

---

## 8. Figma / Visual Reference

For the developer and designer: the teal hex `#00AEC7` on white with Montserrat headings creates a clean, modern, consumer-first look. The feel should be more like a **consumer fintech app** (e.g., Credit Karma, NerdWallet) than a traditional insurance agent portal.

**Dark mode not needed for Phase 1.**

---

## 9. Assets Needed

| Asset | Status | Notes |
|-------|--------|-------|
| Teal version of logo | Needs update | Logo currently uses navy; add teal accent variant |
| Trustpilot logo SVG | Needs to be sourced | For trust bar |
| BBB logo SVG | Needs to be sourced | For trust bar |
| Social proof icons | Already exists | trust-secure.svg, trust-agents.svg, trust-licensed.svg |
| Product icons | Already exists | icon-final-expense.svg, icon-term-life.svg, icon-annuity.svg |
| Hero illustration | Optional | Could keep hero-family.svg but placed less prominently |