---
name: Garuda Academy Management
colors:
  surface: '#f7f9ff'
  surface-dim: '#d2dbe6'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ecf4ff'
  surface-container: '#e6effa'
  surface-container-high: '#e0e9f5'
  surface-container-highest: '#dae3ef'
  on-surface: '#141c25'
  on-surface-variant: '#5a403c'
  inverse-surface: '#29313a'
  inverse-on-surface: '#e9f2fd'
  outline: '#8e706b'
  outline-variant: '#e3beb8'
  surface-tint: '#b52619'
  primary: '#610000'
  on-primary: '#ffffff'
  primary-container: '#8b0000'
  on-primary-container: '#ff907f'
  inverse-primary: '#ffb4a8'
  secondary: '#585f67'
  on-secondary: '#ffffff'
  secondary-container: '#dce3ec'
  on-secondary-container: '#5e656d'
  tertiary: '#2a2d2e'
  on-tertiary: '#ffffff'
  tertiary-container: '#404344'
  on-tertiary-container: '#aeafb0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#920703'
  secondary-fixed: '#dce3ec'
  secondary-fixed-dim: '#c0c7d0'
  on-secondary-fixed: '#151c23'
  on-secondary-fixed-variant: '#40474f'
  tertiary-fixed: '#e1e3e4'
  tertiary-fixed-dim: '#c5c7c8'
  on-tertiary-fixed: '#191c1d'
  on-tertiary-fixed-variant: '#454748'
  background: '#f7f9ff'
  on-background: '#141c25'
  surface-variant: '#dae3ef'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  max-width: 1440px
---

## Brand & Style

This design system is built for **PS. Garuda Amarta**, embodying the discipline, honor, and precision of martial arts. The brand personality is **Authoritative**, **Stoic**, and **Institutional**. It bridges the gap between traditional dojo heritage and modern administrative efficiency.

The visual style follows a **Modern-Corporate** approach with **Minimalist** tendencies. It avoids unnecessary ornamentation, focusing instead on structural integrity and clarity. The UI should evoke a sense of high trust and formal discipline, suitable for managing sensitive financial data and student progress. Layouts are strictly organized, reflecting the orderly nature of martial arts training.

## Colors

The palette is rooted in a triad of power and clarity:
- **Deep Crimson (#8B0000):** Used for primary actions, branding accents, and highlighting achievement. It represents the "Garuda" spirit—strength and courage.
- **Charcoal Gray (#2F363D):** Used for primary text, navigation backgrounds, and structural elements. It provides an authoritative, grounded anchor to the UI.
- **White (#FFFFFF) & Subtle Gray (#F4F4F4):** These form the canvas, ensuring the "clean" aesthetic is maintained and data remains legible.

Functional colors for status (financial alerts or attendance) should be desaturated to maintain the professional tone, avoiding neon or overly bright hues.

## Typography

This design system utilizes **Hanken Grotesk** as the primary typeface. Its sharp terminals and contemporary geometric construction offer a "disciplined" look that is highly legible in dense administrative views.

For technical data, financial figures, and ID tags, **JetBrains Mono** is introduced to provide a utilitarian, precise feel. This distinction helps administrators quickly differentiate between descriptive content and hard data points. 

**Hierarchy Rules:**
- Use Bold weights (700) sparingly for primary brand moments.
- Semibold (600) is the standard for section headers.
- All-caps styling with increased letter spacing should be applied to `label-sm` for table headers and category tags.

## Layout & Spacing

The layout employs a **Fixed Grid** system for desktop to maintain a sense of controlled, institutional structure. 

- **Desktop (1440px):** 12-column grid, 24px gutters, 40px side margins.
- **Tablet (768px):** 8-column grid, 16px gutters, 24px side margins.
- **Mobile (375px):** 4-column grid, 12px gutters, 16px side margins.

A strict **8px base unit** governs all spatial relationships. Vertical rhythm is critical; administrative forms and data tables should use compressed vertical spacing (`sm` or `base`) to maximize information density without sacrificing clarity. Larger "hero" or "stat card" areas should use `lg` spacing to signify importance.

## Elevation & Depth

To maintain a "disciplined" and "flat" aesthetic, this design system avoids heavy shadows. Hierarchy is instead established through **Tonal Layers** and **Low-Contrast Outlines**.

1.  **Level 0 (Base):** Subtle Gray (#F4F4F4) background.
2.  **Level 1 (Cards/Containers):** White (#FFFFFF) surfaces with a 1px solid border in a light gray (#E1E4E8).
3.  **Level 2 (Modals/Popovers):** White surface with a very subtle, sharp shadow (4px blur, 10% opacity Charcoal) to distinguish from the background.

Data visualization elements should never use shadows; they should rely on high-contrast color fills against the white background to communicate values clearly.

## Shapes

The shape language is **Soft (0.25rem)**. This slight rounding takes the "edge" off the industrial gray palette while maintaining a rigid, professional structure. 

- **Standard Buttons & Inputs:** 4px (0.25rem) corner radius.
- **Cards & Large Containers:** 8px (0.5rem) corner radius.
- **Badges/Chips:** 2px or fully square to denote a more "official" or "ranked" status (reminiscent of martial arts belt tags).

Avoid fully pill-shaped or circular elements, as they appear too casual for the intended academy management tone.

## Components

### Buttons
- **Primary:** Deep Crimson background, White text. High contrast, sharp edges.
- **Secondary:** Charcoal Gray background or outline.
- **Tertiary:** Text-only in Crimson or Charcoal, used for less critical actions in data tables.

### Input Fields
Inputs use a white background with a 1px Charcoal outline at 20% opacity. Upon focus, the border thickens to 2px and changes to Deep Crimson. Labels are always positioned above the field using `label-md`.

### Data Tables
Tables are the heart of the system.
- **Headers:** Charcoal background, White `label-sm` (uppercase) text.
- **Rows:** Alternate between White and Subtle Gray. Use 1px horizontal dividers.
- **Cells:** Use `jetbrainsMono` for all numeric values (attendance count, fee amounts).

### Status Chips
Used for payment status (Paid, Overdue, Pending). Use a "tag" shape (square corners) with a background color at 10% opacity and text at 100% opacity of the same hue (e.g., Dark Green for 'Paid').

### Progress Indicators
For student rank/belt progression, use a solid linear bar. The filled portion should be the color of the student's current belt level, while the unfilled portion is the background gray.

### Dashboards
Financial roles require "Stat Cards" which feature a large Crimson numeric value, a JetBrains Mono label, and a sparkline chart for 30-day trends.