# YAZIO Sync

A modern, beautiful web application for viewing and tracking your YAZIO food intake data. Built with Next.js 16, React 19, and Tailwind CSS 4.

## Features

- **Secure Authentication** - Login with your YAZIO credentials to access your nutrition data
- **Daily Nutrition Dashboard** - View comprehensive daily summaries with macro tracking (calories, protein, carbs, fats)
- **Meal Breakdown** - Organized meal sections (Breakfast, Lunch, Dinner, Snacks) with detailed food item lists
- **Date Navigation** - Browse historical data with an intuitive calendar interface
- **Data Export** - Export your nutrition data for further analysis
- **Real-time Updates** - Refresh button to fetch the latest data from YAZIO
- **Responsive Design** - Works seamlessly across desktop, tablet, and mobile devices
- **Beautiful UI** - Modern glassmorphism design with smooth animations
- **Dark Mode** - Built with a dark theme optimized for extended viewing

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **UI Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Language**: [TypeScript 5](https://www.typescriptlang.org)
- **API Client**: [yazio](https://www.npmjs.com/package/yazio) (v1.1.3)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org)
- **Icons**: [Heroicons](https://heroicons.com)
- **Date Utilities**: [date-fns](https://date-fns.org)
- **Notifications**: [react-hot-toast](https://react-hot-toast.com)
- **Testing**: [Jest](https://jestjs.io), [React Testing Library](https://testing-library.com/react), [Playwright](https://playwright.dev)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher
- **pnpm** package manager (v10.x or higher)
- A **YAZIO account** with valid credentials

To install pnpm if you don't have it:

```bash
npm install -g pnpm
```

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd yazio-sync
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables** (if needed)

Create a `.env.local` file in the root directory if you need to configure any environment-specific settings.

## Development

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The development server includes:
- **Hot Module Replacement** - Changes appear instantly without losing state
- **Fast Refresh** - Automatic page reloads on file changes
- **Error Overlay** - Helpful error messages displayed in the browser

## Available Scripts

- **`pnpm dev`** - Start the development server on http://localhost:3000
- **`pnpm build`** - Create an optimized production build
- **`pnpm start`** - Run the production server (requires `pnpm build` first)
- **`pnpm lint`** - Run ESLint to check code quality

## Project Structure

```
yazio-sync/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with fonts and metadata
│   │   ├── page.tsx            # Login page (home)
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Main dashboard page
│   │   └── globals.css         # Global styles with Tailwind CSS
│   ├── components/             # React components
│   │   ├── auth/               # Authentication components
│   │   │   ├── LoginForm.tsx   # Login form with validation
│   │   │   └── LogoutButton.tsx
│   │   ├── calendar/           # Date selection components
│   │   │   ├── DateSelector.tsx
│   │   │   └── DateRangePicker.tsx
│   │   ├── dashboard/          # Dashboard components
│   │   │   ├── DailySummaryCard.tsx   # Macro summary with progress
│   │   │   ├── MacroProgress.tsx      # Individual macro progress bars
│   │   │   ├── MealSection.tsx        # Meal container component
│   │   │   ├── FoodItemList.tsx       # Food items list
│   │   │   └── EmptyState.tsx         # Empty state message
│   │   ├── export/             # Data export functionality
│   │   │   └── ExportButton.tsx
│   │   └── ui/                 # Reusable UI components
│   │       ├── GlassCard.tsx   # Glassmorphism card container
│   │       ├── LoadingSpinner.tsx
│   │       ├── RefreshButton.tsx
│   │       └── Toast.tsx       # Toast notifications
│   ├── contexts/               # React Context providers
│   │   ├── AuthContext.tsx     # Authentication state management
│   │   └── NutritionContext.tsx # Nutrition data state management
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Authentication logic
│   │   ├── useNutritionData.ts # Nutrition data fetching
│   │   └── useCalendar.ts      # Calendar/date selection logic
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Utility functions
│       ├── animations.ts       # Framer Motion variants
│       └── formatters.ts       # Date and number formatters
├── public/                     # Static assets
├── .eslintrc.js               # ESLint configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── next.config.js             # Next.js configuration
└── package.json               # Project dependencies

```

## Key Features in Detail

### Authentication
- Secure login using YAZIO credentials
- Session management with context API
- Automatic redirect to dashboard when authenticated
- Logout functionality with session cleanup

### Dashboard
- **Daily Summary Card**: Displays total calories consumed and macro breakdown
- **Macro Progress Bars**: Visual representation of protein, carbs, and fat intake vs. goals
- **Meal Sections**: Organized view of Breakfast, Lunch, Dinner, and Snacks
- **Food Item List**: Detailed list of all consumed food items with nutritional information
- **Empty States**: Helpful messages when no data is available

### Date Navigation
- **Calendar Selector**: Pick any historical date to view past nutrition data
- **Today Button**: Quick navigation back to current day
- **Date Display**: Clear indication of which date you're viewing

### Data Export
- Export your nutrition data for analysis in other tools
- Multiple export format support (planned)

### UI/UX
- **Glassmorphism Design**: Modern, semi-transparent cards with backdrop blur
- **Smooth Animations**: Page transitions and component animations using Framer Motion
- **Responsive Layout**: Optimized for all screen sizes
- **Loading States**: Spinner indicators during data fetching
- **Error Handling**: User-friendly error messages with retry options
- **Toast Notifications**: Non-intrusive feedback for user actions

## Configuration

### TypeScript
The project uses strict TypeScript configuration. Key settings:
- `strict: true` - Full type safety
- `target: ES2017` - Modern JavaScript features
- Path alias: `@/*` maps to `./src/*`

### ESLint
- Uses Next.js recommended configuration
- TypeScript support enabled
- Core Web Vitals rules included

### Tailwind CSS 4
- Uses the new `@import "tailwindcss"` syntax
- Inline theme configuration in `globals.css`
- Custom CSS variables for theming
- Dark mode via `prefers-color-scheme`

## Testing

The project includes configurations for:

- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright

```bash
# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e
```

## Building for Production

1. **Create production build**

```bash
pnpm build
```

This creates an optimized build in `.next/` with:
- Minified JavaScript and CSS
- Optimized images
- Static page generation where possible
- Automatic code splitting

2. **Start production server**

```bash
pnpm start
```

## Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository on Vercel
3. Vercel will automatically detect Next.js and configure the build
4. Your app will be deployed with a production URL

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/yazio-sync)

### Other Platforms

This Next.js app can be deployed to any platform that supports Node.js:
- [Netlify](https://www.netlify.com)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- [Railway](https://railway.app)
- [Render](https://render.com)
- Self-hosted with PM2 or Docker

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for detailed instructions.

## Environment Variables

If you need to configure environment-specific settings, create a `.env.local` file:

```bash
# Example environment variables
# Add any API keys or configuration here
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Acknowledgments

- Built with [Next.js](https://nextjs.org) by Vercel
- Uses the [YAZIO API](https://www.yazio.com) for nutrition data
- Icons by [Heroicons](https://heroicons.com)
- Fonts: [Geist Sans](https://vercel.com/font) and Geist Mono

## Support

For issues or questions, please open an issue on the GitHub repository.

---

**Note**: This application requires a valid YAZIO account to function. Make sure you have your YAZIO credentials ready before using the app.
