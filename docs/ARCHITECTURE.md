## Architecture (simple words)

### Layers
- **UI layer**: React pages in `app/` show forms and tables.
- **Server actions**: Functions inside pages that save data.
- **Data layer**: Prisma reads/writes PostgreSQL.

### Data flow
1. User fills a form (example: create patient).
2. Server action validates input (zod in `lib/validators.ts`).
3. Prisma saves to database.
4. Page reloads with fresh data.

### Security
- NextAuth handles login.
- `middleware.ts` protects routes.
- `lib/rbac.ts` checks role/permission before access.

### Key modules
- `app/` includes routes and server actions for CRUD flows.
- `lib/` holds Prisma client, auth configuration, RBAC helpers, and formatting utilities.
- `prisma/` defines the schema, migrations, and seed data.

### Data model
Core entities include Patients, Providers, Appointments, Invoices, Payments, Audit Logs, and Files.

### Why this matters for jobs
This mirrors how real SaaS apps are built: auth, RBAC, data models, dashboards, and admin tools.
