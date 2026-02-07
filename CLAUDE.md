# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Coast2Coast is a React/TypeScript web app for tracking and displaying a coast-to-coast road trip (SF to NYC). It features an interactive Leaflet map, photo gallery, guestbook, and admin panel. Backend is Supabase (Postgres, auth, storage). Deployed on Netlify.

## Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # Production build to dist/
npm run preview   # Preview production build
npm run lint      # ESLint on .ts/.tsx files
```

No test framework is configured.

## Architecture

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Supabase + Leaflet

**Key directories:**
- `src/services/` — Supabase data access layer (CRUD + realtime subscriptions for checkins, photos, guestbook, routes)
- `src/components/` — Feature-organized: `checkins/`, `guestbook/`, `map/`, `photos/`, `routes/`, `layout/`, `ui/`
- `src/pages/` — Route-level pages: Home, AdminPage, LoginPage, PhotosPage, GuestbookPage
- `src/contexts/AuthContext.tsx` — Global auth state via React Context
- `src/types/` — Shared type definitions; `supabase.ts` has auto-generated DB types
- `netlify/` — Netlify serverless functions (ORS proxy)

**Data flow pattern:** Components fetch data on mount via service functions, subscribe to Supabase Realtime channels for live updates, and unsubscribe on cleanup.

**Routing:** React Router with `RequireAuth` wrapper protecting admin routes. Auth is Supabase email/password.

**Map:** Leaflet with OpenRouteService API for road-following route polylines. ORS calls are proxied through a Netlify function to avoid CORS/key exposure.

## Environment Variables

Required in `.env` (see `.env.example`):
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon key
- `VITE_ORS_API_KEY` — OpenRouteService API key
