# Tasks: YAZIO Food Intake Viewer

**Input**: Design documents from `/specs/001-food-intake-viewer/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Tests are NOT explicitly requested in the specification, so test tasks are excluded from this implementation plan. Testing will be performed manually against acceptance criteria.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single Next.js project structure:
- `src/` - Source code at repository root
- App Router pages in `src/app/`
- Components in `src/components/`
- Services in `src/services/`
- Utilities in `src/utils/`
- Types in `src/types/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [X] T001 Install project dependencies: `yarn add recharts date-fns react-hot-toast framer-motion @heroicons/react`
- [X] T002 [P] Install dev dependencies: `yarn add -D @types/node @playwright/test jest @testing-library/react @testing-library/jest-dom`
- [X] T003 [P] Create TypeScript types directory structure: `src/types/nutrition.ts`, `src/types/auth.ts`, `src/types/index.ts`
- [X] T004 [P] Create services directory structure: `src/services/yazio/`, `src/services/storage/`, `src/services/export/`
- [X] T005 [P] Create components directory structure per plan.md: `src/components/auth/`, `src/components/dashboard/`, `src/components/calendar/`, `src/components/charts/`, `src/components/export/`, `src/components/ui/`
- [X] T006 [P] Create contexts directory: `src/contexts/`
- [X] T007 [P] Create hooks directory: `src/hooks/`
- [X] T008 [P] Create utils directory: `src/utils/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Glassmorphism Design System

- [X] T009 Define glassmorphism CSS variables in `src/app/globals.css`: `--glass-bg-light`, `--glass-bg-dark`, `--glass-border`, `--glass-shadow`, backdrop blur values
- [X] T010 [P] Create `.glass-card` utility class in `src/app/globals.css` with semi-transparent background, backdrop blur, border, shadow, rounded corners
- [X] T011 [P] Create `.glass-button` utility class in `src/app/globals.css` with glassmorphism styling and hover/active states
- [X] T012 [P] Create `.glass-input` utility class in `src/app/globals.css` with glassmorphism styling and focus states
- [X] T013 [P] Add background gradient to `src/app/layout.tsx` root layout for glassmorphism effect

### Core Utilities & Types

- [X] T014 [P] Define constants in `src/utils/constants.ts`: meal types array, cache TTL (300000ms), date formats, max export range (90 days)
- [X] T015 [P] Implement Web Crypto API encryption utilities in `src/utils/encryption.ts`: `encryptToken()`, `decryptToken()`, `generateKey()` using AES-GCM
- [X] T016 [P] Implement formatters in `src/utils/formatters.ts`: `formatDate()`, `formatMacroValue()`, `formatQuantity()`
- [X] T017 [P] Implement macro calculations in `src/utils/macroCalculations.ts`: `sumMacros()`, `calculateRemaining()`, `calculateMealSummary()`
- [X] T018 [P] Define auth types in `src/types/auth.ts`: `UserSession`, `Credentials`, `EncryptedTokenData` interfaces
- [X] T019 [P] Define nutrition types in `src/types/nutrition.ts`: `DailyNutritionData`, `DailySummary`, `MacroValues`, `MealGroup`, `FoodItem`, `MealType` interfaces
- [X] T020 Define YAZIO types wrapper in `src/services/yazio/types.ts`: re-export Token, UserConsumedItem, UserDailySummary from yazio package with custom extensions

### Storage Layer

- [X] T021 Implement in-memory cache in `src/services/storage/cache.ts`: `NutritionCache` class with `get()`, `set()`, `invalidate()`, `isExpired()` methods, 5-minute TTL
- [X] T022 Implement token storage in `src/services/storage/tokenStorage.ts`: `storeToken()`, `retrieveToken()`, `clearToken()` with encryption integration
- [X] T023 Implement encryption key management in `src/services/storage/tokenStorage.ts`: generate key on login, store in sessionStorage, retrieve on load

### YAZIO API Integration

- [X] T024 [P] Implement authentication service in `src/services/yazio/auth.ts`: wrap `getTokenFromCredentials()` with error handling, network retry logic
- [X] T025 Implement nutrition service in `src/services/yazio/nutrition.ts`: `fetchDailyNutrition()` combining `getUserConsumedItems()` and `getUserDailySummary()`, transform to `DailyNutritionData`
- [X] T026 Add meal grouping logic to `src/services/yazio/nutrition.ts`: group consumed items by `daytime` property (breakfast, lunch, dinner, snack)
- [X] T027 Add macro extraction to `src/services/yazio/nutrition.ts`: extract carbs/protein/fat/calories from product nutrients, scale by serving amount

### Base UI Components

- [X] T028 [P] Create GlassCard component in `src/components/ui/GlassCard.tsx`: reusable glassmorphism container with props for padding, children
- [X] T029 [P] Create LoadingSpinner component in `src/components/ui/LoadingSpinner.tsx`: animated spinner with glassmorphism styling
- [X] T030 [P] Create Toast wrapper component in `src/components/ui/Toast.tsx`: integrate react-hot-toast with glassmorphism custom styling
- [X] T031 Setup Toaster in `src/app/layout.tsx`: add react-hot-toast Toaster component to root layout

### Animation Setup

- [X] T032 Create Framer Motion animation variants in `src/utils/animations.ts`: page fade-in, card stagger, slide transitions, loading skeleton

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Secure Login and Authentication (Priority: P1) 🎯 MVP

**Goal**: Enable users to authenticate with YAZIO credentials and securely store tokens for persistent sessions

**Independent Test**:
1. Navigate to http://localhost:3000
2. Enter valid YAZIO email and password
3. Check "remain logged in" checkbox
4. Click login → Should redirect to dashboard (even if empty)
5. Close browser and reopen → Should still be authenticated
6. Verify encrypted token in DevTools → Application → Local Storage
7. Click logout → Should clear token and redirect to login
8. Try invalid credentials → Should show error toast notification

### Implementation for User Story 1

- [X] T033 [P] [US1] Create AuthContext in `src/contexts/AuthContext.tsx`: define `AuthContextValue` interface with `session`, `login()`, `logout()`, `isLoading`, `error`
- [X] T034 [P] [US1] Implement useAuth hook in `src/hooks/useAuth.ts`: consume AuthContext, provide auth state and methods
- [X] T035 [US1] Implement AuthContext provider logic in `src/contexts/AuthContext.tsx`: state management with useState, useEffect for auto-load token on mount
- [X] T036 [US1] Add login method to AuthContext in `src/contexts/AuthContext.tsx`: call `getTokenFromCredentials()`, encrypt token, store with rememberMe flag, set session state
- [X] T037 [US1] Add logout method to AuthContext in `src/contexts/AuthContext.tsx`: call `clearToken()`, clear session state, redirect to login page
- [X] T038 [US1] Add token expiration detection to AuthContext in `src/contexts/AuthContext.tsx`: check token expiry on mount and periodically, auto-logout if expired
- [X] T039 [P] [US1] Create LoginForm component in `src/components/auth/LoginForm.tsx`: email input, password input, "remain logged in" checkbox, submit button with glassmorphism styling
- [X] T040 [US1] Add form validation to LoginForm in `src/components/auth/LoginForm.tsx`: validate email format, password not empty, show inline errors
- [X] T041 [US1] Connect LoginForm to useAuth in `src/components/auth/LoginForm.tsx`: call `login()` on submit, handle loading state, display error toast on failure, show success toast on success
- [X] T042 [US1] Add loading state UI to LoginForm in `src/components/auth/LoginForm.tsx`: disable inputs and button during login, show LoadingSpinner overlay
- [X] T043 [P] [US1] Create LogoutButton component in `src/components/auth/LogoutButton.tsx`: button with glassmorphism styling, calls `useAuth().logout()`, shows confirmation toast
- [X] T044 [US1] Create login page in `src/app/page.tsx`: check if authenticated, redirect to dashboard if yes, render LoginForm if no, add background gradient, center layout
- [X] T045 [US1] Wrap app with AuthProvider in `src/app/layout.tsx`: add AuthContext provider above children, below Toaster

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can log in, tokens persist, logout works, errors display.

---

## Phase 4: User Story 2 - View Daily Nutrition Overview (Priority: P1) 🎯 MVP

**Goal**: Display today's nutrition data organized by meals with macro summaries

**Independent Test**:
1. Log in with valid YAZIO credentials
2. Dashboard should load showing today's date
3. Verify daily summary card at top shows: total carbs, protein, fat, calories (consumed + remaining)
4. Scroll down to see 4 meal sections: Breakfast, Lunch, Dinner, Snack
5. Each meal should show food items with names and quantities
6. Each meal should show macro totals
7. Empty meals should show "No items logged"
8. Click refresh button → Should fetch latest data
9. Verify data cached (check network tab - no API call on second page load within 5 min)

### Implementation for User Story 2

- [X] T046 [P] [US2] Create NutritionContext in `src/contexts/NutritionContext.tsx`: define `NutritionContextValue` interface with `selectedDate`, `setSelectedDate()`, `nutritionData`, `isLoading`, `error`, `refresh()`
- [X] T047 [P] [US2] Create useNutritionData hook in `src/hooks/useNutritionData.ts`: consume NutritionContext, provide nutrition state and methods
- [X] T048 [US2] Implement NutritionContext provider logic in `src/contexts/NutritionContext.tsx`: state management with useState, useEffect to fetch data when `selectedDate` changes
- [X] T049 [US2] Add data fetching logic to NutritionContext in `src/contexts/NutritionContext.tsx`: call `fetchDailyNutrition()`, check cache first, update cache on fetch, handle errors
- [X] T050 [US2] Add refresh method to NutritionContext in `src/contexts/NutritionContext.tsx`: invalidate cache for current date, re-fetch data, show toast notification
- [X] T051 [US2] Add token requirement check to NutritionContext in `src/contexts/NutritionContext.tsx`: only fetch if authenticated, redirect to login if token missing
- [X] T052 [P] [US2] Create MacroProgress component in `src/components/dashboard/MacroProgress.tsx`: progress bar with consumed/goal ratio, color coding (green <100%, yellow 100-110%, red >110%), label and values
- [X] T053 [P] [US2] Create DailySummaryCard component in `src/components/dashboard/DailySummaryCard.tsx`: GlassCard container, 4x MacroProgress components (carbs, protein, fat, calories), today's date display
- [X] T054 [US2] Add remaining macro calculations to DailySummaryCard in `src/components/dashboard/DailySummaryCard.tsx`: use `calculateRemaining()` util, handle case when goals not set (hide remaining or show "No goals")
- [X] T055 [P] [US2] Create EmptyState component in `src/components/dashboard/EmptyState.tsx`: centered message with icon, glassmorphism styling, customizable text prop
- [X] T056 [P] [US2] Create FoodItemList component in `src/components/dashboard/FoodItemList.tsx`: list of food items with name, quantity, macro values, handle long names with ellipsis
- [X] T057 [P] [US2] Create MealSection component in `src/components/dashboard/MealSection.tsx`: GlassCard, meal type header (Breakfast/Lunch/Dinner/Snack), FoodItemList or EmptyState, meal macro summary
- [X] T058 [US2] Add meal summary calculations to MealSection in `src/components/dashboard/MealSection.tsx`: use `calculateMealSummary()` util, display totals for carbs, protein, fat, calories
- [X] T059 [P] [US2] Create RefreshButton component in `src/components/ui/RefreshButton.tsx`: icon button with glassmorphism, calls `useNutritionData().refresh()`, shows loading spinner during refresh, desktop and mobile variants
- [X] T060 [US2] Create dashboard page in `src/app/dashboard/page.tsx`: protected route (redirect if not authenticated), DailySummaryCard at top, 4x MealSection components, RefreshButton in header
- [X] T061 [US2] Add loading state to dashboard in `src/app/dashboard/page.tsx`: show LoadingSpinner overlay while `isLoading === true`
- [X] T062 [US2] Add error state to dashboard in `src/app/dashboard/page.tsx`: show error message with retry button if `error !== null`, use toast for transient errors
- [X] T063 [US2] Wrap app with NutritionProvider in `src/app/layout.tsx`: add NutritionContext provider inside AuthProvider, before children
- [ ] T064 [US2] Add pull-to-refresh for mobile in `src/app/dashboard/page.tsx`: detect pull-down gesture on touchscreen, trigger `refresh()`, show loading indicator

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can log in, see today's nutrition data, refresh manually, and log out.

---

## Phase 5: User Story 3 - Browse Historical Nutrition Data (Priority: P2)

**Goal**: Enable users to select past dates and view historical nutrition data

**Independent Test**:
1. Log in and land on dashboard (showing today's data)
2. Click calendar icon in header
3. Calendar should open with today highlighted
4. Select a past date (e.g., 3 days ago)
5. Dashboard should update to show that date's data
6. Verify date display updates to selected date
7. Verify meals and summaries change
8. Click "Today" button → Should return to current day
9. Try selecting future date → Should be disabled or show "No data available"
10. Select date with no data → All meals show empty state

### Implementation for User Story 3

- [X] T065 [P] [US3] Create useCalendar hook in `src/hooks/useCalendar.ts`: manage calendar open/closed state, handle date selection, integrate with `setSelectedDate()` from NutritionContext
- [X] T066 [P] [US3] Create DateSelector component in `src/components/calendar/DateSelector.tsx`: calendar UI with glassmorphism modal, highlight today, disable future dates, show selected date
- [X] T067 [US3] Add date navigation to DateSelector in `src/components/calendar/DateSelector.tsx`: month/year dropdown or arrows, keyboard navigation support
- [X] T068 [US3] Integrate DateSelector with useCalendar in `src/components/calendar/DateSelector.tsx`: call `setSelectedDate()` on date click, close calendar on selection, show toast confirming date change
- [X] T069 [US3] Add calendar trigger to dashboard header in `src/app/dashboard/page.tsx`: calendar icon button, opens DateSelector modal, shows current selected date
- [X] T070 [US3] Add "Today" quick action to dashboard in `src/app/dashboard/page.tsx`: button to instantly return to today's date, only show when viewing past date
- [X] T071 [US3] Update NutritionContext to handle date changes in `src/contexts/NutritionContext.tsx`: fetch data for new date when `selectedDate` changes, check cache first, handle loading state
- [X] T072 [US3] Add date display to dashboard in `src/app/dashboard/page.tsx`: show selected date prominently in header, highlight if not today (e.g., "Viewing: Dec 9, 2025")
- [X] T073 [US3] Add transition animation to dashboard in `src/app/dashboard/page.tsx`: fade out old data, fade in new data when date changes using Framer Motion

**Checkpoint**: All three user stories (1, 2, 3) should now work independently. Users can browse historical data while maintaining auth and dashboard functionality.

---

## Phase 6: User Story 4 - Export Nutrition Data to Text File (Priority: P3)

**Goal**: Allow users to export nutrition data for a date range to a structured .txt file

**Independent Test**:
1. Log in to dashboard
2. Click "Export" button in header
3. Modal should open with date range picker
4. Select start date (e.g., 7 days ago)
5. Select end date (e.g., today)
6. Verify validation: end >= start, max 90 days
7. Click "Export" → Should show loading indicator
8. .txt file should download within 5 seconds (for 7-day range)
9. Open .txt file → Verify structured format with headers, indentation, dates, meals, food items, macro summaries
10. Try exporting range with no data → File should contain message "No data logged during this period"

### Implementation for User Story 4

- [X] T074 [P] [US4] Implement txtExporter service in `src/services/export/txtExporter.ts`: `generateExportText()` function accepting array of `DailyNutritionData`, returning formatted string
- [X] T075 [US4] Add structured formatting to txtExporter in `src/services/export/txtExporter.ts`: header with date range, daily sections, meal subsections, indented food items, macro summaries at all levels
- [X] T076 [US4] Add empty state handling to txtExporter in `src/services/export/txtExporter.ts`: detect empty days, add "No data logged" messages, handle empty date ranges
- [X] T077 [P] [US4] Create useExport hook in `src/hooks/useExport.ts`: manage export state, fetch data for date range, call `generateExportText()`, trigger browser download
- [X] T078 [US4] Add date range validation to useExport in `src/hooks/useExport.ts`: end >= start, max 90-day range, show validation errors as toasts
- [X] T079 [US4] Add progress tracking to useExport in `src/hooks/useExport.ts`: show percentage for large exports, handle API rate limits with delays
- [X] T080 [P] [US4] Create DateRangePicker component in `src/components/calendar/DateRangePicker.tsx`: glassmorphism modal, start date selector, end date selector, validation messages, confirm button
- [X] T081 [US4] Integrate DateRangePicker with useExport in `src/components/calendar/DateRangePicker.tsx`: call `useExport().exportRange()` on confirm, show loading state, close on success
- [X] T082 [P] [US4] Create ExportButton component in `src/components/export/ExportButton.tsx`: button in dashboard header, opens DateRangePicker modal, glassmorphism styling
- [X] T083 [US4] Add export button to dashboard in `src/app/dashboard/page.tsx`: render ExportButton in header next to calendar and refresh
- [X] T084 [US4] Add download trigger to useExport in `src/hooks/useExport.ts`: create blob from text, generate download link, trigger click, cleanup, show success toast

**Checkpoint**: User stories 1-4 complete. Users can export data while maintaining all previous functionality.

---

## Phase 7: User Story 5 - Visual Data Representation (Priority: P3)

**Goal**: Display nutrition data as interactive charts (donut chart for macros, bar chart for meals)

**Independent Test**:
1. Log in to dashboard
2. Verify donut chart appears showing carbs/protein/fat percentage breakdown
3. Verify bar chart appears showing calories per meal (4 bars: breakfast, lunch, dinner, snack)
4. Hover over donut segment (desktop) → Tooltip should show exact gram value
5. Tap donut segment (mobile) → Tooltip should appear with value
6. Hover over bar → Tooltip should show exact calorie value
7. Change date via calendar → Charts should update to reflect new date's data
8. View date with no data → Charts show empty state message
9. Verify charts are responsive on mobile (320px width)

### Implementation for User Story 5

- [ ] T085 [P] [US5] Create MacroDonutChart component in `src/components/charts/MacroDonutChart.tsx`: Recharts PieChart/DonutChart, 3 segments (carbs, protein, fat), calculate percentages from consumed macros
- [ ] T086 [US5] Add custom tooltip to MacroDonutChart in `src/components/charts/MacroDonutChart.tsx`: glassmorphism styled tooltip, show macro name, grams, percentage
- [ ] T087 [US5] Add responsive sizing to MacroDonutChart in `src/components/charts/MacroDonutChart.tsx`: ResponsiveContainer, adjust inner/outer radius for mobile, touch-friendly segments
- [ ] T088 [US5] Add empty state to MacroDonutChart in `src/components/charts/MacroDonutChart.tsx`: show message when no macro data, center aligned with EmptyState component
- [ ] T089 [P] [US5] Create MealBarChart component in `src/components/charts/MealBarChart.tsx`: Recharts BarChart, 4 bars (breakfast, lunch, dinner, snack), Y-axis = calories, X-axis = meal names
- [ ] T090 [US5] Add custom tooltip to MealBarChart in `src/components/charts/MealBarChart.tsx`: glassmorphism styled tooltip, show meal name and exact calorie value
- [ ] T091 [US5] Add responsive sizing to MealBarChart in `src/components/charts/MealBarChart.tsx`: ResponsiveContainer, adjust bar width and axis labels for mobile, touch-friendly bars
- [ ] T092 [US5] Add empty state to MealBarChart in `src/components/charts/MealBarChart.tsx`: show message when no meal data, centered with EmptyState component
- [ ] T093 [US5] Create charts section in dashboard in `src/app/dashboard/page.tsx`: add section above meals, two-column layout (donut + bar) on desktop, stacked on mobile
- [ ] T094 [US5] Add chart data preparation in dashboard in `src/app/dashboard/page.tsx`: extract macro values and meal calories from `nutritionData`, pass as props to charts
- [ ] T095 [US5] Add chart update animations in `src/components/charts/MacroDonutChart.tsx` and `MealBarChart.tsx`: animate data changes when date changes, use Recharts built-in animations
- [ ] T096 [US5] Add glassmorphism container to charts in `src/app/dashboard/page.tsx`: wrap charts in GlassCard components for cohesive design

**Checkpoint**: All 5 user stories complete! Full application functionality delivered.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, animations, and final touches

### Animations & Micro-interactions

- [ ] T097 [P] Add page transition animations to dashboard in `src/app/dashboard/page.tsx`: fade in on mount using Framer Motion
- [ ] T098 [P] Add stagger animations to meal sections in `src/app/dashboard/page.tsx`: animate meal cards sequentially with slight delay using Framer Motion
- [ ] T099 [P] Add hover animations to buttons in `src/components/ui/` and `src/components/auth/`: scale on hover, press feedback using Framer Motion or CSS transitions
- [ ] T100 [P] Add input focus animations in `src/components/auth/LoginForm.tsx`: smooth focus ring transitions, glassmorphism glow effect
- [ ] T101 [P] Add loading skeleton animations to dashboard in `src/app/dashboard/page.tsx`: shimmer effect for DailySummaryCard and MealSections while loading

### Error Handling & Edge Cases

- [ ] T102 [P] Add network error handling across all API calls in `src/services/yazio/`: detect offline state, show toast, enable retry, display cached data when available
- [ ] T103 [P] Add API error handling in `src/services/yazio/`: parse error responses, show user-friendly messages, handle rate limiting with exponential backoff
- [ ] T104 [P] Add token expiration handling in `src/contexts/AuthContext.tsx`: detect expired token, auto-refresh if possible, redirect to login with message if refresh fails
- [ ] T105 [P] Add long text overflow handling in `src/components/dashboard/FoodItemList.tsx`: ellipsis for long food names, tooltip on hover showing full name
- [ ] T106 [P] Add special character encoding in `src/services/export/txtExporter.ts`: properly encode Unicode characters, handle newlines in food names
- [ ] T107 [P] Add "no goals set" handling in `src/components/dashboard/DailySummaryCard.tsx`: hide remaining values or show "No goals set" message when user has no macro goals

### Performance Optimizations

- [ ] T108 [P] Add React.memo to expensive components in `src/components/dashboard/MealSection.tsx`, `src/components/charts/`: prevent unnecessary re-renders
- [ ] T109 [P] Add useMemo for macro calculations in `src/app/dashboard/page.tsx`: memoize summary calculations, meal totals
- [ ] T110 [P] Add lazy loading for charts in `src/app/dashboard/page.tsx`: React.lazy() to code-split Recharts, load charts only when needed
- [ ] T111 [P] Optimize cache invalidation in `src/services/storage/cache.ts`: cleanup expired entries periodically, limit cache size
- [ ] T112 [P] Add debouncing to refresh button in `src/components/ui/RefreshButton.tsx`: prevent spam clicking, 1-second debounce

### Accessibility Enhancements

- [ ] T113 [P] Add ARIA labels to interactive elements across all components: buttons, inputs, charts, modal dialogs
- [ ] T114 [P] Add keyboard navigation to DateSelector in `src/components/calendar/DateSelector.tsx`: arrow keys for date navigation, Enter to select, Escape to close
- [ ] T115 [P] Add keyboard navigation to modals in `src/components/calendar/DateRangePicker.tsx`: trap focus, Escape to close, Tab cycling
- [ ] T116 [P] Add focus indicators to all interactive elements: ensure 2px outline on focus, high contrast, visible on glass backgrounds
- [ ] T117 [P] Add screen reader announcements for dynamic content: announce date changes, data loading, errors using aria-live regions
- [ ] T118 Verify WCAG AA contrast ratios in `src/app/globals.css`: test all text/background combinations, adjust glassmorphism opacity if needed (target 4.5:1 minimum)

### Documentation & Code Quality

- [ ] T119 [P] Add JSDoc comments to all services in `src/services/`: document function parameters, return types, error conditions
- [ ] T120 [P] Add JSDoc comments to all hooks in `src/hooks/`: document hook usage, dependencies, return values
- [ ] T121 [P] Add component prop documentation in `src/components/`: PropTypes or TypeScript interface comments
- [ ] T122 [P] Update README.md with setup instructions, available scripts, architecture overview, deployment guide
- [ ] T123 [P] Code cleanup and formatting: run ESLint, fix warnings, ensure consistent code style across all files
- [ ] T124 [P] Remove console.log statements: clean up debug logs, replace with proper error handling or remove entirely

### Final Validation

- [ ] T125 Run production build: `yarn build`, verify no TypeScript errors, no build warnings, bundle size acceptable
- [ ] T126 Run ESLint: `yarn lint`, fix all errors and warnings
- [ ] T127 Manual testing of all 5 user stories: verify each story's acceptance criteria independently
- [ ] T128 Cross-browser testing: test on Chrome, Firefox, Safari, Edge (latest versions)
- [ ] T129 Mobile responsiveness testing: test on iOS Safari, Android Chrome, verify 320px-2560px range
- [ ] T130 Performance audit: run Lighthouse, verify >90 scores for Performance, Accessibility, Best Practices
- [ ] T131 Security audit: verify token encryption working, no sensitive data in localStorage unencrypted, no XSS vulnerabilities

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) AND User Story 1 (Phase 3) - Requires authentication
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) AND User Story 2 (Phase 4) - Requires nutrition data display
- **User Story 4 (Phase 6)**: Depends on Foundational (Phase 2) AND User Story 2 (Phase 4) - Requires nutrition data fetching
- **User Story 5 (Phase 7)**: Depends on Foundational (Phase 2) AND User Story 2 (Phase 4) - Requires nutrition data for visualization
- **Polish (Phase 8)**: Depends on completion of all desired user stories

### User Story Dependencies

- **User Story 1 (P1)**: Authentication - FOUNDATIONAL for all other stories
- **User Story 2 (P1)**: Daily Nutrition View - DEPENDS on US1 (authentication required)
- **User Story 3 (P2)**: Historical Data - DEPENDS on US1 + US2 (builds on daily view)
- **User Story 4 (P3)**: Export - DEPENDS on US1 + US2 (exports nutrition data)
- **User Story 5 (P3)**: Charts - DEPENDS on US1 + US2 (visualizes nutrition data)

**Note**: User Stories 3, 4, and 5 can be implemented in parallel after US1 + US2 are complete.

### Within Each User Story

- Foundation tasks (contexts, hooks) before components
- Utility/service tasks before components that use them
- Parent components before child components when tightly coupled
- Core implementation before polish (animations, error handling)

### Parallel Opportunities

- **Phase 1 (Setup)**: All tasks (T001-T008) can run in parallel
- **Phase 2 (Foundational)**: Within each subsection, tasks marked [P] can run in parallel:
  - Glassmorphism CSS tasks (T010-T012)
  - Core utilities (T014-T020)
  - Base UI components (T028-T030)
- **Within User Stories**: Tasks marked [P] can run in parallel:
  - US1: T033-T034, T039, T043 (separate files)
  - US2: T046-T047, T052-T057, T059 (separate components)
  - US3: T065-T066 (hook and component)
  - US4: T074, T077, T080, T082 (service, hook, components)
  - US5: T085, T089 (two charts)
- **Phase 8 (Polish)**: Most tasks marked [P] can run in parallel within each subsection

---

## Parallel Example: User Story 2 (Daily Nutrition View)

```bash
# After Foundational phase complete, launch these US2 tasks together:

