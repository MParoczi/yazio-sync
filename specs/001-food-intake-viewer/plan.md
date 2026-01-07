# Implementation Plan: YAZIO Food Intake Viewer

**Branch**: `001-food-intake-viewer` | **Date**: 2025-12-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-food-intake-viewer/spec.md`

## Summary

Build a read-only Next.js 16 web application that allows users to authenticate with YAZIO credentials and view their daily nutrition consumption data organized by meals (breakfast, lunch, dinner, snack). The application provides macro summaries, historical data browsing via calendar, data export to text files, and visual charts with glassmorphism design optimized for desktop and mobile.

**Technical Approach**: Client-side only Next.js App Router application using the YAZIO npm package for API integration, React Context for state management, localStorage with Web Crypto API for secure token storage, Recharts for data visualization, and Tailwind CSS 4 with custom glassmorphism styling.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 16.0.10, React 19.2.1
**Primary Dependencies**:
- `yazio@1.1.3` - YAZIO API client (authentication, consumption data, goals)
- `recharts` - Charting library for donut and bar charts
- `date-fns` - Date manipulation and formatting
- `react-hot-toast` - Toast notifications for user feedback
- `framer-motion` - Animation library for smooth transitions
- `@heroicons/react` - Icon library
- `tailwindcss@4` - CSS framework with glassmorphism utilities

**Storage**: Browser localStorage (encrypted tokens), in-memory cache (5-minute TTL for nutrition data)
**Testing**: Jest + React Testing Library for component tests, Playwright for E2E tests
**Target Platform**: Web (desktop 1920px+, mobile 320px-767px)
**Project Type**: Single-page web application (SPA) with Next.js App Router
**Performance Goals**:
- Login to dashboard < 10 seconds
- Page load < 2 seconds on 3G
- Historical date selection < 3 seconds
- Export generation < 5 seconds (30-day range)

**Constraints**:
- Client-side only (no backend/API routes)
- Read-only YAZIO data access
- WCAG AA contrast standards (4.5:1) with glassmorphism
- Responsive 320px-2560px without horizontal scroll

**Scale/Scope**:
- 5 user stories (2x P1, 1x P2, 2x P3)
- ~8-10 React components
- 4 primary pages/views
- Single user session (no multi-user support)

## Constitution Check

*No constitution file found - proceeding with standard Next.js best practices.*

**Architectural Principles Applied**:
- Keep It Simple: No backend server, pure client-side rendering
- Separation of Concerns: Services layer for API, hooks for state, components for UI
- Minimal Dependencies: Only essential libraries for charts, dates, animations
- Type Safety: Full TypeScript coverage with Zod schemas from YAZIO package
- Accessibility First: WCAG AA compliance, keyboard navigation, ARIA labels

## Project Structure

### Documentation (this feature)

```text
specs/001-food-intake-viewer/
├── plan.md              # This file
├── spec.md              # Feature specification
├── data-model.md        # Data structures and API contracts (Phase 1)
├── quickstart.md        # Developer setup guide (Phase 1)
├── contracts/           # API integration contracts (Phase 1)
│   ├── yazio-api.md    # YAZIO API endpoint documentation
│   └── storage.md      # LocalStorage encryption contract
└── tasks.md             # Implementation tasks (/speckit.tasks output)
```

### Source Code (repository root)

```text
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing/login page
│   ├── dashboard/
│   │   └── page.tsx             # Main dashboard (P1)
│   ├── globals.css              # Tailwind + glassmorphism styles
│   └── fonts/                   # Geist font files
│
├── components/                   # React components
│   ├── auth/
│   │   ├── LoginForm.tsx        # Email/password form with "remain logged in" (P1)
│   │   └── LogoutButton.tsx     # Session termination (P1)
│   │
│   ├── dashboard/
│   │   ├── DailySummaryCard.tsx # Top summary card with macros (P1)
│   │   ├── MealSection.tsx      # Individual meal container (P1)
│   │   ├── FoodItemList.tsx     # Food items within meal (P1)
│   │   ├── MacroProgress.tsx    # Consumed/remaining indicator (P1)
│   │   └── EmptyState.tsx       # No data message (P1)
│   │
│   ├── calendar/
│   │   ├── DateSelector.tsx     # Calendar picker (P2)
│   │   └── DateRangePicker.tsx  # Export date range selector (P3)
│   │
│   ├── charts/
│   │   ├── MacroDonutChart.tsx  # Macro distribution donut chart (P3)
│   │   └── MealBarChart.tsx     # Meal calorie comparison bar chart (P3)
│   │
│   ├── export/
│   │   └── ExportButton.tsx     # Text file export trigger (P3)
│   │
│   └── ui/
│       ├── GlassCard.tsx        # Glassmorphism container component
│       ├── LoadingSpinner.tsx   # Loading indicator (>300ms operations)
│       ├── RefreshButton.tsx    # Manual cache refresh (P1)
│       └── Toast.tsx            # Notification wrapper
│
├── contexts/                     # React Context providers
│   ├── AuthContext.tsx          # Authentication state and token management
│   └── NutritionContext.tsx     # Nutrition data with caching
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts               # Auth state, login, logout, token refresh
│   ├── useNutritionData.ts      # Fetch and cache nutrition data
│   ├── useCalendar.ts           # Date selection state
│   └── useExport.ts             # Export generation logic
│
├── services/                     # Business logic and API integration
│   ├── yazio/
│   │   ├── auth.ts              # YAZIO authentication wrapper
│   │   ├── nutrition.ts         # getUserConsumedItems, getUserDailySummary
│   │   └── types.ts             # TypeScript interfaces for YAZIO data
│   │
│   ├── storage/
│   │   ├── tokenStorage.ts      # Encrypted localStorage for tokens
│   │   └── cache.ts             # In-memory cache with 5-min TTL
│   │
│   └── export/
│       └── txtExporter.ts       # Generate structured .txt files
│
├── utils/                        # Utility functions
│   ├── encryption.ts            # Web Crypto API token encryption/decryption
│   ├── formatters.ts            # Date, number, macro value formatters
│   ├── macroCalculations.ts    # Sum macros, calculate remaining
│   └── constants.ts             # Meal types, cache TTL, etc.
│
└── types/                        # Global TypeScript types
    ├── nutrition.ts             # FoodItem, Meal, DailySummary types
    ├── auth.ts                  # UserSession, Credentials types
    └── index.ts                 # Type exports

