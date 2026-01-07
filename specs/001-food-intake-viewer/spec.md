# Feature Specification: YAZIO Food Intake Viewer

**Feature Branch**: `001-food-intake-viewer`
**Created**: 2025-12-12
**Status**: Draft
**Input**: User description: "I want to create an application in which I am able to track my food intake. In the application I am not able to modify or add my consumption but to view it via the Yazio package (already installed in the project). The user is able to log in to the system with their Yazio credentials (e-mail and password). Using the credentials the user is authenticated to the Yazio API. The user has the option to remain logged in. In this case after authentication the authentication token from the Yazio API is stored securely. On the main page the user can see the daily consumption separated into breakfast, lunch, dinner and snack. The items are listed for each meal and the summary for the meal is listed (carbohydrate, protein, fat, calories). On the top of the screen summary for the whole day is displayed (carbohydrate, protein, fat, calories with the remaining values for them that can be consumed for that day). The user from a calendar can choose any other day and get the data for that day in the same way as for the current day. The user has the option to select a date range and export to a .txt file every meal with details which have been consumed in that time period. The pages have to be optimized for desktop and mobile use as well. Use interesting graphs, animations and glassmorphism as main design style"

## Clarifications

### Session 2025-12-12

- Q: How should the authentication token be stored when "remain logged in" is selected? → A: Browser localStorage with encrypted token
- Q: How should food item quantities be displayed to the user (e.g., "100g", "1 serving", "2.5 cups")? → A: Display as returned by YAZIO API without conversion
- Q: What caching strategy should be used for YAZIO API data to balance freshness and performance? → A: Cache with 5-minute TTL, refresh on user action
- Q: What format should the exported .txt file use to present the nutrition data? → A: Structured sections with headers and indentation
- Q: What specific graph types and interactivity level should be implemented for visualizing nutrition data? → A: Donut chart for macros + bar chart for meals, static with tooltips

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Login and Authentication (Priority: P1)

A user wants to access their YAZIO nutrition data by logging in with their existing YAZIO account credentials. They can choose to stay logged in for convenience, and the system securely stores their authentication token for future sessions.

**Why this priority**: Authentication is the gateway to all other features. Without secure login, users cannot access any nutrition data. This is the foundational capability that enables all other user stories.

**Independent Test**: Can be fully tested by attempting to log in with valid YAZIO credentials, verifying the authentication token is received, and confirming the "remain logged in" option persists the session across browser restarts. Delivers the ability to access the application securely.

**Acceptance Scenarios**:

1. **Given** a user on the login page, **When** they enter valid YAZIO email and password, **Then** they are authenticated and redirected to the main dashboard
2. **Given** a user on the login page, **When** they select "remain logged in" and log in successfully, **Then** their authentication token is stored securely and they remain authenticated across browser sessions
3. **Given** a user enters invalid credentials, **When** they submit the login form, **Then** they see a clear error message indicating authentication failed
4. **Given** an authenticated user, **When** they close and reopen the browser (with "remain logged in" enabled), **Then** they are still authenticated and see their dashboard without re-entering credentials
5. **Given** an authenticated user, **When** the authentication token expires or becomes invalid, **Then** they are redirected to the login page with a message indicating they need to log in again

---

### User Story 2 - View Daily Nutrition Overview (Priority: P1)

A user who has logged in wants to see their current day's food consumption organized by meal type (breakfast, lunch, dinner, snack) with individual items listed under each meal. They also want to see macro summaries for each meal and an overall daily summary showing consumed and remaining macros.

**Why this priority**: This is the core value proposition of the application - viewing nutrition data. Together with authentication, this forms the minimum viable product that delivers immediate user value.

**Independent Test**: Can be fully tested by logging in and verifying that today's food consumption appears correctly organized by meals, with accurate macro summaries per meal and a daily summary at the top showing consumed and remaining values. Delivers the primary functionality users need daily.

**Acceptance Scenarios**:

1. **Given** an authenticated user on the main dashboard, **When** the page loads, **Then** they see today's date and a summary card at the top displaying total carbohydrates, protein, fat, and calories consumed, plus remaining amounts for each macro
2. **Given** an authenticated user viewing today's data, **When** they scroll down, **Then** they see four sections (Breakfast, Lunch, Dinner, Snack) with consumed food items listed under each relevant meal
3. **Given** a meal section with food items, **When** the user views the meal, **Then** each food item displays its name and quantity, and the meal section shows a summary with total carbohydrates, protein, fat, and calories for that meal
4. **Given** a user has not consumed any food for a specific meal, **When** they view that meal section, **Then** it displays "No items logged" or similar empty state message
5. **Given** a user's daily macro goals from YAZIO, **When** viewing the daily summary, **Then** the remaining values accurately reflect (goal - consumed) for each macro, showing 0 if the goal is met or exceeded