# Contexts and hooks (separate files):
Task T046: "Create NutritionContext in src/contexts/NutritionContext.tsx"
Task T047: "Create useNutritionData hook in src/hooks/useNutritionData.ts"

# After contexts ready, launch component tasks together:
Task T052: "Create MacroProgress component in src/components/dashboard/MacroProgress.tsx"
Task T053: "Create DailySummaryCard component in src/components/dashboard/DailySummaryCard.tsx"
Task T055: "Create EmptyState component in src/components/dashboard/EmptyState.tsx"
Task T056: "Create FoodItemList component in src/components/dashboard/FoodItemList.tsx"
Task T057: "Create MealSection component in src/components/dashboard/MealSection.tsx"
Task T059: "Create RefreshButton component in src/components/ui/RefreshButton.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

**Minimum Viable Product** to deliver core value:

1. **Phase 1**: Complete Setup (T001-T008)
2. **Phase 2**: Complete Foundational (T009-T032) - CRITICAL PATH
3. **Phase 3**: Complete User Story 1 - Authentication (T033-T045)
4. **Phase 4**: Complete User Story 2 - Daily Nutrition View (T046-T064)
5. **STOP and VALIDATE**:
   - Test login/logout flow
   - Test today's nutrition data display
   - Test refresh functionality
   - Test on mobile and desktop
   - Verify performance goals (<10s login, <2s load)