tests/
├── unit/
│   ├── services/
│   │   ├── tokenStorage.test.ts
│   │   ├── cache.test.ts
│   │   └── txtExporter.test.ts
│   │
│   ├── utils/
│   │   ├── encryption.test.ts
│   │   ├── formatters.test.ts
│   │   └── macroCalculations.test.ts
│   │
│   └── components/
│       ├── LoginForm.test.tsx
│       ├── DailySummaryCard.test.tsx
│       └── MealSection.test.tsx
│
├── integration/
│   ├── auth-flow.test.tsx       # Login -> Dashboard -> Logout
│   ├── calendar-navigation.test.tsx
│   └── export-flow.test.tsx
│
└── e2e/
    ├── login.spec.ts
    ├── dashboard-view.spec.ts
    ├── historical-data.spec.ts
    └── export.spec.ts

public/
└── (static assets if needed)
```

**Structure Decision**: Single Next.js application (no backend) using App Router architecture. All API calls to YAZIO happen client-side via the `yazio` npm package. State management through React Context for global auth and nutrition data, with custom hooks for component-level logic. Clear separation: components (UI), services (API/storage), utils (pure functions), contexts (global state).

## Phase 0: Research & Discovery

### YAZIO API Integration Research

**Objective**: Understand YAZIO npm package capabilities, API contract, and authentication flow.

**Key Questions**:
1. ✅ What authentication method does `yazio` package use?
   - **Answer**: `getTokenFromCredentials(credentials)` returns `Token` object with access/refresh keys

2. ✅ How to fetch consumed food items?
   - **Answer**: `getUserConsumedItems(token, options?)` returns `{ products: UserConsumedItem[], recipe_portions, simple_products }`
   - Options include `date` parameter for historical data

3. ✅ How to get daily macro summary and goals?
   - **Answer**: `getUserDailySummary(token, options?)` returns `UserDailySummary` with:
     - `goals: { "energy.energy", "nutrient.protein", "nutrient.fat", "nutrient.carb", ... }`
     - `activity_energy`, `water_intake`, `steps`

4. ✅ What is the consumed item data structure?
   - **Answer**: `UserConsumedItem` includes:
     - `product_id`, `product` (Product object)
     - `daytime: "breakfast" | "lunch" | "dinner" | "snack"`
     - `amount`, `serving`, `serving_quantity`
     - Product has `nutrients` object with `"nutrient.carb"`, `"nutrient.protein"`, `"nutrient.fat"`, `"energy.energy"`

5. ✅ Token expiration handling?
   - **Research needed**: Test token lifecycle, check if package auto-refreshes or requires manual refresh

6. ✅ Rate limiting considerations?
   - **Research needed**: Document YAZIO API rate limits (not specified in types)

**Research Tasks**:
- [x] Review `yazio` package TypeScript definitions in `node_modules/yazio/dist/`
- [ ] Create test script to authenticate and fetch sample data
- [ ] Document API response shapes in `contracts/yazio-api.md`
- [ ] Test token persistence and expiration behavior
- [ ] Determine if `getUserConsumedItems` groups by meal or requires client-side grouping
- [ ] Verify date format accepted by API (Date object vs ISO string)

### Glassmorphism Design System Research

**Objective**: Define glassmorphism design tokens and Tailwind CSS 4 custom utilities.

**Research Tasks**:
- [ ] Audit existing `globals.css` Tailwind configuration
- [ ] Define glassmorphism CSS custom properties:
  - `--glass-bg-light`, `--glass-bg-dark` (semi-transparent backgrounds)
  - `--glass-border`, `--glass-shadow`
  - Backdrop blur values (8px, 12px, 24px)
- [ ] Create reusable Tailwind classes: `.glass-card`, `.glass-button`, `.glass-input`
- [ ] Ensure WCAG AA contrast (4.5:1) on glass backgrounds
- [ ] Test glassmorphism on various background images/gradients

### Charting Library Evaluation

**Objective**: Select and configure charting library for donut and bar charts.

**Options**:
1. **Recharts** (Recommended)
   - Pros: React-native, good TypeScript support, customizable, responsive
   - Cons: Larger bundle size (~100KB)

2. Chart.js with react-chartjs-2
   - Pros: Mature, extensive docs
   - Cons: Not React-first, wrapper overhead

3. Victory
   - Pros: Modular, animations
   - Cons: Complex API for simple charts

**Decision**: **Recharts** - Best balance of React integration, TypeScript support, and tooltip customization for glassmorphism design.

**Research Tasks**:
- [ ] Install and test Recharts with sample data
- [ ] Create donut chart with tooltip overlay
- [ ] Create bar chart with touch/hover interactions
- [ ] Test responsive behavior on mobile viewports
- [ ] Implement glassmorphism styling on chart tooltips

### Animation Library Selection

**Objective**: Choose animation library for smooth transitions (FR-020).

**Options**:
1. **Framer Motion** (Recommended)
   - Pros: Declarative, Spring physics, gesture support, excellent docs
   - Cons: ~60KB bundle

2. React Spring
   - Pros: Physics-based, performant
   - Cons: More complex API

3. CSS Transitions + React Transition Group
   - Pros: Lightweight
   - Cons: Limited animation capabilities

**Decision**: **Framer Motion** - Aligns with "state of the art" requirement, provides layout animations, and simplifies complex transitions.

**Research Tasks**:
- [ ] Install Framer Motion
- [ ] Create animation variants for:
  - Page transitions (fade + slide)
  - Card entrance animations (stagger)
  - Loading skeleton animations
  - Chart data transitions
- [ ] Test performance on mobile devices

### Token Encryption Strategy

**Objective**: Implement secure token storage using Web Crypto API.

**Research Tasks**:
- [ ] Research Web Crypto API `crypto.subtle.encrypt()` / `decrypt()`
- [ ] Choose encryption algorithm: **AES-GCM** (recommended for authenticated encryption)
- [ ] Generate encryption key from user password or random key stored in sessionStorage
- [ ] Implement encryption/decryption utilities in `utils/encryption.ts`
- [ ] Test key rotation on logout
- [ ] Document security considerations in `contracts/storage.md`

**Key Decision**: Use **AES-GCM with a random key stored in sessionStorage**. When user selects "remain logged in":
1. Generate random encryption key
2. Store key in sessionStorage (persists across tabs, cleared on browser close without "remain logged in")
3. Encrypt token with key
4. Store encrypted token in localStorage
5. On page load: retrieve key from sessionStorage, decrypt token from localStorage

This ensures token is encrypted at rest in localStorage but only accessible during active session.

## Phase 1: Design & Architecture

### Data Model Design

**File**: `specs/001-food-intake-viewer/data-model.md`

**Core Entities**:

```typescript
// User Session
interface UserSession {
  token: YazioToken;           // From yazio package
  isAuthenticated: boolean;
  rememberMe: boolean;
  expiresAt: Date | null;
}

