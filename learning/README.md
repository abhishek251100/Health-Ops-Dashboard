## Learning Path (start here)

This folder teaches you the entire project from start to finish in plain English.
Read in order. Each file builds on the previous one. It is designed to help you rebuild this app without help.

### Recommended order
1) `architecture.md`
2) `data-flow.md`
3) `server-actions-validation.md`
4) `prisma-data-model.md`
5) `auth-rbac.md`
6) `ui-tailwind.md`
7) `tests-ci.md`
8) `exercises.md`
9) `glossary.md`

### What you will understand by the end
- How Next.js pages render and fetch data
- How server actions save and validate input
- How Prisma maps code to the database
- How login, sessions, roles, and permissions work
- How Tailwind and shadcn/ui build professional UIs
- How tests and CI keep code stable

### How to study (beginner-friendly)
- Read one file from this folder.
- Open the real project file it references.
- Find the same pattern in the code.
- Make a tiny change and run the app.

### Where to start if you feel stuck
- Start with `architecture.md` and `data-flow.md`.
- Then open `app/(app)/patients/page.tsx` and follow one form.
- Use `server-actions-validation.md` to understand every line.

### Real project files to keep open
- `app/(app)/dashboard/page.tsx`
- `app/(app)/patients/page.tsx`
- `lib/validators.ts`
- `lib/db.ts`
- `prisma/schema.prisma`

### Extra learning topics included
- TypeScript syntax used in this repo
- Zod validation patterns (required/optional/enum)
- Prisma relationships and indexes
- RBAC design and enforcement

### If you want more
If you want deeper, line‑by‑line explanations of any page, tell me the file name.

### External references (dashboard standards + UI patterns)
- Dashboard UX patterns: https://www.nngroup.com/articles/dashboard-design/
- Data table UX: https://www.nngroup.com/articles/tables/
- Form UX: https://www.nngroup.com/articles/web-form-design/
