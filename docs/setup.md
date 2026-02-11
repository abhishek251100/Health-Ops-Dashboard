## Setup

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment
Copy `.env.example` to `.env` and update `DATABASE_URL`.

### 3) Generate Prisma client (for types and IDE)
```bash
npx prisma generate
```
Use a valid `DATABASE_URL` in `.env` (or a placeholder) so the config loads; this generates `@prisma/client` and fixes "has no exported member" for enums.

### 4) Initialize database
```bash
npx prisma migrate dev
npx prisma db seed
```

### 5) Run the app
```bash
npm run dev
```

Open `http://localhost:3000`

### Demo login
- Email: `admin@healthops.local`
- Password: `Admin123!`

### Troubleshooting

**"Cannot find module 'next/cache'" or "Cannot find module 'bcryptjs'" (or next/link, zod, @/lib/..., etc.)**

- The IDE or TypeScript can’t see installed packages or path aliases.
- **Fix 1:** From the **project root** (the folder that contains `package.json`) run `npm install`. Ensure `node_modules` exists.
- **Fix 2:** Open the **app folder** in your editor (e.g. **Health-Ops-Dashboard**), not the parent (e.g. Health-Ops). If the workspace root is the parent, the IDE may not resolve `node_modules` or `@/*` paths and will show “Cannot find module” even when the code is correct.
- **Fix 3:** Run `npx prisma generate` so Prisma client and enums are generated (see step 3 above).
- **Fix 4:** Restart the TypeScript server: Command Palette → “TypeScript: Restart TS Server”.