---

### User Story 3 - Browse Historical Nutrition Data (Priority: P2)

A user wants to review their food consumption from previous days by selecting a specific date from a calendar interface. The selected date's data is displayed in the same format as the current day view.

**Why this priority**: After viewing today's data, users naturally want to review past days for tracking progress, identifying patterns, or verifying past entries. This enhances the tracking value without being essential for day-to-day use.

**Independent Test**: Can be fully tested by opening the calendar, selecting a past date, and verifying that the selected date's consumption data loads and displays correctly with the same meal organization and macro summaries. Delivers historical tracking capability independently of other features.

**Acceptance Scenarios**:

1. **Given** an authenticated user on the dashboard, **When** they click the calendar icon or date selector, **Then** a calendar interface appears allowing them to select any date
2. **Given** a calendar interface is open, **When** the user selects a past date, **Then** the dashboard updates to show that date's food consumption in the same format (meals, items, summaries)
3. **Given** a user viewing a past date, **When** they select today's date from the calendar, **Then** the dashboard returns to showing current day data
4. **Given** a user selects a date with no food entries, **When** the data loads, **Then** all meal sections show empty states and the daily summary shows 0 for all macros consumed
5. **Given** a user selects a future date, **When** attempting to view the data, **Then** the system shows an appropriate message (e.g., "No data available for future dates") or prevents future date selection

---

### User Story 4 - Export Nutrition Data to Text File (Priority: P3)

A user wants to export their nutrition data for a specific date range to a text file for record-keeping, sharing with healthcare providers, or personal analysis.

**Why this priority**: This is a valuable feature for power users who want to keep external records or share data with professionals, but it's not essential for daily nutrition tracking. Most users will primarily use the in-app viewing features.

**Independent Test**: Can be fully tested by selecting a date range, initiating the export, and verifying that a .txt file is generated containing all meals and details for the selected period in a readable format. Delivers data portability independently of viewing features.

**Acceptance Scenarios**:

1. **Given** an authenticated user on the dashboard, **When** they click an "Export" button or menu option, **Then** they see a date range selector with start date and end date fields
2. **Given** a date range selector, **When** the user selects a start date and end date (end date must be after or equal to start date), **Then** they can confirm the export action
3. **Given** a user confirms a date range export, **When** the export processes, **Then** a .txt file is downloaded containing all meals and food items for each day in the range, organized by date and meal type
4. **Given** an exported .txt file, **When** the user opens it, **Then** it contains readable information including: date, meal type, food item names, quantities, and macro values (carbs, protein, fat, calories) for each item, plus meal summaries and daily summaries
5. **Given** a user selects a date range with no food entries, **When** they export, **Then** the .txt file contains the date range header with a message indicating no food was logged during this period

---

### User Story 5 - Visual Data Representation (Priority: P3)

A user wants to see their nutrition data represented visually through graphs and charts to better understand their consumption patterns and macro distribution.

**Why this priority**: Visual representations enhance understanding and engagement but are not essential for basic tracking. Users can accomplish their primary goals (viewing and tracking) through the text-based meal listings. Graphs add value for trend analysis and motivation.

**Independent Test**: Can be fully tested by logging in and verifying that visual graphs appear showing macro distribution (e.g., pie chart of carbs/protein/fat), daily trends, or meal comparisons. Delivers enhanced data visualization independently of other features.

**Acceptance Scenarios**:

1. **Given** an authenticated user viewing daily data, **When** the page loads, **Then** they see a donut chart showing percentage breakdown of carbohydrates, protein, and fat, and a bar chart comparing calorie consumption across Breakfast, Lunch, Dinner, and Snack
2. **Given** a user viewing historical data via calendar, **When** they select a date, **Then** both the donut chart and bar chart update to reflect that date's macro distribution and meal calorie comparison
3. **Given** a user hovering over (desktop) or tapping (mobile) a chart segment, **When** interacting with the graph, **Then** a tooltip displays showing the precise value for that data point
4. **Given** a user with no food entries for the day, **When** viewing the dashboard, **Then** both charts show an empty or zero state with a helpful message indicating no data available
5. **Given** a user on a mobile device, **When** viewing graphs, **Then** both the donut chart and bar chart are responsive, touch-friendly, and readable on small screens with tooltips working on tap

