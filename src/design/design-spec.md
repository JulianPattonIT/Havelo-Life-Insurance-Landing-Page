# InsureLeads — UI/UX Design Specification

## Overview

This document defines the complete design system for the InsureLeads lead generation platform. The design targets independent insurance agents selling final expense, term life, and annuity products. Every decision is made to build **trust**, **credibility**, and **conversion** — the three pillars of insurance lead generation.

---

## 1. Design Principles

| Principle | Application |
|-----------|---------|
| **Trust First** | Every visual element should reinforce security, legitimacy, and professionalism |
| **Clarity Over Creativity** | Navigation, copy, and layout are unambiguous; users never wonder "what do I do next?" |
| **Speed & Simplicity** | Minimal load, minimal friction, minimal fields — get the lead in the door fast |
| **Mobile-First** | Every component works on a phone first; desktop enhances, never requires |
| **Professional Polish** | Clean lines, generous whitespace, premium feel — not cheap or "spammy" |

---

## 2. Color Palette

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-navy-900` | `#1B2A4A` | Primary brand color — header backgrounds, footer, primary text on light |
| `--color-navy-800` | `#243B5E` | Hover states, secondary headers |
| `--color-navy-700` | `#2E4C72` | Active states, section backgrounds |
| `--color-navy-100` | `#D6E0EF` | Light tint for backgrounds, table headers |
| `--color-navy-50` | `#F0F4FA` | Page/section backgrounds |

### Secondary / Action Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-blue-600` | `#2563EB` | Primary CTA buttons, active links, focus rings |
| `--color-blue-700` | `#1D4ED8` | Button hover states |
| `--color-blue-100` | `#DBEAFE` | Alert banners, badge backgrounds |
| `--color-blue-50` | `#EFF6FF` | Hover backgrounds on light cards |

### Accent / Trust Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-gold-500` | `#D4A843` | Trust badges, highlight accents, star ratings |
| `--color-gold-400` | `#E0B959` | Hover states for gold elements |
| `--color-gold-100` | `#F5EDD2` | Background for trust badges |

### Success / Error / Warning

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#059669` | Submit buttons, success messages, checkmarks |
| `--color-success-light` | `#D1FAE5` | Success banner background |
| `--color-error` | `#DC2626` | Error messages, validation indicators |
| `--color-error-light` | `#FEE2E2` | Error banner background |
| `--color-warning` | `#D97706` | Warning messages |
| `--color-warning-light` | `#FEF3C7` | Warning banner background |

### Neutral Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-neutral-900` | `#1E293B` | Body text, headings |
| `--color-neutral-700` | `#334155` | Secondary text |
| `--color-neutral-500` | `#64748B` | Placeholder text, captions |
| `--color-neutral-300` | `#CBD5E1` | Borders, dividers, disabled states |
| `--color-neutral-200` | `#E2E8F0` | Card borders, light dividers |
| `--color-neutral-100` | `#F1F5F9` | Hover backgrounds |
| `--color-neutral-50` | `#F8FAFC` | Page background |

### Background Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-page` | `#F8FAFC` | Page/site background |
| `--bg-card` | `#FFFFFF` | Card, form, and modal backgrounds |
| `--bg-hero` | `#F0F4FA` (navy-50) | Hero section background |
| `--bg-gradient-start` | `#F0F4FA` | Gradient start (hero) |
| `--bg-gradient-end` | `#EFF6FF` | Gradient end (hero) |

---

## 3. Typography

### Font Family

**Primary: Inter** — loaded via Google Fonts (`wght@300;400;500;600;700;800`)

Inter is chosen for its excellent legibility at small sizes, strong numbers (critical for insurance), and professional, modern appearance.

### Font Scale

| Level | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| **H1** | 3rem (48px) | 800 (ExtraBold) | 1.1 | -0.02em | Main hero headline |
| **H2** | 2.25rem (36px) | 700 (Bold) | 1.2 | -0.01em | Section headings |
| **H3** | 1.5rem (24px) | 700 (Bold) | 1.3 | — | Card titles, form section titles |
| **H4** | 1.25rem (20px) | 600 (Semibold) | 1.4 | — | Dashboard subheadings |
| **Body** | 1rem (16px) | 400 (Regular) | 1.5 | — | Paragraphs, form labels |
| **Body Small** | 0.875rem (14px) | 400 (Regular) | 1.5 | — | Secondary text, metadata |
| **Caption** | 0.75rem (12px) | 400 (Regular) | 1.5 | — | Fine print, timestamps |
| **Caption Small** | 0.625rem (10px) | 300 (Light) | 1.5 | — | Legal disclaimers, footnotes |