6. **Deploy MVP** if validation passes

**MVP Delivers**:
- Users can securely log in with YAZIO credentials ✅
- Tokens persist across sessions ✅
- Today's nutrition data displays organized by meals ✅
- Macro summaries show consumed and remaining values ✅
- Manual refresh updates data ✅
- Glassmorphism design and animations ✅
- Mobile and desktop responsive ✅

### Incremental Delivery (Add Features Progressively)

**After MVP deployed, add features one at a time:**

1. **MVP**: US1 + US2 → Test independently → Deploy
2. **+Historical Data**: Add US3 (T065-T073) → Test independently → Deploy
3. **+Export**: Add US4 (T074-T084) → Test independently → Deploy
4. **+Charts**: Add US5 (T085-T096) → Test independently → Deploy
5. **Polish**: Phase 8 (T097-T131) → Final QA → Production Release

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy (If Multiple Developers Available)

**With 3+ developers after Foundational phase complete:**

1. **Team completes Setup + Foundational together** (T001-T032)
2. **Once Phase 2 done, split work:**
   - **Developer A**: User Story 1 (T033-T045) - Authentication [HIGHEST PRIORITY]
   - **Developer B**: User Story 2 foundation (T046-T051) - Wait for US1 AuthContext
   - **Developer C**: Foundational polish (animations, error handling prep)
