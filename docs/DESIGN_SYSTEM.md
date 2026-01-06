# Design System

## Overview
This document defines the design system for the Onboarding Wizard application. All UI components follow these guidelines to ensure consistency, accessibility, and maintainability.

---

## Typography

### Font Family
- **Primary**: InterVariable (sans-serif)
- **Fallback**: system-ui, -apple-system, BlinkMacSystemFont, sans-serif
- **Font Features**: 'cv02', 'cv03', 'cv04', 'cv11' enabled for Inter

### Type Scale
```
text-xs     12px / 16px    Small labels, captions
text-sm     14px / 20px    Body text, form inputs
text-base   16px / 24px    Default body text
text-lg     18px / 28px    Emphasized text
text-xl     20px / 28px    Section headings
text-2xl    24px / 32px    Page titles
text-3xl    30px / 36px    Hero text
```

### Font Weights
- Regular: `font-normal` (400)
- Medium: `font-medium` (500)
- Semibold: `font-semibold` (600)
- Bold: `font-bold` (700)

---

## Color Palette

### Primary (Indigo)
- **Primary/50**: `bg-indigo-50` - Lightest backgrounds
- **Primary/600**: `bg-indigo-600` - Primary buttons, links
- **Primary/700**: `bg-indigo-700` - Hover states
- **Primary/800**: `bg-indigo-800` - Active states

### Neutral (Gray)
- **Gray/50**: `bg-gray-50` - Page backgrounds, cards
- **Gray/100**: `bg-gray-100` - Subtle backgrounds
- **Gray/200**: `bg-gray-200` - Borders, dividers
- **Gray/300**: `bg-gray-300` - Disabled states
- **Gray/400**: `text-gray-400` - Placeholders, icons
- **Gray/500**: `text-gray-500` - Secondary text
- **Gray/700**: `text-gray-700` - Body text
- **Gray/900**: `text-gray-900` - Headings, primary text
- **Gray/950**: `bg-gray-950` - Dark mode backgrounds

### Semantic Colors

#### Success (Green)
- **Green/50**: `bg-green-50` - Success alert backgrounds
- **Green/400**: `bg-green-400` - Status indicators
- **Green/600**: `text-green-600` - Success text
- **Green/700**: `text-green-700` - Success emphasis

#### Warning (Yellow)
- **Yellow/50**: `bg-yellow-50` - Warning backgrounds
- **Yellow/400**: `bg-yellow-400` - Warning indicators
- **Yellow/600**: `text-yellow-600` - Warning text
- **Yellow/800**: `text-yellow-800` - Warning emphasis

#### Error (Red)
- **Red/50**: `bg-red-50` - Error backgrounds
- **Red/400**: `bg-red-400` - Error indicators
- **Red/600**: `bg-red-600` - Error text, buttons
- **Red/700**: `text-red-700` - Error emphasis

#### Info (Blue)
- **Blue/50**: `bg-blue-50` - Info backgrounds
- **Blue/400**: `bg-blue-400` - Info indicators
- **Blue/600**: `text-blue-600` - Info text
- **Blue/700**: `text-blue-700` - Info emphasis

### Status Mapping
Map wizard statuses to semantic colors:

| Status | Color | Classes |
|--------|-------|---------|
| DRAFT | Gray | `bg-gray-100 text-gray-700` |
| ACTIVE | Blue | `bg-blue-50 text-blue-700 ring-blue-600/20` |
| WAITING_ON_CUSTOMER | Yellow | `bg-yellow-50 text-yellow-800 ring-yellow-600/20` |
| COMPLETED | Green | `bg-green-50 text-green-700 ring-green-600/20` |
| ARCHIVED | Gray | `bg-gray-100 text-gray-500` |

---

## Spacing

### Scale
```
0.5    2px     Hairline spacing
1      4px     Minimal spacing
2      8px     Tight spacing
3      12px    Compact spacing
4      16px    Default spacing
5      20px    Comfortable spacing
6      24px    Spacious spacing
8      32px    Large spacing
10     40px    Extra large spacing
12     48px    Section spacing
16     64px    Page section spacing
20     80px    Hero spacing
```