### Text Styles

- **CTA / Button text**: Inter Semibold (600), 1rem (16px) or 0.875rem (14px for small buttons)
- **Navigation**: Inter Medium (500), 0.875rem (14px)
- **Label text**: Inter Medium (500), 0.875rem (14px)
- **Data / Numbers**: Inter Semibold (600), tabular-nums for monetary values
- **Links**: Inter Medium (500), colored with `blue-600`, underlined on hover

### Responsive Typography

- `H1` scales: 2.25rem on mobile → 3rem on desktop
- `H2` scales: 1.75rem on mobile → 2.25rem on desktop
- All body sizes remain consistent across breakpoints

---

## 4. Spacing System

Following a 4px base unit:

| Token | Value | Rem |
|-------|-------|-----|
| `space-0.5` | 2px | 0.125rem |
| `space-1` | 4px | 0.25rem |
| `space-2` | 8px | 0.5rem |
| `space-3` | 12px | 0.75rem |
| `space-4` | 16px | 1rem |
| `space-5` | 20px | 1.25rem |
| `space-6` | 24px | 1.5rem |
| `space-8` | 32px | 2rem |
| `space-10` | 40px | 2.5rem |
| `space-12` | 48px | 3rem |
| `space-16` | 64px | 4rem |
| `space-20` | 80px | 5rem |

### Section Padding

| Section | Mobile | Desktop |
|---------|--------|---------|
| Hero | py-12 (48px), px-6 (24px) | py-20 (80px), px-8 (32px) |
| Form Section | py-8 (32px), px-4 (16px) | py-16 (64px), px-6 (24px) |
| Trust Bar | py-6 (24px) | py-8 (32px) |
| Footer | py-8 (32px) | py-12 (48px) |

---

## 5. Component Styles

### 5.1 Buttons

#### Primary CTA Button (Submit / "Get Your Free Quote")
- Background: `blue-600` (`#2563EB`)
- Text: White, Semibold (600), 16px
- Padding: `px-6 py-3` (24px horizontal, 12px vertical)
- Border radius: `rounded-lg` (8px)
- Shadow: `shadow-sm`
- Hover: Background `blue-700` (`#1D4ED8`), slight lift with `shadow-md`
- Active: Background `blue-800`, transform scale 0.98
- Focus: Ring `ring-2 ring-blue-500 ring-offset-2`
- Disabled: `opacity-60`, `cursor-not-allowed`
- Full width on mobile, auto-width on desktop
- Transition: All 150ms ease

#### Secondary Button (Ghost / Outline)
- Border: `border-2 border-navy-900`
- Text: Navy-900, Semibold (600)
- Background: Transparent
- Hover: Background `navy-50` (`#F0F4FA`)
- Same padding and radius as primary

#### Gold Accent Button (Trust / Info)
- Background: `gold-500` (`#D4A843`)
- Text: White
- For use on trust badges, premium CTAs
- Hover: `gold-400`

#### Small Button (Dashboard actions)
- Padding: `px-3 py-1.5` (12px × 6px)
- Font size: 14px
- Radius: `rounded-md` (6px)

### 5.2 Form Fields

#### Text Input / Select
- Background: White
- Border: `border-neutral-300` (`#CBD5E1`), 1px solid
- Border radius: `rounded-lg` (8px)
- Padding: `px-4 py-2.5` (16px × 10px)
- Text: `neutral-900` (`#1E293B`), 16px
- Placeholder: `neutral-500` (`#64748B`), 16px
- Focus: Border `blue-500` (`#2563EB`), ring `ring-2 ring-blue-500/20`
- Error: Border `red-500` (`#DC2626`), ring `ring-2 ring-red-500/20`
- Shadow: `shadow-sm` on focus
- Transition: All 150ms ease
- Width: `w-full` on all inputs

