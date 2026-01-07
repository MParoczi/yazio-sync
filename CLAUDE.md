# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application called "yazio-sync" that integrates with the YAZIO API (via the `yazio` npm package). It uses the App Router architecture with TypeScript, React 19, and Tailwind CSS 4.

## Development Commands

### Development Server
```bash
pnpm dev
```
The dev server runs on http://localhost:3000 with hot module replacement.

### Build
```bash
pnpm build
```
Creates an optimized production build in `.next/`.

### Production Server
```bash
pnpm start
```
Runs the production build (must run `pnpm build` first).

### Linting
```bash
pnpm lint
```
Uses ESLint 9 with Next.js TypeScript and Core Web Vitals configurations.

## Architecture

### Next.js App Router Structure
- **`src/app/`** - App Router directory containing routes and layouts
  - `layout.tsx` - Root layout with Geist font configuration and metadata
  - `page.tsx` - Home page component
  - `globals.css` - Global styles with Tailwind CSS 4 and CSS theme variables

### TypeScript Configuration
- Uses ES2017 target with strict mode enabled
- Module resolution set to "bundler" for Next.js compatibility
- Path alias: `@/*` maps to `./src/*`
- JSX mode: `react-jsx` (React 19 automatic runtime)

### Styling
- **Tailwind CSS 4** using `@tailwindcss/postcss`
- Inline theme configuration via `@theme inline` directive in `globals.css`
- Custom CSS variables for theming (--background, --foreground, --font-sans, --font-mono)
- Dark mode support via `prefers-color-scheme` media query
- Geist Sans and Geist Mono fonts loaded from Google Fonts

### ESLint Configuration
- Uses flat config format (`eslint.config.mjs`)
- Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Key Dependencies

- **next**: 16.0.10 - React framework with App Router
- **react**: 19.2.1 - UI library
- **yazio**: ^1.1.3 - YAZIO API client library (core integration)
- **tailwindcss**: ^4 - Utility-first CSS framework

## Important Notes

- This project uses the Next.js App Router (not Pages Router)
- The project name suggests YAZIO integration, but the core functionality is not yet implemented in the starter template
- TypeScript is configured with strict mode - ensure type safety in all new code
- Uses Tailwind CSS 4 with the new `@import "tailwindcss"` syntax (not v3 syntax)
