## Learning Guide (plain English)

This project is built like a real product. Use this guide to learn step by step.

### 1) Big picture
- The app is a dashboard for healthcare operations.
- Pages are grouped by workflow: patients, appointments, providers, billing, admin.
- Data is stored in PostgreSQL using Prisma.

### 2) Where to look first
- `app/(app)/dashboard/page.tsx`: KPI dashboard and tables.
- `app/(app)/patients/page.tsx`: patient CRUD + document links.
- `app/(app)/appointments/page.tsx`: scheduling and status updates.
- `app/(app)/billing/page.tsx`: invoices and payments.
- `app/(app)/admin/page.tsx`: roles, permissions, users.

### 3) How data moves
1. User submits a form.
2. A server action reads the form.
3. The action saves to Prisma.
4. The page refreshes and shows updated data.

### 4) How auth works (simple)
- Users sign in on `/signin`.
- NextAuth checks the password from the database.
- Every dashboard page checks your role/permissions.

### 5) How to learn fast
- Read one page at a time.
- Trace form -> server action -> Prisma call.
- Compare database fields with the form fields.

### 6) Good practice tasks
- Add a new field to a model (Prisma + form + table).
- Add a new permission and use it in a page.
- Add a new KPI to the dashboard.