---

### Edge Cases

- What happens when the YAZIO API is unavailable or returns an error? System should display a user-friendly error message and allow retry without losing authentication state.
- What happens when a user's authentication token expires while browsing? System should detect expired sessions and redirect to login with a message explaining the timeout.
- What happens when a user selects a very large date range for export (e.g., 1+ year)? System should either limit the date range selection (with a helpful message about the maximum range) or process the export with a loading indicator for large datasets.
- What happens when a user has extremely long food item names or unusual characters? System should handle text overflow gracefully with ellipsis or wrapping, and properly encode special characters in exports.
- What happens when network connectivity is lost while viewing data? System should display cached data if available and show a network status indicator, allowing users to continue viewing previously loaded information.
- What happens when a user has no macro goals set in YAZIO? System should display consumed macros but handle the "remaining" calculation gracefully (either hide it or show "No goals set").
- What happens when a user tries to export data for dates before they created their YAZIO account? System should handle empty results gracefully and include a note in the export file indicating no data available for certain dates.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a login form accepting email and password credentials
- **FR-002**: System MUST authenticate users against the YAZIO API using the provided credentials
- **FR-003**: System MUST provide a "remain logged in" option during login that persists authentication across browser sessions
- **FR-004**: System MUST securely store authentication tokens when "remain logged in" is selected using browser localStorage with encryption applied to the token before storage
- **FR-005**: System MUST display a logout option for authenticated users to explicitly end their session
- **FR-006**: System MUST retrieve and display current day's food consumption data from YAZIO API upon successful authentication
- **FR-007**: System MUST organize daily food consumption into four meal categories: Breakfast, Lunch, Dinner, and Snack
- **FR-008**: System MUST display individual food items within each meal category showing item name and quantity (displayed exactly as returned by YAZIO API without unit conversion)
- **FR-009**: System MUST calculate and display macro summaries for each meal including: carbohydrates, protein, fat, and calories
- **FR-010**: System MUST display a daily summary at the top of the page showing total consumed and remaining values for: carbohydrates, protein, fat, and calories
- **FR-011**: System MUST provide a calendar interface allowing users to select any date for viewing historical data
- **FR-012**: System MUST retrieve and display food consumption data for the selected date in the same format as current day view
- **FR-013**: System MUST provide a date range selector for exporting data
- **FR-014**: System MUST generate a .txt file export containing all meals and food item details for the selected date range
- **FR-015**: Exported .txt file MUST include for each day: date, meal types, food items with names and quantities, macro values per item, meal summaries, and daily summaries, formatted using structured sections with headers and indentation for readability
- **FR-016**: System MUST display two visual graphs: (1) a donut chart showing macro distribution percentages (carbohydrates, protein, fat), and (2) a bar chart comparing calorie consumption across meals (Breakfast, Lunch, Dinner, Snack)
- **FR-017**: System MUST update visual graphs when users select different dates via the calendar
- **FR-027**: Graph visualizations MUST be static charts with interactive tooltips that display on hover (desktop) or tap (mobile) showing precise values
- **FR-018**: System MUST be fully responsive and functional on desktop (1920px+) and mobile (320px-767px) viewports
- **FR-019**: System MUST use glassmorphism design principles for UI components (semi-transparent backgrounds, backdrop blur, subtle borders)
- **FR-020**: System MUST include smooth animations for transitions, data loading, and user interactions
- **FR-021**: System MUST handle YAZIO API errors gracefully with user-friendly error messages
- **FR-022**: System MUST detect expired authentication sessions and redirect to login with appropriate messaging
- **FR-023**: System MUST provide loading indicators for all asynchronous operations exceeding 300ms
- **FR-024**: System MUST prevent users from modifying or adding food consumption data (read-only access to YAZIO data)
- **FR-025**: System MUST cache YAZIO API nutrition data with a 5-minute time-to-live (TTL) to reduce API calls while maintaining reasonable data freshness
- **FR-026**: System MUST provide a manual refresh action (e.g., pull-to-refresh on mobile, refresh button on desktop) allowing users to bypass cache and fetch latest data from YAZIO API on demand

