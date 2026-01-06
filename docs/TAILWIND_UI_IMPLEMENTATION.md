# Tailwind UI Implementation Guide

## Overview
This guide explains how to integrate Tailwind UI components into the onboarding wizard application. All Tailwind UI code has been downloaded and the design system has been documented.

---

## Setup Complete ✅

### 1. Inter Font
- ✅ Added Inter font via CDN in `app/layout.tsx`
- ✅ Configured Tailwind CSS to use InterVariable in `app/globals.css`
- ✅ Font features enabled: cv02, cv03, cv04, cv11

### 2. Design System
- ✅ Created comprehensive design system documentation in `/docs/DESIGN_SYSTEM.md`
- ✅ Defined color palette with semantic mappings
- ✅ Established typography scale
- ✅ Documented component patterns
- ✅ Defined spacing, shadows, and transitions

### 3. UI Component Library
Created reusable components in `/src/components/ui/`:
- ✅ `Badge.tsx` - Status badges with variants
- ✅ `Button.tsx` - Primary, secondary, danger variants
- ✅ `Alert.tsx` - Success, error, warning, info alerts
- ✅ `ProgressBar.tsx` - Progress indicators with wizard-specific variant
- ✅ `Card.tsx` - Card layout components

---

## Migration Strategy

### Phase 1: Core UI Components (Priority 1)
Replace inline styles in existing pages with Tailwind UI components.

#### Files to Update:
1. **Landing Page** ([app/page.tsx](app/page.tsx))
   - Replace inline link styles with Button component
   - Add Card components for feature list
   - Use proper heading styles

2. **Projects Page** ([src/app/projects/page.tsx](src/app/projects/page.tsx))
   - Replace inline card styles with Card component
   - Use Badge for project metadata
   - Add proper hover states

3. **Wizard Instance Page** ([src/app/projects/[projectId]/wizards/[wizardInstanceId]/page.tsx](src/app/projects/[projectId]/wizards/[wizardInstanceId]/page.tsx))
   - Replace progress display with WizardProgress component
   - Use StatusBadge for wizard status
   - Replace buttons with Button component
   - Add Alert components for messages

4. **Wizard Inputs Client** ([src/app/projects/[projectId]/wizards/[wizardInstanceId]/WizardInputsClient.tsx](src/app/projects/[projectId]/wizards/[wizardInstanceId]/WizardInputsClient.tsx))
   - Replace input inline styles with proper form classes
   - Add Alert for error states
   - Use Button for save actions

### Phase 2: Enhanced Components (Priority 2)
Add more sophisticated Tailwind UI components.

#### Components Needed:
1. **Application Shell** - Sidebar navigation with logo
   - Use for main app layout
   - Add navigation to Projects, Settings
   - Include user profile section

2. **Breadcrumbs** - Navigation trail
   - Project → Wizards → Instance
   - Home icon for root

3. **Empty States** - When no data exists
   - "No projects yet" state
   - "No wizard instances" state

4. **Form Layouts** - Better form structure
   - Grouped form sections
   - Proper field spacing
   - Help text and validation

### Phase 3: Advanced Features (Priority 3)
Add advanced UI patterns.

#### Components Needed:
1. **Modals** - For confirmations
   - Delete confirmation
   - Discard changes warning

2. **Dropdown Menus** - For actions
   - Project actions (edit, delete, archive)
   - Wizard actions

3. **Tabs** - For organizing content
   - Wizard details vs. Outputs
   - Settings sections

4. **Tables** - For list views
   - Better project listing
   - Wizard instance listing

---

## Implementation Examples

### Example 1: Update Landing Page

**Before** (inline styles):
```tsx
<Link
  href="/projects"
  style={{
    padding: '12px 24px',
    background: '#4F46E5',
    color: 'white',
    // ...
  }}
>
  View Projects
</Link>
```

**After** (Tailwind UI):
```tsx
import { Button } from '@/components/ui'
import Link from 'next/link'

<Link href="/projects">
  <Button variant="primary" size="lg">
    View Projects
  </Button>
</Link>
```

### Example 2: Update Progress Display

**Before** (inline styles):
```tsx
<div style={{ marginBottom: '16px' }}>
  <span>Progress: {progress}%</span>
  <div style={{ background: '#E5E7EB', borderRadius: '9999px' }}>
    <div
      style={{
        width: `${progress}%`,
        background: '#4F46E5',
        // ...
      }}
    />
  </div>
</div>
```

**After** (Tailwind UI):
```tsx
import { WizardProgress } from '@/components/ui'

<WizardProgress
  completedSteps={completedSteps}
  totalSteps={totalSteps}
  percentage={progress}
/>
```

### Example 3: Update Status Badge

**Before** (inline styles):
```tsx
<span
  style={{
    padding: '4px 8px',
    borderRadius: '6px',
    background: '#EEF2FF',
    color: '#4338CA',
  }}
>
  {status}
</span>
```