// Daily Nutrition Data
interface DailyNutritionData {
  date: Date;
  summary: DailySummary;
  meals: MealGroup[];
  cachedAt: Date;
}

interface DailySummary {
  consumed: MacroValues;
  goals: MacroValues;
  remaining: MacroValues;
}

interface MacroValues {
  carbohydrates: number;  // grams
  protein: number;        // grams
  fat: number;            // grams
  calories: number;       // kcal
}

interface MealGroup {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: FoodItem[];
  summary: MacroValues;
}

interface FoodItem {
  id: string;
  name: string;
  quantity: string;       // e.g., "100g", "1 serving" (from YAZIO as-is)
  macros: MacroValues;
}

// Export Data
interface ExportRequest {
  startDate: Date;
  endDate: Date;
  data: DailyNutritionData[];
}
```

**Data Flow**:
1. User logs in → `getTokenFromCredentials()` → Store encrypted token in localStorage
2. Dashboard loads → Retrieve token → `getUserConsumedItems(token, { date })` + `getUserDailySummary(token, { date })`
3. Transform YAZIO response → Group by meal type → Calculate summaries
4. Cache in memory (5-min TTL)
5. User selects new date → Check cache → Fetch if expired or missing
6. User exports → Fetch date range → Format as structured text → Download

**Cache Strategy**:
```typescript
interface CacheEntry<T> {
  data: T;
  cachedAt: Date;
  ttl: number; // 300000ms (5 minutes)
}

