# The Station — Property Management Platform

## Project Overview
The Station is a two-product property management platform:
1. **Management Suite** (`apps/management`) — web app for property staff to manage tenants, units, payments, maintenance, leases, and communications
2. **Resident App** (`apps/resident`) — web app for tenants to pay rent, submit maintenance requests, book amenities, view leases, and receive updates

Both apps share a single backend via a monorepo architecture.

## Tech Stack
- **Monorepo:** Turborepo with pnpm workspaces
- **Framework:** Next.js 14+ (App Router) with TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase (Postgres, Auth with role-based access, Realtime, Storage)
- **Payments:** Stripe (ACH + card via Stripe Connect)
- **Deployment:** Vercel (both apps)
- **Package Manager:** pnpm

## Project Structure
```
the-station/
├── apps/
│   ├── management/        # Property staff web app (Next.js)
│   └── resident/          # Tenant web app (Next.js)
├── packages/
│   ├── db/                # Supabase schema, migrations, queries, RLS policies
│   ├── api/               # Shared API layer (tRPC or server actions)
│   ├── ui/                # Shared UI components
│   └── shared/            # Types, utils, constants shared across apps
├── supabase/              # Supabase config, seed data
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Key Architectural Decisions
- **Supabase Auth** handles both staff and resident authentication with custom roles via `app_metadata`
- **Row Level Security (RLS)** enforces data isolation — residents only see their own data, staff only see their property's data
- **Stripe Connect** — the platform acts as the Stripe Connect platform; each property is a connected account
- **Realtime subscriptions** power live maintenance status updates and notifications
- **Shared `packages/ui`** ensures visual consistency across both apps

## Database Conventions
- All tables use `snake_case`
- Every table has `id` (uuid), `created_at`, `updated_at`
- Foreign keys follow pattern: `{table_name}_id`
- Soft deletes via `deleted_at` timestamp where appropriate
- All tables have RLS enabled

## Code Conventions
- No `any` types
- No unused imports or variables
- No `console.log` in committed code
- Functional components with hooks
- Server components by default, `"use client"` only when needed
- Colocate related files (component + hook + types in same directory)
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`

## Environment Variables
All secrets go in `.env.local` (never committed). Required vars:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Build & Dev Commands
- `pnpm dev` — run all apps in dev mode
- `pnpm dev --filter management` — run only management app
- `pnpm dev --filter resident` — run only resident app
- `pnpm build` — build all apps
- `pnpm lint` — lint all packages
- `pnpm db:migrate` — run database migrations
- `pnpm db:seed` — seed development data

## Build Order (Phases)
1. **Phase 1:** Management suite foundation — auth, tenant CRUD, unit management, dashboard
2. **Phase 2:** Resident app — payments (Stripe), maintenance requests
3. **Phase 3:** Amenity booking, lease e-signing, reporting, push notifications