#### Select Dropdown
- Custom chevron icon (down arrow, neutral-400)
- Same styles as text input
- Native dropdown on mobile for better UX

#### Label
- Font: Inter Medium (500), 14px
- Color: `neutral-700` (`#334155`)
- Spacing: `mb-1.5` below, `mt-4` above top-label group
- Required indicator: `*` in red (`#DC2626`)

#### Validation States
- Valid: Green checkmark icon on the right (`success` green)
- Error: Red border, red error message below input (`text-red-600`, 13px)
- Help text: `text-neutral-500`, 13px, below input

#### Input Groups (Phone/Email side by side)
- 2-column grid on desktop (`grid-cols-2`)
- Single column stack on mobile (`grid-cols-1`)
- Gap: 16px

### 5.3 Cards

#### Lead Capture Form Card
- Background: White
- Border radius: `rounded-2xl` (16px)
- Shadow: `shadow-xl`
- Border: `ring-1 ring-neutral-200`
- Max width: `max-w-2xl` (672px)
- Padding: `p-0` (card header uses `px-8 py-6`, body uses `px-8 py-6`)

#### Card Header
- Bottom border: `border-b border-neutral-200`
- Title: H3 (24px, Bold)
- Subtitle: Body small (14px, `neutral-500`)

#### Dashboard Summary Card
- Background: White
- Border radius: `rounded-xl` (12px)
- Shadow: `shadow-sm`
- Padding: `p-6`
- Icon area: 40px × 40px circle with brand color background

#### Lead Row Card (Dashboard List)
- Background: White
- Border radius: `rounded-lg` (8px)
- Border: `border border-neutral-200`
- Padding: `px-4 py-3`
- Hover: `shadow-sm`, slightly elevated

### 5.4 Navigation / Header

#### Site Header (Landing Page)
- Background: White or transparent (solid on scroll)
- Height: 64px (h-16)
- Padding: `px-6`
- Logo: 32px tall, left-aligned
- Max width: 1200px centered container
- Sticky on scroll with subtle bottom border

#### Admin Dashboard Sidebar
- Background: Navy-900
- Width: 260px desktop, full overlay on mobile
- Logo: White version, 28px tall, top padded 24px
- Nav items: White text, 14px, Medium weight
- Active item: Navy-700 background, left accent bar in gold-500
- Hover: Navy-800 background
- Bottom: User info/agency name, logout link

### 5.5 Trust Badges

#### Inline Trust Pills (Hero Section)
- Pill style: `rounded-full` with icon + text
- Background: Transparent or navy-50
- Text: 14px, `neutral-500`
- Icon: Green checkmark (16px), `text-green-500`
- Gap between items: 24px
- Center-aligned, wrap on mobile

#### Trust Badges (Near Submit Button)
- Small badge card with icon and text
- Background: White or tinted
- Border: `border border-neutral-200`, `rounded-lg`
- Font: 12px, Medium, `neutral-600`
- Example badges: "256-bit Encrypted", "Licensed Agents Only", "No Spam Guarantee"

### 5.6 Progress / Stepper

#### Multi-Step Form Indicator (Future)
- Horizontal steps with numbers/checkmarks
- Active step: Blue circle with white number
- Completed: Green circle with checkmark
- Inactive: Gray circle
- Connecting line between steps

---

## 6. Page Layouts

### 6.1 Landing Page Layout

```
┌──────────────────────────────────────────┐
│             HEADER (64px)                │
│   [Logo]                           [nav] │
├──────────────────────────────────────────┤
│                                          │
│           HERO SECTION (py-16-20)        │
│   ┌─────────────────┐  ┌──────────────┐ │
│   │   Value Prop     │  │              │ │
│   │   Headline H1    │  │  Lead Form   │ │
│   │   Subtitle       │  │    Card      │ │
│   │   Trust Pills    │  │              │ │
│   └─────────────────┘  └──────────────┘ │
│                                          │
│           TRUST BAR (py-8)              │
│   [Badge] [Badge] [Badge] [Badge]       │
│                                          │
│       FEATURES / HOW IT WORKS            │
│   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│   │   1   │ │   2   │ │   3   │ │   4   │ │
│   └──────┘ └──────┘ └──────┘ └──────┘ │
│                                          │
│           CTA SECTION                    │
│   ┌─────────────────────────────────────┐│
│   │  "Ready to get started?" + button   ││
│   └─────────────────────────────────────┘│
│                                          │
│             FOOTER (py-8)                │
│   [Logo]  Links  © 2025 InsureLeads     │
└──────────────────────────────────────────┘
```