### Key Entities

- **User Session**: Represents an authenticated user's session, including authentication token (stored encrypted in browser localStorage when "remain logged in" is enabled), login state, and "remain logged in" preference. Related to User Credentials and consumed Food Data.

- **User Credentials**: Email and password provided by the user for YAZIO authentication. Used once per session to obtain authentication token.

- **Food Item**: Individual consumable entry with name, quantity (displayed as returned by YAZIO API without conversion, e.g., "100g", "1 serving"), and macro values (carbohydrates, protein, fat, calories). Belongs to a specific Meal.

- **Meal**: Categorical grouping of Food Items, one of four types (Breakfast, Lunch, Dinner, Snack). Contains multiple Food Items and has calculated macro summaries.

- **Daily Summary**: Aggregated nutrition data for a single day, including total consumed macros, macro goals, and remaining values. Composed of multiple Meals.

- **Date Selection**: User-chosen date for viewing historical data or a date range for export purposes. Determines which Daily Summary to retrieve.

- **Export Data**: Text file representation of Daily Summaries across a date range, formatted using structured sections with headers and indentation (e.g., date headers, indented meal sections, indented food items) for human readability and external use.

- **Visual Graph**: Two chart types for visualizing nutrition data: (1) Donut chart displaying macro distribution percentages, and (2) Bar chart comparing calorie consumption across meals. Both are static charts with interactive tooltips. Derived from Daily Summary data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete login and view their current day's nutrition data within 10 seconds of entering credentials (assuming normal network conditions)

- **SC-002**: 95% of users successfully authenticate on their first attempt when using valid credentials

- **SC-003**: Page load time for daily nutrition view is under 2 seconds on 3G network connection

- **SC-004**: Mobile users can navigate all features (login, daily view, calendar, export) with touch interactions without horizontal scrolling

- **SC-005**: Users can select a historical date and view that date's data within 3 seconds of date selection

- **SC-006**: Export functionality generates .txt file within 5 seconds for date ranges up to 30 days

- **SC-007**: All UI components maintain WCAG AA contrast standards (minimum 4.5:1) while using glassmorphism design

- **SC-008**: 90% of users successfully complete their primary task (viewing daily nutrition data) on first visit without assistance

- **SC-009**: System maintains responsive layout integrity on viewport widths from 320px to 2560px without breaking or horizontal scroll

- **SC-010**: Users can identify their remaining daily macro allowance within 5 seconds of viewing the dashboard

- **SC-011**: Authentication tokens persist for at least 30 days when "remain logged in" is selected

- **SC-012**: All graphs and visualizations render correctly and are interactive on both desktop and mobile devices

## Assumptions

- Users already have active YAZIO accounts with existing food consumption data
- The YAZIO npm package provides authentication methods and data retrieval endpoints for all required features
- YAZIO API returns macro goals along with consumption data (or provides a separate endpoint for goals)
- Authentication tokens from YAZIO API have a defined expiration time that can be validated
- Users primarily want to view macronutrients (carbs, protein, fat, calories) rather than micronutrients or other nutritional data
- Date range exports will typically be for periods of 1-90 days (not years)
- The glassmorphism design style will use the existing Tailwind CSS configuration with custom backdrop-blur and opacity classes
- A standard charting library compatible with Next.js (e.g., Recharts, Chart.js, or similar) will be used to implement donut charts and bar charts with tooltip functionality
- Browser localStorage with client-side token encryption (e.g., using Web Crypto API or similar) provides adequate security for the authentication token
- YAZIO API has reasonable rate limits that accommodate the 5-minute cache TTL strategy without throttling issues
- Client-side caching (e.g., in-memory or browser cache API) is sufficient for storing nutrition data temporarily
- Users understand that this is a read-only view of their YAZIO data and modifications must be made in the official YAZIO app

## Out of Scope

- User registration or account creation (users must have existing YAZIO accounts)
- Adding, editing, or deleting food entries (read-only access only)
- Creating or modifying macro goals (managed through YAZIO)
- Social features, sharing, or collaboration
- Barcode scanning or food database search
- Recipe creation or meal planning
- Integration with other nutrition tracking platforms
- Offline data access (requires internet connection to fetch from YAZIO API)
- Custom report generation beyond simple .txt export
- Multi-language support (will use English by default)
- Data synchronization conflicts (always uses YAZIO as source of truth)
