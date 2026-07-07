# InsureLeads — Tailwind CSS v4 Theme Configuration

> **Note:** This project uses **Tailwind CSS v4** with the `@tailwindcss/vite` plugin. In v4, custom theme tokens are defined using the `@theme` CSS directive in your CSS file — there is no `tailwind.config.ts` file. All tokens below are designed to be added directly to `src/styles/app.css`.

---

## How to Apply

Add the following `@theme` block to `src/styles/app.css` **after** the `@import "tailwindcss";` line:

```css
@import "tailwindcss";

@theme {
  /* Paste the theme tokens below */
}
```

Then use the tokens in your components as Tailwind utility classes (e.g., `bg-navy-900`, `text-gold-500`, `font-display`).

---

## Complete Theme Token Block

```css
@theme {
  /* ─── Brand Colors ─────────────────────────────────── */
  --color-navy-900: #1B2A4A;
  --color-navy-800: #243B5E;
  --color-navy-700: #2E4C72;
  --color-navy-600: #3A5F8A;
  --color-navy-500: #4A7AB8;
  --color-navy-400: #6B96CC;
  --color-navy-300: #94B4DC;
  --color-navy-200: #BDD2EB;
  --color-navy-100: #D6E0EF;
  --color-navy-50: #F0F4FA;

  /* ─── Action / CTA Colors ──────────────────────────── */
  --color-blue-600: #2563EB;
  --color-blue-700: #1D4ED8;
  --color-blue-100: #DBEAFE;
  --color-blue-50: #EFF6FF;

  /* ─── Accent / Trust (Gold) ────────────────────────── */
  --color-gold-500: #D4A843;
  --color-gold-400: #E0B959;
  --color-gold-300: #EAC978;
  --color-gold-100: #F5EDD2;
  --color-gold-50: #FBF5E8;

  /* ─── Feedback / Semantic Colors ───────────────────── */
  --color-success: #059669;
  --color-success-light: #D1FAE5;
  --color-error: #DC2626;
  --color-error-light: #FEE2E2;
  --color-warning: #D97706;
  --color-warning-light: #FEF3C7;

  /* ─── Neutral / Slate Palette ──────────────────────── */
  --color-neutral-900: #1E293B;
  --color-neutral-800: #334155;
  --color-neutral-700: #475569;
  --color-neutral-600: #64748B;
  --color-neutral-500: #94A3B8;
  --color-neutral-400: #CBD5E1;
  --color-neutral-300: #D1D5DB;
  --color-neutral-200: #E2E8F0;
  --color-neutral-100: #F1F5F9;
  --color-neutral-50: #F8FAFC;

  /* ─── Typography ──────────────────────────────────── */
  --font-family-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;

  --font-weight-thin: 100;
  --font-weight-extralight: 200;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;

  /* ─── Border Radius ────────────────────────────────── */
  --radius-sm: 0.25rem;     /* 4px */
  --radius-md: 0.375rem;    /* 6px  */
  --radius-lg: 0.5rem;      /* 8px  */
  --radius-xl: 0.75rem;     /* 12px */
  --radius-2xl: 1rem;       /* 16px */
  --radius-3xl: 1.5rem;     /* 24px */

  /* ─── Shadows ──────────────────────────────────────── */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* ─── Spacing Extras ────────────────────────────────── */
  --spacing-18: 4.5rem;    /* 72px */
  --spacing-20: 5rem;      /* 80px */
  --spacing-24: 6rem;      /* 96px */

  /* ─── Container Max Width ──────────────────────────── */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1200px;   /* Custom: site max width */
}
```

---

## Usage Examples

### Buttons

```tsx
/* Primary CTA */
<button className="w-full rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
  Get Your Free Quote
</button>

/* Gold Accent Button */
<button className="rounded-lg bg-gold-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gold-400">
  Premium Offer
</button>

/* Secondary Outline */
<button className="rounded-lg border-2 border-navy-900 px-6 py-3 text-base font-semibold text-navy-900 hover:bg-navy-50">
  Learn More
</button>
```

### Cards

```tsx
/* Lead Capture Card */
<div className="mx-auto max-w-2xl rounded-2xl bg-white shadow-xl ring-1 ring-neutral-200">
  <div className="border-b border-neutral-200 px-8 py-6">
    <h2 className="text-2xl font-bold text-neutral-900">Get Your Free Quote</h2>
    <p className="mt-1 text-sm text-neutral-600">Fill out the form below.</p>
  </div>
  <div className="px-8 py-6">
    {/* Form fields here */}
  </div>
</div>

/* Dashboard Stat Card */
<div className="rounded-xl bg-white p-6 shadow-sm">
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-100">
    <Icon className="h-5 w-5 text-navy-900" />
  </div>
  <p className="mt-4 text-2xl font-bold text-neutral-900">234</p>
  <p className="text-sm text-neutral-600">Total Leads</p>
</div>
```

