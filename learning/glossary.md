## Glossary (plain English)

- **Next.js App Router**: File-based routing in `app/`.
- **Server Action**: A function that runs on the server; marked with `"use server"`.
- **Prisma**: ORM used to talk to the database.
- **Schema**: The blueprint of your database tables (e.g. `prisma/schema.prisma`).
- **RBAC**: Role-based access control (roles and permissions).
- **Session**: Logged-in user data (e.g. NextAuth session).
- **Migration**: Change to database structure (`npx prisma migrate dev`).
- **Seed**: Initial data for local development (`npx prisma db seed`); script in `prisma/seed.ts`.
- **Zod**: Validation library; we use it in `lib/validators.ts` and in server actions.
- **revalidatePath**: Next.js function (from `next/cache`) to refresh server-rendered data for a path after a mutation.
- **FormData**: Web API for form data; server actions often receive it from forms.
- **Path alias (`@/`)**: In this project `@/*` maps to the project root so we can write `@/lib/db` instead of `../../lib/db`.
- **bcryptjs**: Library used to hash passwords (e.g. in `lib/auth.ts` and `app/admin/actions.ts`); never store plain passwords.
