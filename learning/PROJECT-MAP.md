# Project map: every file and where to learn it

This page lists **every important file** in the project and which learning doc explains it. Use it to master the codebase file by file.

---

## App entry and layout

| File | What it does | Learn in |
|------|----------------|----------|
| `app/layout.tsx` | Root layout: fonts, global providers, HTML shell. Wraps every page. | `architecture.md`, `ui-tailwind.md` |
| `app/page.tsx` | Home page: landing with links to sign-in and dashboard. | `architecture.md` |
| `app/globals.css` | Global styles and Tailwind imports. Theme variables (e.g. `--background`). | `ui-tailwind.md` |
| `app/providers.tsx` | Client context wrapper (e.g. for session). Uses `"use client"` so children can use client-side auth state. | `auth-rbac.md`, `data-fetching-and-calls.md` (client vs server) |

---

## Auth and access

| File | What it does | Learn in |
|------|----------------|----------|
| `app/signin/page.tsx` | Login form: email/password, calls NextAuth `signIn("credentials")`. | `auth-rbac.md` |
| `app/unauthorized/page.tsx` | Shown when user is logged in but lacks permission for a route. | `auth-rbac.md` |
| `app/api/auth/[...nextauth]/route.ts` | NextAuth API route: handles sign-in, callbacks, session. | `auth-rbac.md`, `data-fetching-and-calls.md` (API routes) |
| `middleware.ts` | Runs before each request: protects dashboard routes, redirects unauthenticated users to sign-in. | `auth-rbac.md`, `architecture.md` |
| `lib/auth.ts` | NextAuth config: credentials provider, `authorize` (password check with bcrypt), session callback, Prisma adapter. | `auth-rbac.md` |
| `lib/rbac.ts` | Permission checks: `requireAuth()`, `requireRole()`, `requirePermission()`. Uses `redirect()` from Next and `getServerAuthSession()`. | `auth-rbac.md`, `server-actions-validation.md` |
| `next-auth.d.ts` | TypeScript declaration to extend NextAuth session with custom fields (e.g. `user.id`, `user.role`). | `auth-rbac.md` (types), `REFERENCES.md` |

---

## Shared lib (database, validation, formatting, utils)

| File | What it does | Learn in |
|------|----------------|----------|
| `lib/db.ts` | Single Prisma client instance. Used everywhere we talk to the DB. Exports `prisma`. | `architecture.md`, `prisma-data-model.md`, `data-flow.md` |
| `lib/validators.ts` | Zod schemas for forms: patient, provider, appointment, invoice, user, etc. Used in server actions. | `server-actions-validation.md`, `data-flow.md` |
| `lib/format.ts` | Helpers for display: `formatMoney()`, `formatShortDate()`. Used in billing and dashboard. | `ui-tailwind.md` (display), `tests-ci.md` (tests in `tests/format.test.ts`) |
| `lib/utils.ts` | Utility `cn()` for merging Tailwind classes (e.g. with `clsx` and `tailwind-merge`). Used in UI components. | `ui-tailwind.md` |

---

## Feature: Patients

| File | What it does | Learn in |
|------|----------------|----------|
| `app/patients/page.tsx` | Patients list + create form. Fetches with Prisma, submits to `createPatient` action. | `data-flow.md`, `server-actions-validation.md`, `architecture.md` |
| `app/patients/actions.ts` | Server actions: create, update, delete patient. Validates with Zod, checks permission, revalidates path. | `server-actions-validation.md`, `data-flow.md` |
| `app/patients/[id]/edit/page.tsx` | Edit one patient by ID. Loads patient, form submits to update action. | Same as above (edit pattern). |

---

## Feature: Providers

| File | What it does | Learn in |
|------|----------------|----------|
| `app/providers/page.tsx` | Providers list + create form. Same pattern as patients. | `data-flow.md`, `server-actions-validation.md` |
| `app/providers/actions.ts` | Server actions: create, update, delete provider. | `server-actions-validation.md` |
| `app/providers/[id]/edit/page.tsx` | Edit one provider. | Same (edit pattern). |

---

## Feature: Appointments

| File | What it does | Learn in |
|------|----------------|----------|
| `app/appointments/page.tsx` | Appointments list + create form. Uses patient and provider relations. | `prisma-data-model.md`, `data-flow.md` |
| `app/appointments/actions.ts` | Server actions for appointments; uses enums (e.g. status). | `server-actions-validation.md`, `prisma-data-model.md` |
| `app/appointments/[id]/edit/page.tsx` | Edit one appointment. | Same (edit pattern). |

---

## Feature: Billing