### Form Inputs

```tsx
/* Standard Input */
<div>
  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-neutral-700">
    Full Name <span className="text-error">*</span>
  </label>
  <input
    type="text"
    id="name"
    className="block w-full rounded-lg border border-neutral-400 px-4 py-2.5 text-neutral-900 shadow-sm
               placeholder:text-neutral-600
               focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
    placeholder="John Doe"
  />
  {error && <p className="mt-1 text-sm text-error">{error}</p>}
</div>
```

### Trust Pills

```tsx
/* Hero section trust indicators */
<div className="flex flex-wrap justify-center gap-6 text-sm text-neutral-600">
  <span className="flex items-center gap-2">
    <svg className="h-4 w-4 text-success" ...><path .../></svg>
    Licensed Agents Only
  </span>
  <span className="flex items-center gap-2">
    <svg className="h-4 w-4 text-success" ...><path .../></svg>
    High-Intent Prospects
  </span>
</div>
```

### Text / Headings

```tsx
/* Hero H1 */
<h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
  Get Pre-Qualified <span className="text-blue-600">Insurance Leads</span>
  <br />
  Delivered to Your CRM
</h1>

/* Section H2 */
<h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
  How It Works
</h2>

/* Body text */
<p className="text-base leading-relaxed text-neutral-700">
  {/* Copy here */}
</p>

/* Fine print */
<p className="text-xs font-light text-neutral-500">
  Your information is secure and will never be sold.
</p>
```

### Layout Helpers

```tsx
/* Page wrapper */
<div className="mx-auto max-w-[1200px] px-6">
  {/* content */}
</div>

/* Two-column hero (desktop) */
<section className="grid items-center gap-8 lg:grid-cols-5">
  <div className="lg:col-span-3">{/* Value prop */}</div>
  <div className="lg:col-span-2">{/* Form card */}</div>
</section>

/* Dashboard sidebar */
<aside className="flex h-dvh w-[260px] flex-col bg-navy-900">
  <div className="p-6">{/* Logo */}</div>
  <nav className="flex-1 space-y-1 px-4">
    <a className="flex items-center gap-3 rounded-lg bg-navy-700 px-4 py-2.5 text-sm font-medium text-white">
      {/* Active nav item */}
    </a>
    <a className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-800">
      {/* Inactive nav item */}
    </a>
  </nav>
  <div className="border-t border-navy-700 p-4">
    {/* User info */}
  </div>
</aside>
```

---

## What Stays Default

Tailwind v4 already provides excellent defaults for these — no overrides needed:

- **Transition durations & timing functions** (`duration-150`, `ease-in-out`, etc.)
- **Grid utilities** (`grid-cols-2`, `gap-6`, etc.)
- **Flex utilities** (`flex`, `items-center`, `justify-between`, etc.)
- **Responsive breakpoints** (`sm:`, `md:`, `lg:`, `xl:`)
- **Z-index utilities** (`z-10`, `z-50`, etc.)
- **Opacity utilities** (`opacity-60`, `opacity-100`)
- **Cursor utilities** (`cursor-pointer`, `cursor-not-allowed`)

---

## Key Design Tokens Reference

| Utility | Value | Where to Use |
|---------|-------|-------------|
| `bg-navy-900` | `#1B2A4A` | Header, footer, sidebar |
| `bg-blue-600` | `#2563EB` | Primary CTA buttons |
| `bg-gold-500` | `#D4A843` | Trust badges, highlights |
| `bg-success` | `#059669` | Submit buttons, check marks |
| `text-neutral-900` | `#1E293B` | Body text, headings |
| `text-neutral-600` | `#64748B` | Secondary text, placeholders |
| `border-neutral-400` | `#CBD5E1` | Form field borders |
| `font-sans` | Inter | All text |
| `rounded-lg` | 8px | Buttons, inputs |
| `rounded-2xl` | 16px | Cards |
| `shadow-xl` | Large | Form card |

---

## Loading Google Fonts

Add this to the `<head>` of your HTML document (likely in `src/routes/__root.tsx` or wherever your root layout lives):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
```

In TanStack Start, use a `<head>` meta export or the `meta` function in your root route:

```tsx
// src/routes/__root.tsx
import { createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  head: () => ({
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" },
    ],
  }),
});
```