**After** (Tailwind UI):
```tsx
import { StatusBadge } from '@/components/ui'

<StatusBadge status={status} />
```

### Example 4: Add Error Alert

**New Addition**:
```tsx
import { Alert } from '@/components/ui'

{error && (
  <Alert variant="error" title="Error saving wizard">
    {error}
  </Alert>
)}
```

---

## Available Tailwind UI Patterns

### Application UI Components

#### **Shells**
- Sidebar with navigation (mobile-responsive)
- Top navigation bar
- Combined sidebar + top bar

#### **Forms**
- Stacked form layouts
- Grid-based form sections
- Input groups with addons
- Select dropdowns (native + Headless UI)
- Checkboxes with descriptions
- Radio groups with descriptions
- Textarea inputs
- Error state patterns

#### **Headings & Page Headers**
- Page titles with actions
- Breadcrumb navigation
- Profile headers
- Stats overview sections

#### **Lists**
- Card grids (projects)
- Simple lists (people/team)
- Stacked lists with avatars
- Table layouts (grouped, sortable)

#### **Feedback**
- Alert banners (success, error, warning, info)
- Empty states with illustrations
- Loading states
- Toast notifications

#### **Navigation**
- Sidebar navigation (collapsible)
- Tabs (underline, pills)
- Breadcrumbs
- Pagination

#### **Overlays**
- Modal dialogs (confirmation, form)
- Slide-overs (side panels)
- Dropdowns (actions, menus)

#### **Data Display**
- Stats cards
- Description lists
- Timeline/activity feeds
- Progress indicators
- Calendars

---

## Design Tokens Reference

### Colors - Wizard Status Mapping
```tsx
const statusConfig = {
  DRAFT: {
    badge: 'bg-gray-100 text-gray-700 ring-gray-500/10',
    dot: 'bg-gray-400'
  },
  ACTIVE: {
    badge: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    dot: 'bg-blue-400'
  },
  WAITING_ON_CUSTOMER: {
    badge: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
    dot: 'bg-yellow-400'
  },
  COMPLETED: {
    badge: 'bg-green-50 text-green-700 ring-green-600/20',
    dot: 'bg-green-400'
  },
  ARCHIVED: {
    badge: 'bg-gray-100 text-gray-500 ring-gray-500/10',
    dot: 'bg-gray-300'
  }
}
```

### Common Patterns

#### Form Field
```tsx
<div>
  <label htmlFor="field" className="block text-sm/6 font-medium text-gray-900">
    Label
  </label>
  <div className="mt-2">
    <input
      type="text"
      name="field"
      id="field"
      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
    />
  </div>
</div>
```

#### Action Buttons
```tsx
<div className="flex items-center justify-end gap-x-6">
  <button
    type="button"
    className="text-sm/6 font-semibold text-gray-900"
  >
    Cancel
  </button>
  <button
    type="submit"
    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
  >
    Save
  </button>
</div>
```

---

## Next Steps

### Immediate Tasks
1. ✅ Install Heroicons: `npm install @heroicons/react`
2. ✅ Update font configuration (completed)
3. ✅ Create UI component library (completed)
4. ⏳ Update landing page to use Tailwind UI
5. ⏳ Update projects page to use Card components
6. ⏳ Update wizard page with proper form layouts
7. ⏳ Re-enable WizardOutputsClient with proper styling

### Testing Checklist
After each component migration:
- [ ] Desktop responsive (1280px+)
- [ ] Tablet responsive (768px-1024px)
- [ ] Mobile responsive (320px-767px)
- [ ] Focus states work correctly
- [ ] Color contrast meets WCAG AA
- [ ] All interactive elements keyboard accessible

---

## Component Library Structure

```
src/
├── components/
│   └── ui/
│       ├── Alert.tsx          ✅ Created
│       ├── Badge.tsx          ✅ Created
│       ├── Button.tsx         ✅ Created
│       ├── Card.tsx           ✅ Created
│       ├── ProgressBar.tsx    ✅ Created
│       ├── index.ts           ✅ Created
│       └── [Future components]
│           ├── Modal.tsx
│           ├── Dropdown.tsx
│           ├── Breadcrumbs.tsx
│           ├── EmptyState.tsx
│           ├── FormField.tsx
│           └── Table.tsx
```

---

## Resources

- Design System: `/docs/DESIGN_SYSTEM.md`
- Tailwind CSS Docs: https://tailwindcss.com/docs
- Heroicons: https://heroicons.com
- Headless UI: https://headlessui.com
- Inter Font: https://rsms.me/inter/

---

## Notes

- All Tailwind UI code is saved in this conversation for reference
- Components use Headless UI for accessibility
- All patterns follow WCAG 2.1 AA standards
- Mobile-first responsive design throughout
- Focus states configured for keyboard navigation