### Component Spacing Guidelines
- **Form fields**: `space-y-6` (24px vertical)
- **Card padding**: `p-6` (24px all sides)
- **Button padding**: `px-3 py-2` (12px horizontal, 8px vertical)
- **Page margins**: `px-4 sm:px-6 lg:px-8`

---

## Component Patterns

### Buttons

#### Primary Button
```tsx
className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
```

#### Secondary Button
```tsx
className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50"
```

#### Sizes
- **Small**: `px-2 py-1 text-xs`
- **Medium**: `px-3 py-2 text-sm` (default)
- **Large**: `px-4 py-2.5 text-sm`

### Form Inputs

#### Text Input
```tsx
className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
```

#### Label
```tsx
className="block text-sm/6 font-medium text-gray-900"
```

#### Error State
```tsx
className="block w-full rounded-md bg-white py-1.5 pr-10 pl-3 text-red-900 outline-1 -outline-offset-1 outline-red-300 placeholder:text-red-300 focus:outline-2 focus:-outline-offset-2 focus:outline-red-600 sm:text-sm/6"
```

### Cards

#### Basic Card
```tsx
className="overflow-hidden rounded-lg bg-white shadow-xs outline-1 outline-gray-900/5"
```

#### Interactive Card
```tsx
className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-xs focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:border-gray-400"
```

### Badges

#### Status Badge Template
```tsx
className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
```

#### Colors
- **Gray**: `bg-gray-50 text-gray-600 ring-gray-500/10`
- **Red**: `bg-red-50 text-red-700 ring-red-600/10`
- **Yellow**: `bg-yellow-50 text-yellow-800 ring-yellow-600/20`
- **Green**: `bg-green-50 text-green-700 ring-green-600/20`
- **Blue**: `bg-blue-50 text-blue-700 ring-blue-700/10`
- **Indigo**: `bg-indigo-50 text-indigo-700 ring-indigo-700/10`

### Alerts

#### Success Alert
```tsx
<div className="rounded-md bg-green-50 p-4">
  <div className="flex">
    <CheckCircleIcon className="size-5 text-green-400" />
    <div className="ml-3">
      <h3 className="text-sm font-medium text-green-800">Title</h3>
      <div className="mt-2 text-sm text-green-700">Message</div>
    </div>
  </div>
</div>
```

#### Error Alert
```tsx
<div className="rounded-md bg-red-50 p-4">
  <div className="flex">
    <XCircleIcon className="size-5 text-red-400" />
    <div className="ml-3">
      <h3 className="text-sm font-medium text-red-800">Title</h3>
      <div className="mt-2 text-sm text-red-700">Message</div>
    </div>
  </div>
</div>
```

#### Warning Alert
```tsx
<div className="rounded-md bg-yellow-50 p-4">
  <div className="flex">
    <ExclamationTriangleIcon className="size-5 text-yellow-400" />
    <div className="ml-3">
      <h3 className="text-sm font-medium text-yellow-800">Title</h3>
      <div className="mt-2 text-sm text-yellow-700">Message</div>
    </div>
  </div>
</div>
```

#### Info Alert
```tsx
<div className="rounded-md bg-blue-50 p-4">
  <div className="flex">
    <InformationCircleIcon className="size-5 text-blue-400" />
    <div className="ml-3">
      <p className="text-sm text-blue-700">Message</p>
    </div>
  </div>
</div>
```

---

## Layout

### Container Widths
```
sm     640px
md     768px
lg     1024px
xl     1280px
2xl    1536px
```

### Breakpoints
```
sm     640px    @media (min-width: 640px)
md     768px    @media (min-width: 768px)
lg     1024px   @media (min-width: 1024px)
xl     1280px   @media (min-width: 1280px)
2xl    1536px   @media (min-width: 1536px)
```

### Page Layout Pattern
```tsx
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-3xl">
    {/* Content */}
  </div>
</div>
```

---

## Shadows