class NutritionCache {
  private cache = new Map<string, CacheEntry<DailyNutritionData>>();

  get(date: Date): DailyNutritionData | null;
  set(date: Date, data: DailyNutritionData): void;
  invalidate(date?: Date): void; // Clear all or specific date
  isExpired(entry: CacheEntry<DailyNutritionData>): boolean;
}
```

### API Integration Contracts

**File**: `specs/001-food-intake-viewer/contracts/yazio-api.md`

**Authentication Flow**:
```typescript
// Login
const credentials = { username: email, password };
const token = await getTokenFromCredentials(credentials);
// token: { access_token, refresh_token, expires_in, ... }

// Store encrypted token
await encryptAndStoreToken(token, rememberMe);

// Retrieve and decrypt on load
const token = await retrieveAndDecryptToken();
if (!token || isTokenExpired(token)) {
  redirectToLogin();
}
```

**Fetch Nutrition Data**:
```typescript
// Get consumed items for a date
const { products } = await getUserConsumedItems(token, {
  date: new Date('2025-12-12')
});
// products: UserConsumedItem[]
// Each item has: daytime, product (with nutrients), amount, serving

// Get daily summary (goals + totals)
const summary = await getUserDailySummary(token, {
  date: new Date('2025-12-12')
});
// summary: { goals: { "nutrient.carb", "nutrient.protein", ... }, ... }
```

**Data Transformation**:
```typescript
function transformToMealGroups(products: UserConsumedItem[]): MealGroup[] {
  const grouped = groupBy(products, item => item.daytime);

  return ['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => ({
    type: mealType,
    items: grouped[mealType]?.map(item => ({
      id: item.id,
      name: item.product.name,
      quantity: `${item.amount} ${item.serving}`,
      macros: extractMacros(item.product.nutrients, item.amount)
    })) || [],
    summary: calculateMealSummary(grouped[mealType] || [])
  }));
}
```

### Storage Contract

**File**: `specs/001-food-intake-viewer/contracts/storage.md`

**Token Encryption**:
```typescript
// Encryption key management
interface EncryptionKey {
  key: CryptoKey;
  algorithm: 'AES-GCM';
  iv: Uint8Array; // Initialization vector
}

// Encrypt token before storing
async function encryptToken(token: YazioToken, key: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(token));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );
  return JSON.stringify({
    data: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv)
  });
}