**Desktop (≥1024px):** Two-column hero: 60% value prop (left) + 40% form card (right), centered in 1200px container.

**Tablet (768-1023px):** Single column, centered. Form below value prop.

**Mobile (<768px):** Single column, value prop text smaller, form full width.

### 6.2 Admin Dashboard Layout

```
┌──────────────────────────────────────────┐
│ SIDEBAR (260px) │      MAIN CONTENT      │
│ ┌──────────────┐ │  ┌──────────────────┐ │
│ │ Logo          │ │  │  Top Bar / Stats │ │
│ │               │ │  │                  │ │
│ │ ● Dashboard   │ │  │ ┌───┐ ┌───┐ ┌──┐│ │
│ │ ○ Leads       │ │  │ │$12│ │234│ │98││ │
│ │ ○ Exports     │ │  │ └───┘ └───┘ └──┘│ │
│ │ ○ Settings    │ │  │                  │ │
│ │               │ │  │  Lead Table      │ │
│ │ User Info     │ │  │ ┌────────────────┴┐│
│ │ Sign Out      │ │  │ │ Name   Status    ││
│ └──────────────┘ │  │ │ John   New       ││
└──────────────────┘  │ │ Jane   Contacted ││
                      │ │ ...              ││
                      │ └─────────────────┘│
                      │                    │
                      │  Pagination        │
                      └────────────────────┘
```

### 6.3 Thank You / Confirmation Page

- Centered layout with success checkmark icon (green circle, 64px)
- "Thank You!" heading (H2, 36px)
- Confirmation body text
- Security/privacy reassurance text
- Optional: Next steps / "What to expect" section

---

## 7. Iconography

All icons should use line/outline style with consistent stroke widths (2px).

- **Navigation icons**: Simple, monochrome, neutral-500
- **CTA icons**: White on brand-color backgrounds
- **Product icons** (Final Expense, Term Life, Annuity): Simple icons with brand colors
- **Trust icons**: Shield, lock, checkmark, badge — green or gold

Refer to the graphic-designer's SVG assets in `/public/images/`.

---

## 8. Imagery & Illustration Style

- Clean, modern vector illustrations (family, protection, security themes)
- Colors aligned with brand palette (navy, blue, warm tones)
- People depicted: diverse, multi-generational families
- No photos of real people (vector style avoids aging or authenticity issues)
- Illustration style: Flat vector with subtle gradients, rounded shapes

Refer to the graphic-designer's hero-family.svg and product icons.

---

## 9. Responsive Breakpoints

| Breakpoint | Min Width | Target |
|------------|-----------|--------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Wide desktop |

---

## 10. Dark Mode (Future Consideration)

Not required for Phase 1. If implemented later:
- Background: Navy-900
- Cards: Navy-800
- Text: White/navy-100
- CTAs remain blue-600

---

## 11. Animation & Transitions

- **Button hover**: Background color, 150ms ease
- **Card hover**: Subtle shadow increase, translateY(-2px), 200ms ease
- **Form focus**: Border color + ring, 150ms ease
- **Page transitions**: Fade in, 300ms ease
- **Loading states**: Skeleton shimmer or spinner animation
- **Error states**: Shake animation (optional) on invalid submit

All animations should be subtle — never flashy or distracting.

---

## 12. Accessibility

- All interactive elements must have focus states (visible ring)
- Color contrast ratios meet WCAG AA minimum (4.5:1 for text)
- Form fields have associated `<label>` elements
- Error messages are announced via aria-live regions
- Touch targets minimum 44×44px on mobile
- Semantic HTML structure (h1-h6 hierarchy, landmark regions)

---

## 13. Future Design Considerations (Post-Phase 1)

- **Lead filtering UI** for admin dashboard
- **Multi-step form** (Step 1: Basic info, Step 2: Product selection, Step 3: Confirm)
- **CSV export preview** (modal with data preview)
- **Settings page** (webhook URL configuration, export schedule)
- **Mobile app consideration** (PWA readiness)