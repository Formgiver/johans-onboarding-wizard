# UX/UI Architecture

> Last updated: January 2026

This document describes the UX architecture, navigation patterns, and design decisions
for Johan's Onboarding Wizard.

## Design Principles

### 1. Orientation First
Users must always know:
- Where they are in the application
- Which project they are viewing
- What stage they are at in the onboarding process

**Implementation:** Breadcrumbs in the AppShell header, consistent page titles.

### 2. Progress Over Content
Progress, status, and next action are more important than raw data.

**Implementation:** 
- ProgressRing components prominently displayed
- Status badges on all lists
- "Next action" recommendations on project pages

### 3. Progressive Disclosure
Hide complexity until it is needed. Never overwhelm customers with "everything at once".

**Implementation:**
- Collapsible wizard steps (completed steps collapse)
- Grouped wizard lists (attention → pending → completed)
- Minimal landing page with single CTA

### 4. Consistency Over Novelty
Same interaction → same pattern everywhere.

**Implementation:**
- Consistent card patterns
- Consistent status badge colors
- Unified AppShell layout for all authenticated pages

### 5. Calm Professional Aesthetics
Whitespace, clear hierarchy, subtle emphasis, no visual shouting.

**Implementation:**
- Gray-50 backgrounds
- White cards with subtle ring borders
- Indigo-600 as the primary accent color
- Inter font with proper font features

### 6. Accessibility is Not Optional
Keyboard navigation, focus states, labels, no color-only meaning.

**Implementation:**
- All interactive elements are focusable
- Status badges include both color AND text/icon
- Form inputs have proper labels (sr-only where appropriate)
- Headless UI for accessible mobile navigation

---

## Navigation Structure

```
/ (Landing)
├── /login
└── /projects (requires auth)
    └── /projects/[projectId] (Project Hub)
        └── /projects/[projectId]/wizards (Wizards List)
            └── /projects/[projectId]/wizards/[wizardInstanceId] (Wizard Form)
```

### Page Roles

| Page | Purpose | Key Elements |
|------|---------|--------------|
| Landing | Marketing, single CTA | Hero, value props, feature list |
| Login | Authentication | Email input, magic link flow |
| Projects | Dashboard | Project cards with progress |
| Project Hub | Project overview | Stats, next action, wizard list |
| Wizards List | All wizards for project | Grouped by status |
| Wizard Form | Complete wizard steps | Collapsible step cards |

---

## Layout Components

### AppShell (`src/components/layout/AppShell.tsx`)
The authenticated application shell providing:
- Responsive sidebar navigation (collapsible on mobile)
- Breadcrumb trail in header
- User context and sign-out
- Consistent page padding

**Usage:**
```tsx
<AppShell
  user={{ email: user.email }}
  breadcrumbs={[
    { name: 'Projects', href: '/projects' },
    { name: 'Acme Corp' },
  ]}
>
  {/* Page content */}
</AppShell>
```

### Breadcrumbs (`src/components/layout/Breadcrumbs.tsx`)
Contextual navigation showing the user's location in the hierarchy.

### PageHeader (`src/components/layout/PageHeader.tsx`)
Standard layout for page titles with optional actions and metadata.

---

## Status System

### Wizard Status
| Status | Color | Meaning |
|--------|-------|---------|
| `not_started` | Gray | Wizard has not been started |
| `in_progress` | Blue | Wizard is currently being worked on |
| `blocked` | Amber | Wizard requires attention |
| `completed` | Green | Wizard has been completed |

### Step Status
| Status | Color | Meaning |
|--------|-------|---------|
| `pending` | Gray | Step has not been started |
| `in_progress` | Blue | Step is currently being worked on |
| `completed` | Green | Step has been completed |
| `skipped` | Gray | Step was skipped |

---

## Component Library

### Status Components
- `StatusBadge` - Pill badge with icon and label
- `StatusDot` - Minimal dot + text indicator
- `ProgressRing` - Circular progress indicator
- `ProgressBar` - Horizontal progress bar

### Feedback Components
- `EmptyState` - Consistent empty state messaging
- `LoadingSpinner`, `LoadingPage`, `LoadingCards` - Loading states
- `Alert` - Contextual feedback messages

### Layout Components
- `Card`, `CardHeader`, `CardBody`, `CardFooter`
- `Button` - Primary, secondary, danger variants
- `Badge` - Generic colored badges

---

## Page-by-Page Design

### Landing Page (`app/page.tsx`)
- Minimal marketing approach
- Clear product purpose: "Professional customer onboarding"
- Single primary CTA: "Get started"
- Three value propositions for different user types
- Simple feature checklist
- Indigo CTA banner at bottom

### Login Page (`app/login/page.tsx`)
- Extremely calm and focused
- Email input with icon
- Clear explanation of magic link flow
- Success state shows step-by-step instructions
- Security note about passwordless auth

### Projects Page (`app/projects/page.tsx`)
- Project cards with ProgressRing
- Status badge and wizard count
- Hover effect to indicate clickability
- Empty state for new users

### Project Hub (`app/projects/[projectId]/page.tsx`)
- Stats grid: Total, Completed, In Progress, Blocked
- "Next Action" recommendation card
- Wizard list preview (first 5)
- Large ProgressRing in header

### Wizards List (`app/projects/[projectId]/wizards/page.tsx`)
- Grouped by status:
  1. Needs Attention (blocked + in_progress)
  2. Not Started
  3. Completed
- Progress bar visible on each row
- Section headers with icons

### Wizard Form (`app/projects/[projectId]/wizards/[wizardInstanceId]/page.tsx`)
- Progress summary card at top
- Steps remaining indicator
- Collapsible step cards:
  - Completed steps show summary and collapse
  - Active step is expanded
  - Each step has save button
  - Clear saved/unsaved indicators
- Required steps marked with asterisk

---

## Responsive Behavior

- **Desktop (lg+):** Static sidebar, full navigation
- **Tablet (md):** Collapsed sidebar, hamburger menu
- **Mobile (sm):** Full-width cards, hamburger menu, stacked layouts

---

## Color Reference

| Use | Tailwind Class |
|-----|----------------|
| Primary action | `bg-indigo-600` |
| Primary hover | `bg-indigo-500` |
| Success | `text-green-600`, `bg-green-50` |
| Warning/Blocked | `text-amber-600`, `bg-amber-50` |
| Error | `text-red-600`, `bg-red-50` |
| In Progress | `text-blue-600`, `bg-blue-50` |
| Neutral | `text-gray-600`, `bg-gray-50` |
| Page background | `bg-gray-50` |
| Card background | `bg-white` |
| Card border | `ring-1 ring-gray-900/5` |