// Decrypt token on retrieval
async function decryptToken(encryptedData: string, key: CryptoKey): Promise<YazioToken> {
  const { data, iv } = JSON.parse(encryptedData);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToArrayBuffer(iv) },
    key,
    base64ToArrayBuffer(data)
  );
  return JSON.parse(new TextDecoder().decode(decrypted));
}
```

**LocalStorage Keys**:
- `yazio_encrypted_token` - Encrypted token (persists if "remain logged in")
- `yazio_encryption_iv` - Initialization vector for decryption
- Cache stored in memory only (not persisted)

**SessionStorage Keys**:
- `yazio_encryption_key` - Encryption key (cleared on browser close)

### Component Architecture

**Component Hierarchy**:
```
App Layout
├── AuthProvider (Context)
│   └── NutritionProvider (Context)
│       ├── LoginPage (Unauthenticated)
│       │   └── LoginForm
│       │       ├── GlassCard
│       │       └── Toast
│       │
│       └── DashboardPage (Authenticated)
│           ├── Header
│           │   ├── LogoutButton
│           │   ├── DateSelector
│           │   └── RefreshButton
│           │
│           ├── DailySummaryCard (P1)
│           │   ├── MacroProgress (x4: carbs, protein, fat, calories)
│           │   └── GlassCard
│           │
│           ├── ChartsSection (P3)
│           │   ├── MacroDonutChart
│           │   └── MealBarChart
│           │
│           ├── MealsSection (P1)
│           │   └── MealSection (x4: breakfast, lunch, dinner, snack)
│           │       ├── FoodItemList
│           │       ├── MealSummary
│           │       └── EmptyState (if no items)
│           │
│           └── ExportButton (P3)
│               └── DateRangePicker Modal
│
└── Toast Notifications
```

**Context Structure**:
```typescript
// AuthContext
interface AuthContextValue {
  session: UserSession | null;
  login: (credentials: Credentials, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// NutritionContext
interface NutritionContextValue {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  nutritionData: DailyNutritionData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}
```

### Responsive Design Strategy

**Breakpoints** (Tailwind CSS 4):
```css
/* Mobile-first approach */
/* Default: 320px-767px (mobile) */
.glass-card {
  @apply p-4 backdrop-blur-lg bg-white/20;
}

/* md: 768px+ (tablet) */
@media (min-width: 768px) {
  .glass-card {
    @apply p-6;
  }
}

/* lg: 1024px+ (desktop) */
@media (min-width: 1024px) {
  .glass-card {
    @apply p-8;
  }
}
```

**Layout Adaptations**:
- Mobile: Single column, stacked meals, full-width charts
- Tablet: Two-column grid for charts, meals still stacked
- Desktop: Three-column layout (summary + 2 chart columns), side-by-side meals

**Touch Interactions**:
- Pull-to-refresh on mobile for cache invalidation
- Swipe gestures on charts for mobile navigation
- Tap targets minimum 44x44px (WCAG 2.5.5)

### Quickstart Guide

**File**: `specs/001-food-intake-viewer/quickstart.md`

```markdown
# YAZIO Food Intake Viewer - Developer Quickstart

## Prerequisites
- Node.js 20+
- Yarn or npm
- Active YAZIO account for testing

## Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Run development server:
   ```bash
   yarn dev
   ```

3. Open http://localhost:3000

## Project Structure
- `src/app/` - Next.js App Router pages
- `src/components/` - React components (auth, dashboard, charts, etc.)
- `src/contexts/` - Global state (AuthContext, NutritionContext)
- `src/services/` - API integration and storage logic
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions (encryption, formatters, etc.)

## Development Workflow

### Testing Authentication
1. Navigate to http://localhost:3000
2. Enter YAZIO credentials
3. Check browser DevTools → Application → Local Storage for encrypted token

### Testing Nutrition Data
1. Login with valid credentials
2. Dashboard shows today's data
3. Click calendar to select historical date
4. Verify cache in DevTools → Console (enable debug mode)

### Testing Export
1. Click Export button
2. Select date range
3. Verify .txt file downloads with structured format

## Tech Stack
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Recharts (charts)
- Framer Motion (animations)
- date-fns (date handling)
- Web Crypto API (token encryption)

## Key Commands
- `yarn dev` - Start dev server
- `yarn build` - Production build
- `yarn test` - Run tests
- `yarn lint` - Lint code

## Architecture Patterns
- **State Management**: React Context (global), useState/useReducer (local)
- **Data Fetching**: Custom hooks with SWR-like caching
- **Styling**: Tailwind CSS with glassmorphism utilities
- **Animations**: Framer Motion variants
- **Type Safety**: TypeScript strict mode, Zod schemas from yazio package
```

## Implementation Phases

### Phase 2A: Core Authentication (P1)

**Tasks**:
1. Implement `services/yazio/auth.ts`
   - Wrap `getTokenFromCredentials` with error handling
   - Handle network errors, invalid credentials, API errors

2. Implement `utils/encryption.ts`
   - AES-GCM encryption/decryption functions
   - Key generation and storage in sessionStorage

3. Implement `services/storage/tokenStorage.ts`
   - `storeToken(token, rememberMe)` - Encrypt and save
   - `retrieveToken()` - Decrypt and return
   - `clearToken()` - Remove from localStorage

4. Create `contexts/AuthContext.tsx`
   - Provide `login()`, `logout()`, `session` state
   - Auto-load token on mount
   - Handle token expiration

5. Build `components/auth/LoginForm.tsx`
   - Email/password inputs
   - "Remain logged in" checkbox
   - Submit handler calling `useAuth().login()`
   - Loading state, error display
   - Glassmorphism styling

6. Create `app/page.tsx` (Login page)
   - Redirect to dashboard if authenticated
   - Show LoginForm if not authenticated

**Acceptance Criteria**:
- User can login with valid YAZIO credentials
- Token is encrypted and stored in localStorage when "remain logged in" is checked
- User is redirected to dashboard after successful login
- Error messages display for invalid credentials or network issues
- Token persists across browser restarts when "remain logged in" is enabled

### Phase 2B: Daily Nutrition View (P1)

**Tasks**:
1. Implement `services/yazio/nutrition.ts`
   - `fetchDailyNutrition(token, date)` - Combines `getUserConsumedItems` + `getUserDailySummary`
   - Transform YAZIO response to `DailyNutritionData`
   - Group food items by meal type
   - Calculate meal summaries

2. Implement `services/storage/cache.ts`
   - In-memory cache with 5-minute TTL
   - `get(date)`, `set(date, data)`, `invalidate(date?)`

3. Create `contexts/NutritionContext.tsx`
   - Manage `selectedDate` state
   - Fetch and cache nutrition data
   - Provide `refresh()` function to bypass cache

4. Build `components/dashboard/DailySummaryCard.tsx`
   - Display total consumed macros
   - Display daily goals
   - Show remaining macros (goal - consumed)
   - Glassmorphism card design

5. Create `components/dashboard/MacroProgress.tsx`
   - Progress bar showing consumed/goal ratio
   - Color coding (green < 100%, yellow 100-110%, red > 110%)

6. Build `components/dashboard/MealSection.tsx`
   - Meal header (breakfast/lunch/dinner/snack)
   - Food item list
   - Meal summary (total macros)
   - Empty state if no items

7. Create `components/dashboard/FoodItemList.tsx`
   - List food items with name and quantity
   - Display macros per item
   - Handle long names with ellipsis

8. Create `app/dashboard/page.tsx`
   - Protected route (redirect to login if not authenticated)
   - Render DailySummaryCard
   - Render MealSections (x4)
   - Loading state while fetching
   - Error state with retry button

**Acceptance Criteria**:
- Dashboard displays today's nutrition data on load
- Daily summary shows consumed and remaining macros
- Each meal section displays food items with quantities
- Macro summaries calculated correctly per meal
- Empty states shown for meals with no items
- Data cached for 5 minutes
- Loading indicator appears during data fetch

### Phase 2C: Logout & Refresh (P1)

**Tasks**:
1. Build `components/auth/LogoutButton.tsx`
   - Call `useAuth().logout()`
   - Clear token from storage
   - Redirect to login

2. Create `components/ui/RefreshButton.tsx`
   - Call `useNutrition().refresh()`
   - Invalidate cache and re-fetch
   - Show loading spinner during refresh

3. Add logout button to dashboard header
4. Add refresh button to dashboard header (desktop) and pull-to-refresh on mobile

**Acceptance Criteria**:
- Logout button clears token and redirects to login
- Refresh button fetches latest data from API
- Pull-to-refresh works on mobile devices

### Phase 3: Historical Data (P2)

**Tasks**:
1. Install `react-datepicker` or build custom date picker

2. Build `components/calendar/DateSelector.tsx`
   - Calendar UI with glassmorphism styling
   - Prevent future date selection
   - Highlight today's date
   - On date select: call `setSelectedDate()`

3. Update `NutritionContext` to react to `selectedDate` changes
   - Fetch data for new date if not in cache
   - Update dashboard with new date's data

4. Add date selector to dashboard header
5. Display selected date prominently on dashboard

**Acceptance Criteria**:
- Calendar allows selection of past dates
- Dashboard updates to show selected date's data
- Future dates are disabled or show appropriate message
- Historical data loads within 3 seconds
- Cached dates load instantly

### Phase 4: Visual Charts (P3)

**Tasks**:
1. Install Recharts:
   ```bash
   yarn add recharts
   ```

2. Build `components/charts/MacroDonutChart.tsx`
   - Donut chart with carbs/protein/fat segments
   - Calculate percentages from consumed values
   - Custom tooltip with glassmorphism styling
   - Responsive sizing
   - Empty state if no data

3. Build `components/charts/MealBarChart.tsx`
   - Bar chart with 4 bars (breakfast, lunch, dinner, snack)
   - Y-axis: calories
   - Custom tooltip showing exact calorie values
   - Responsive sizing
   - Empty state if no data

4. Add charts section to dashboard
   - Position above meal sections
   - Two-column layout on desktop, stacked on mobile

5. Update charts when `selectedDate` changes

**Acceptance Criteria**:
- Donut chart displays macro distribution percentages
- Bar chart compares calorie consumption across meals
- Tooltips show precise values on hover (desktop) and tap (mobile)
- Charts update when date changes
- Charts are responsive and readable on mobile
- Empty states shown when no data available

### Phase 5: Data Export (P3)

**Tasks**:
1. Build `services/export/txtExporter.ts`
   - Generate structured text format:
     ```
     YAZIO Nutrition Export
     Date Range: 2025-12-01 to 2025-12-07

     === 2025-12-01 ===
     Daily Summary:
       Carbohydrates: 250g / 300g (50g remaining)
       Protein: 120g / 150g (30g remaining)
       Fat: 60g / 70g (10g remaining)
       Calories: 1800 kcal / 2000 kcal (200 kcal remaining)

     BREAKFAST
       - Oatmeal (100g)
         Carbs: 60g | Protein: 10g | Fat: 5g | Calories: 350 kcal
       - Banana (1 medium)
         Carbs: 30g | Protein: 2g | Fat: 0g | Calories: 120 kcal
       Meal Total: Carbs: 90g | Protein: 12g | Fat: 5g | Calories: 470 kcal

     LUNCH
       ...
     ```
   - Handle multi-day exports
   - Include headers, indentation, spacing

2. Build `components/export/ExportButton.tsx`
   - Trigger modal with date range picker
   - Validate date range (max 90 days)
   - Show loading indicator during export generation
   - Trigger browser download

3. Build `components/calendar/DateRangePicker.tsx`
   - Start date and end date selectors
   - Validation (end >= start, max 90 days)
   - Glassmorphism modal styling

4. Implement `hooks/useExport.ts`
   - Fetch nutrition data for date range
   - Call txtExporter
   - Trigger download

5. Add export button to dashboard header

**Acceptance Criteria**:
- Export button opens date range selector
- User can select start and end dates
- Export generates within 5 seconds for 30-day range
- .txt file contains structured, readable format
- Export includes all meals and summaries for each day
- Empty dates show "No data logged" message
- Download works on desktop and mobile

### Phase 6: Animations & Polish (P3)

**Tasks**:
1. Install Framer Motion:
   ```bash
   yarn add framer-motion
   ```

2. Add page transition animations
   - Fade in dashboard on load
   - Slide transition when changing dates

3. Add stagger animations for meal sections
   - Cards appear sequentially with slight delay

4. Add chart data transition animations
   - Smooth value changes when date changes

5. Add loading skeleton animations
   - Shimmer effect for loading states

6. Add micro-interactions
   - Button hover/press animations
   - Card hover elevation
   - Input focus animations

7. Optimize performance
   - Lazy load charts
   - Memoize expensive calculations
   - Debounce refresh button

**Acceptance Criteria**:
- All transitions are smooth (60fps)
- No janky animations on mobile
- Loading states have skeleton animations
- Buttons have hover/press feedback
- Page transitions feel polished

### Phase 7: Glassmorphism Styling (Spans all phases)

**Tasks**:
1. Create glassmorphism CSS utilities in `globals.css`:
   ```css
   @layer components {
     .glass-card {
       @apply backdrop-blur-lg bg-white/10 dark:bg-white/5;
       @apply border border-white/20 dark:border-white/10;
       @apply shadow-xl shadow-black/10;
       @apply rounded-2xl;
     }

     .glass-button {
       @apply glass-card px-6 py-3;
       @apply hover:bg-white/20 transition-all duration-200;
       @apply active:scale-95;
     }

     .glass-input {
       @apply glass-card px-4 py-2;
       @apply focus:ring-2 focus:ring-white/30;
       @apply placeholder:text-white/50;
     }
   }
   ```

2. Create background gradient/image for glassmorphism effect
   - Subtle gradient background
   - Ensure WCAG AA contrast on glass elements

3. Apply glassmorphism to all components:
   - Login card
   - Dashboard summary card
   - Meal section cards
   - Charts container
   - Modals
   - Buttons
   - Input fields

4. Dark mode support (optional enhancement)
   - Adjust glass opacity for dark backgrounds
   - Test contrast ratios

**Acceptance Criteria**:
- All UI components use glassmorphism design
- WCAG AA contrast standards met (4.5:1)
- Glassmorphism works on various background colors
- Design is cohesive across desktop and mobile

### Phase 8: Notifications & Error Handling (Spans all phases)

**Tasks**:
1. Install react-hot-toast:
   ```bash
   yarn add react-hot-toast
   ```

2. Create `components/ui/Toast.tsx` wrapper
   - Custom styling with glassmorphism

3. Add toast notifications for:
   - Successful login
   - Logout confirmation
   - Data refresh success
   - Export success
   - Error states (API errors, network errors, etc.)

4. Implement error boundaries
   - Catch component errors
   - Display fallback UI with retry option

5. Handle edge cases:
   - No macro goals set (hide remaining values)
   - Long food names (ellipsis + tooltip)
   - No data for selected date (empty state)
   - Network offline (show cached data + indicator)
   - API rate limiting (show retry message)

**Acceptance Criteria**:
- User receives clear feedback for every action
- Error messages are helpful and actionable
- Toast notifications are non-intrusive
- Offline state is clearly indicated
- Edge cases handled gracefully

## Testing Strategy

### Unit Tests
- **Utils**: Encryption, formatters, macro calculations
- **Services**: Token storage, cache, export generation
- **Components**: Isolated component rendering and interactions

### Integration Tests
- **Auth Flow**: Login → Store token → Dashboard → Logout
- **Data Flow**: Fetch nutrition data → Cache → Display → Refresh
- **Calendar Flow**: Select date → Fetch data → Update UI

### E2E Tests (Playwright)
- **Login Journey**: Full login flow with valid/invalid credentials
- **Dashboard View**: Verify all UI elements render correctly
- **Historical Data**: Select date, verify data updates
- **Export Flow**: Select range, generate file, verify download

### Performance Tests
- Lighthouse audit: Performance, Accessibility, Best Practices
- Mobile performance testing on real devices
- Cache performance verification

### Accessibility Tests
- Keyboard navigation
- Screen reader compatibility
- WCAG AA compliance (contrast, focus indicators, ARIA labels)

## Deployment

### Build Optimization
```bash
yarn build
```

**Next.js Configuration** (`next.config.ts`):
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Static export (no server needed)
  images: {
    unoptimized: true, // For static export
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
```

### Hosting Options
1. **Vercel** (Recommended) - Zero-config Next.js hosting
2. **Netlify** - Static site hosting with forms
3. **GitHub Pages** - Free static hosting
4. **AWS S3 + CloudFront** - Scalable static hosting

### Environment Variables
- None required (client-side only, no API keys)
- YAZIO credentials entered by users at runtime

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| YAZIO API rate limiting | Medium | High | Implement 5-min cache, monitor API usage, add retry logic |
| Token encryption vulnerability | Low | High | Use Web Crypto API (browser standard), regular security audits |
| Poor mobile performance | Medium | Medium | Performance budget, code splitting, lazy loading charts |
| YAZIO API schema changes | Low | High | Use Zod schemas from package, add error boundaries |
| Browser compatibility (Web Crypto API) | Low | Medium | Check browser support, fallback message for old browsers |
| Cache consistency issues | Medium | Low | Clear cache on logout, invalidate on manual refresh |

### UX Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Confusing glassmorphism (poor contrast) | Medium | Medium | WCAG AA testing, user testing, adjustable opacity |
| Slow data loading on 3G | High | Medium | Loading skeletons, optimistic UI updates, cache strategy |
| Calendar UX confusion | Low | Low | Clear date selection feedback, highlight today |
| Export format not user-friendly | Medium | Medium | User testing, provide sample export |

## Success Metrics

### Performance Metrics
- [ ] Login to dashboard < 10 seconds (SC-001)
- [ ] Page load < 2 seconds on 3G (SC-003)
- [ ] Historical date load < 3 seconds (SC-005)
- [ ] Export generation < 5 seconds (30-day range) (SC-006)

### Quality Metrics
- [ ] 95% authentication success rate (SC-002)
- [ ] WCAG AA contrast compliance (SC-007)
- [ ] Responsive 320px-2560px (SC-009)
- [ ] Token persistence 30+ days (SC-011)

### User Experience Metrics
- [ ] 90% task completion rate (SC-008)
- [ ] Identify remaining macros < 5 seconds (SC-010)
- [ ] Touch interactions work without horizontal scroll (SC-004)
- [ ] Charts interactive on all devices (SC-012)

## Next Steps

1. ✅ Review and approve this implementation plan
2. [ ] Run `/speckit.tasks` to generate detailed task breakdown
3. [ ] Set up development environment (install dependencies)
4. [ ] Execute Phase 0 research tasks
5. [ ] Complete Phase 1 design artifacts (data-model.md, contracts/)
6. [ ] Begin Phase 2A implementation (authentication)
7. [ ] Iterate through remaining phases
8. [ ] Deploy MVP (P1 features complete)
9. [ ] Gather user feedback
10. [ ] Implement P2 and P3 features

## Appendix: Technology Decisions

### Why Next.js 16?
- App Router provides modern React patterns (Server Components, Suspense)
- Client-side rendering mode for no-backend architecture
- Built-in routing, TypeScript support, optimized builds
- Aligns with "state of the art" requirement

### Why No Backend?
- YAZIO npm package handles API calls client-side
- Reduces complexity and hosting costs
- Faster development
- Sufficient for read-only data access

### Why Recharts over Chart.js?
- Native React components (better integration)
- TypeScript support out of the box
- Easier tooltip customization for glassmorphism
- Responsive by default

### Why Framer Motion?
- Industry-standard for React animations
- Declarative API matches React patterns
- Built-in gesture support for mobile interactions
- Layout animations simplify complex transitions

### Why Web Crypto API over Libraries?
- Browser-native (no dependencies)
- Secure by design (FIPS 140-2 compliant)
- No bundle size overhead
- Good browser support (95%+ coverage)

---

**Plan Status**: ✅ Complete and ready for task generation
**Next Command**: `/speckit.tasks`
