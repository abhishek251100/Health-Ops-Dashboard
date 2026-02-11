## Learning Path (start here)

This folder teaches you the entire project from start to finish in plain English.
Read in order. Each file builds on the previous one. It is designed to help you rebuild this app without help.

### Recommended order
1) `architecture.md`
2) `data-flow.md`
3) `data-fetching-and-calls.md` — API calls, server actions, Route Handlers, client vs server (basics)
4) `server-actions-validation.md`
5) `prisma-data-model.md`
6) `auth-rbac.md`
7) `ui-tailwind.md`
8) `tests-ci.md`
9) `exercises.md`
10) `glossary.md`

**Master every file**  
- **`PROJECT-MAP.md`** — lists **every** important file in the app, what it does, and which doc explains it. Use it to go through the codebase file by file (minor and major details).

**Reference & videos (use anytime)**  
- `REFERENCES.md` — all official docs (Next.js, Prisma, Zod, etc.) in one place  
- `videos-and-resources.md` — beginner-friendly videos and courses (current, not outdated)

### What you will understand by the end
- How Next.js pages render and fetch data
- What an API call is and all types of calls we use (server fetch, server actions, API routes, client fetch)
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

### Red squiggles: "Cannot find module"
If the editor shows errors like **Cannot find module 'next/cache'** or **Cannot find module 'bcryptjs'** (or `next/navigation`, `@/lib/...`, etc.), that is usually a **setup** issue, not a mistake in the learning docs or the code. Run `npm install`, run `npx prisma generate`, and **open the `Health-Ops-Dashboard` folder** (not the parent) in your editor so the IDE sees `node_modules` and path aliases. See **docs/setup.md** → Troubleshooting.

### Where to start if you feel stuck
- Start with `architecture.md` and `data-flow.md`.
- Then open `app/patients/page.tsx` and follow one form.
- Use `server-actions-validation.md` to understand every line.

### Real project files to keep open
- `app/dashboard/page.tsx`
- `app/patients/page.tsx`
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

### Reference docs & videos
- **REFERENCES.md** — full list of updated official docs (Next.js, Prisma, Zod, Tailwind, Vitest, UX).
- **videos-and-resources.md** — current beginner videos and courses (Next.js Learn, official channels); no old or outdated material.
