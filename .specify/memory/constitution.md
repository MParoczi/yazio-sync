<!--
SYNC IMPACT REPORT
==================
Version Change: N/A → 1.0.0
Modified Principles: N/A (Initial creation)
Added Sections:
  - Core Principles (5 principles)
  - Design & UX Standards
  - Performance Requirements
  - Governance
Removed Sections: N/A
Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section aligns with principles
  ✅ spec-template.md - User scenarios align with UX consistency principle
  ✅ tasks-template.md - Task structure supports performance and quality gates
Follow-up TODOs: None
-->

# YAZIO Sync Constitution

## Core Principles

### I. Code Quality & Type Safety

TypeScript strict mode MUST be enforced across all code. All components, functions, and services MUST have explicit type annotations. No usage of `any` type except when interfacing with untyped third-party libraries, and even then it MUST be wrapped with proper type guards or assertions.

**Rationale**: Type safety prevents runtime errors, improves IDE support, enables confident refactoring, and serves as living documentation. In a data synchronization application handling nutritional data, type safety is critical to prevent data corruption.

**Requirements**:
- All functions must have return type annotations
- All React component props must be explicitly typed
- ESLint must enforce type-checking rules
- No TypeScript errors allowed in production builds

### II. Responsive Design Excellence

All UI components MUST work seamlessly across desktop (1920px+), tablet (768px-1919px), and mobile (320px-767px) viewports. Touch targets MUST be minimum 44×44px on mobile. Typography MUST scale appropriately using responsive units (rem, em, clamp).

**Rationale**: Users track nutrition on-the-go and at home. A single codebase serving all devices reduces maintenance burden and ensures feature parity. Mobile-first thinking ensures core functionality works on constrained devices.

**Requirements**:
- Mobile-first CSS approach (min-width media queries)
- Test all features on physical mobile device or accurate emulator
- Tailwind responsive prefixes (sm:, md:, lg:, xl:) used consistently
- No horizontal scroll on any supported viewport width
- Touch-friendly interactions on mobile (no hover-only features)

### III. Glassmorphism Design Language

All UI elements MUST follow glassmorphism design principles: semi-transparent backgrounds with backdrop-blur, subtle borders, layered depth through shadows and transparency, and appropriate contrast for accessibility.

**Rationale**: Glassmorphism provides a modern, elegant aesthetic that distinguishes the application while maintaining readability. The semi-transparent layering creates visual hierarchy without heavy visual weight.

**Requirements**:
- Backgrounds: `backdrop-blur-md` or higher with opacity 0.6-0.9
- Borders: subtle, often white/black with 10-20% opacity
- Shadows: multi-layered for depth (e.g., `shadow-lg`, `shadow-2xl`)
- WCAG AA contrast minimum 4.5:1 for text on glass backgrounds
- Consistent glass component library (cards, modals, navigation)

### IV. Performance Budget Compliance

Pages MUST achieve Lighthouse performance score ≥90. First Contentful Paint (FCP) MUST be <1.5s on 3G. Time to Interactive (TTI) MUST be <3.5s. Bundle size MUST not exceed 200KB (gzipped) for initial page load.

**Rationale**: Users often check nutrition data in varied network conditions. Fast load times directly correlate with user retention and satisfaction. Performance is a feature, not an optimization.

**Requirements**:
- Next.js Image component for all images (automatic optimization)
- Code splitting for routes and heavy components
- Lazy loading for below-fold content
- Font optimization using next/font
- Regular Lighthouse audits in CI/CD
- Server components default, client components only when necessary

### V. User Experience Consistency

All user interactions MUST provide immediate visual feedback. Loading states MUST be shown for operations >300ms. Error messages MUST be user-friendly, actionable, and positioned near the relevant UI element. Success confirmations MUST be clear but non-intrusive.

**Rationale**: Consistent feedback patterns build user trust and reduce cognitive load. Users should never wonder if their action registered or what went wrong. Predictable interactions create a professional, polished experience.

**Requirements**:
- Loading indicators for async operations (spinners, skeletons, progress bars)
- Optimistic UI updates where possible (update UI immediately, rollback on error)
- Toast notifications for background operations
- Inline validation for forms (real-time feedback)
- Consistent animation durations (150ms quick, 300ms standard, 500ms slow)
- Focus management for accessibility (keyboard navigation)

## Design & UX Standards

### Color System
- Dark mode MUST be supported via `prefers-color-scheme`
- Glass backgrounds MUST work in both light and dark themes
- Color palette defined in `globals.css` CSS variables
- Semantic colors for success, warning, error, info states

### Typography
- Geist Sans for UI text (already configured)
- Geist Mono for code/data display (already configured)
- Responsive type scale using `clamp()` for fluid typography
- Maximum line length: 65-75 characters for readability

### Spacing & Layout
- Consistent spacing scale (Tailwind default: 4px base unit)
- Grid-based layouts for data-heavy screens
- Flexbox for component-level layouts
- Adequate white space to prevent visual clutter

### Accessibility
- Semantic HTML (proper heading hierarchy, landmarks)
- ARIA labels where necessary
- Keyboard navigation support
- Screen reader testing for critical flows

## Performance Requirements

### Build Optimization
- Tree-shaking enabled for unused code elimination
- Dynamic imports for code splitting
- Image optimization (WebP, AVIF with fallbacks)
- CSS purging via Tailwind (production builds)

### Runtime Performance
- React.memo() for expensive component re-renders
- useMemo/useCallback for expensive computations
- Virtualization for long lists (react-window or similar)
- Debouncing for search/filter inputs

### Monitoring
- Core Web Vitals tracking (FCP, LCP, CLS, FID)
- Error boundary implementation for graceful failures
- Performance monitoring in production (optional: Vercel Analytics, Sentry)

## Governance

### Amendment Process
Constitution changes require:
1. Documented justification explaining why change is needed
2. Impact analysis on existing features and templates
3. Version bump following semantic versioning (MAJOR.MINOR.PATCH)
4. Update to dependent templates (plan, spec, tasks)

### Compliance Verification
All pull requests MUST verify:
- TypeScript compilation with zero errors
- ESLint passes with zero warnings
- Lighthouse performance score ≥90
- Responsive design tested on mobile viewport
- Glassmorphism design language consistency

### Complexity Justification
Any violation of these principles MUST be documented in the plan.md "Complexity Tracking" table with:
- Which principle is violated
- Why the violation is necessary
- What simpler alternative was rejected and why

**Version**: 1.0.0 | **Ratified**: 2025-12-12 | **Last Amended**: 2025-12-12