```
shadow-xs     Subtle elevation (cards, buttons)
shadow-sm     Small elevation (dropdowns)
shadow        Default elevation (modals)
shadow-md     Medium elevation (overlays)
shadow-lg     Large elevation (dialogs)
shadow-xl     Extra large elevation (major overlays)
shadow-2xl    Maximum elevation (full-page modals)
```

---

## Border Radius

```
rounded-none  0
rounded-xs    0.125rem   2px    Subtle rounding
rounded-sm    0.25rem    4px    Small rounding
rounded       0.375rem   6px    Default rounding
rounded-md    0.5rem     8px    Medium rounding (most components)
rounded-lg    0.75rem    12px   Large rounding (cards)
rounded-xl    1rem       16px   Extra large rounding
rounded-2xl   1.5rem     24px   Maximum rounding
rounded-full  9999px            Pills, avatars
```

---

## Transitions

### Duration
```
duration-75   75ms     Instant feedback
duration-100  100ms    Quick transitions
duration-150  150ms    Default transitions
duration-200  200ms    Smooth transitions
duration-300  300ms    Emphasized transitions
```

### Easing
```
ease-linear   Linear timing
ease-in       Accelerating
ease-out      Decelerating (preferred for enter)
ease-in-out   Smooth (preferred for bi-directional)
```

### Common Patterns
- **Hover states**: `transition-colors duration-150 ease-in-out`
- **Modals/overlays**: `transition-opacity duration-300 ease-out`
- **Slide animations**: `transition-transform duration-300 ease-in-out`

---

## Accessibility

### Focus States
All interactive elements must have visible focus states:
```tsx
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
```

### ARIA Labels
- Use `aria-label` for icon-only buttons
- Use `aria-describedby` for form field hints
- Use `aria-current="page"` for current navigation item
- Use `role` attributes appropriately

### Contrast Ratios
- **Normal text**: Minimum 4.5:1
- **Large text**: Minimum 3:1
- **UI components**: Minimum 3:1

---

## Icons

### Library
- **Heroicons v2**: Use outline icons for most cases, solid for filled states
- **Size classes**: `size-4` (16px), `size-5` (20px), `size-6` (24px)

### Common Usage
- **Buttons**: `size-5` with `-ml-0.5 mr-1.5`
- **Form inputs**: `size-5` in gray-400
- **Navigation**: `size-6` in gray-400
- **Alerts**: `size-5` in semantic color

---

## Animation Principles

1. **Purposeful**: Animations should guide attention and provide feedback
2. **Quick**: Most transitions should be 150-300ms
3. **Subtle**: Prefer opacity and small transforms over large movements
4. **Consistent**: Use the same timing functions across similar interactions

---

## Dark Mode

### Enable Dark Mode
Add to `<html>` element:
```html
<html class="bg-white dark:bg-gray-950 scheme-light dark:scheme-dark">
```

### Color Adaptations
- Use semantic colors that automatically adapt
- Test all components in both modes
- Ensure sufficient contrast in both modes

---

## Best Practices

### Do's ✅
- Use semantic HTML elements
- Provide sufficient color contrast
- Include focus states on all interactive elements
- Use responsive design patterns
- Keep component complexity low
- Use consistent spacing
- Provide loading and error states

### Don'ts ❌
- Don't use color alone to convey information
- Don't override browser default focus styles without replacement
- Don't nest interactive elements
- Don't use inline styles (use Tailwind classes)
- Don't create overly complex component hierarchies
- Don't skip responsive design considerations

---

## Component Checklist

When creating new components, ensure:
- [ ] Follows typography scale
- [ ] Uses design system colors
- [ ] Has proper spacing
- [ ] Includes hover states
- [ ] Has visible focus states
- [ ] Works on mobile, tablet, desktop
- [ ] Matches semantic color usage
- [ ] Has appropriate shadow/elevation
- [ ] Uses correct border radius
- [ ] Includes ARIA labels where needed
- [ ] Tested in dark mode (if applicable)
- [ ] Loading states defined
- [ ] Error states defined
- [ ] Empty states defined (if applicable)

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com)
- [Heroicons](https://heroicons.com)
- [Inter Font](https://rsms.me/inter/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