3. **After US1 complete:**
   - **Developer A**: User Story 3 (T065-T073) - Historical Data
   - **Developer B**: Complete User Story 2 components (T052-T064)
   - **Developer C**: User Story 5 setup (chart components)
4. **After US2 complete:**
   - **Developer A**: Complete US3
   - **Developer B**: User Story 4 (T074-T084) - Export
   - **Developer C**: Complete User Story 5 (T085-T096) - Charts
5. **All developers**: Phase 8 Polish tasks in parallel

**Critical Path**: Setup → Foundational → US1 → US2 (These block everything else)

---

## Notes

- **[P] tasks** = Different files, no dependencies on incomplete tasks, safe to parallelize
- **[Story] labels** = Map each task to its user story for traceability and independence
- Each user story should be **independently completable and testable**
- **Tests NOT included**: Specification doesn't explicitly request TDD, so tests excluded. Validation via acceptance criteria and manual testing.
- **Commit frequently**: Commit after each task or logical group
- **Stop at checkpoints**: Validate story independence at each checkpoint
- **Glassmorphism WCAG**: Ensure 4.5:1 contrast ratio throughout (T118)
- **Mobile-first**: Build responsive from 320px up
- **Performance budget**: Monitor bundle size, code-split Recharts (T110)
- **Avoid**: Vague tasks, same-file conflicts in parallel tasks, breaking user story independence

---

## Task Summary

- **Total Tasks**: 131
- **Setup (Phase 1)**: 8 tasks
- **Foundational (Phase 2)**: 24 tasks (CRITICAL - blocks all stories)
- **User Story 1 (P1)**: 13 tasks (Authentication)
- **User Story 2 (P1)**: 19 tasks (Daily Nutrition View)
- **User Story 3 (P2)**: 9 tasks (Historical Data)
- **User Story 4 (P3)**: 11 tasks (Export)
- **User Story 5 (P3)**: 12 tasks (Charts)
- **Polish (Phase 8)**: 35 tasks (Animations, Accessibility, Performance, Documentation)

**Parallelizable Tasks**: 78 tasks marked with [P] flag

**MVP Scope** (Recommended first delivery):
- Phase 1: Setup (8 tasks)
- Phase 2: Foundational (24 tasks)
- Phase 3: User Story 1 (13 tasks)
- Phase 4: User Story 2 (19 tasks)
- **MVP Total**: 64 tasks → Delivers login + today's nutrition view

**Full Feature Set**: All 131 tasks → Delivers complete application with all 5 user stories + polish