| File | What it does | Learn in |
|------|----------------|----------|
| `app/billing/page.tsx` | Invoices and payments list; uses `formatMoney`, `formatShortDate`. | `data-flow.md`, `lib/format.ts` |
| `app/billing/actions.ts` | Server actions for invoices and payments; uses billing enums. | `server-actions-validation.md`, `prisma-data-model.md` |
| `app/billing/invoices/[id]/edit/page.tsx` | Edit one invoice. | Same (edit pattern). |

---

## Feature: Admin (users and roles)

| File | What it does | Learn in |
|------|----------------|----------|
| `app/admin/page.tsx` | Admin UI: list users, assign/remove roles, create user (email/password). | `auth-rbac.md` (RBAC), same data-flow pattern as other list pages |
| `app/admin/actions.ts` | Server actions: create user (with bcrypt hash), assign role, remove role. Requires admin permission. | `auth-rbac.md`, `server-actions-validation.md` |

---

## Dashboard

| File | What it does | Learn in |
|------|----------------|----------|
| `app/dashboard/page.tsx` | Dashboard: KPIs, recent appointments, recent invoices, audit log. Fetches from Prisma, uses `requireAuth()` and formatting. | `architecture.md`, `data-flow.md`, `exercises.md` (Level 1: add KPI) |

---

## Shell and UI components

| File | What it does | Learn in |
|------|----------------|----------|
| `components/app-shell.tsx` | Main app shell: nav links, user badge, sign-out. Used by dashboard and feature pages. | `ui-tailwind.md`, `auth-rbac.md` |
| `components/layout/app-shell.tsx` | Alternative/layout version of app shell. | Same. |
| `components/layout/sign-out-button.tsx` | Button that calls `signOut()`. Client component. | `auth-rbac.md` |
| `components/sign-out-button.tsx` | Same idea, used in main app-shell. | Same. |
| `components/ui/button.tsx` | Button component (shadcn). | `ui-tailwind.md` |
| `components/ui/card.tsx` | Card (title, content, header). | `ui-tailwind.md` |
| `components/ui/table.tsx` | Table primitives. | `ui-tailwind.md` |
| `components/ui/input.tsx` | Text input. | `ui-tailwind.md` |
| `components/ui/label.tsx` | Label for form fields. | `ui-tailwind.md` |
| `components/ui/select.tsx` | Select dropdown. | `ui-tailwind.md` |
| `components/ui/textarea.tsx` | Textarea. | `ui-tailwind.md` |
| `components/ui/badge.tsx` | Badge for status/role. | `ui-tailwind.md` |
| `components/ui/dropdown-menu.tsx` | Dropdown menu (e.g. for actions). | `ui-tailwind.md` |

---

## Database and config

| File | What it does | Learn in |
|------|----------------|----------|
| `prisma/schema.prisma` | Full data model: User, Role, Patient, Provider, Appointment, Invoice, Payment, AuditLog, etc. Enums and relations. | `prisma-data-model.md` |
| `prisma/seed.ts` | Seed script: creates roles, permissions, demo user (hashed password), sample data. Run with `npx prisma db seed`. | `prisma-data-model.md`, `auth-rbac.md` (permissions), `docs/setup.md` |
| `prisma.config.ts` | Prisma config: schema path, migrations path, seed command, datasource URL. Used by Prisma CLI. | `docs/setup.md` |
| `next.config.ts` | Next.js config (bundler, images, etc.). | `REFERENCES.md` (Next.js config) |
| `tsconfig.json` | TypeScript: paths (`@/*`), module resolution, Next plugin. | `docs/setup.md`, Troubleshooting |
| `next-env.d.ts` | References Next.js types so TypeScript knows about `next/cache`, `next/navigation`, etc. | `docs/setup.md` (Troubleshooting) |

---

## Tests and CI

| File | What it does | Learn in |
|------|----------------|----------|
| `tests/validators.test.ts` | Unit tests for Zod validators (e.g. patient schema). | `tests-ci.md` |
| `tests/format.test.ts` | Unit tests for `formatMoney`, `formatShortDate`. | `tests-ci.md` |
| `vitest.config.mts` | Vitest config: path alias `@`, test environment, test file pattern. | `tests-ci.md` |
| `.github/workflows/ci.yml` | GitHub Actions: runs lint and test on push. | `tests-ci.md` |

---

## How to use this map

1. **Follow the learning order** in `README.md` (architecture → data-flow → data-fetching → server-actions → prisma → auth → ui → tests → exercises).
2. **For each file you open**, find it in this map and read the “Learn in” doc(s) to understand it in depth.
3. **To master “every file”**: go through each row, open the file, and read the linked doc. Then make a tiny change and run the app or tests.

This way the learning docs and this map together cover every major and minor file in the project.
