## Server actions and validation (deep dive)

Server actions are functions marked with `"use server"`.
They run only on the server and can safely access the database.

### Example pattern
```ts
"use server";
await requirePermission("patients.write");
const parsed = patientSchema.safeParse({ ... });
if (!parsed.success) return;
await prisma.patient.create({ data: parsed.data });
revalidatePath("/patients");
```

### What each line means
- `"use server"`: tells Next.js this function runs on the server.
- `requirePermission(...)`: checks RBAC before writing.
- `patientSchema.safeParse(...)`: validates user input.
- `if (!parsed.success) return;`: stops if input is bad.
- `prisma.patient.create(...)`: writes to DB.
- `revalidatePath(...)`: (from `next/cache`) tells Next.js to refresh server-rendered data for that path so the UI shows the latest data.

### Why validate
Forms can be manipulated. Validation protects your database.
We use `zod` in `lib/validators.ts`.

### Zod basics (simple)
```ts
const patientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
});
```
- `z.object(...)` describes a shape.
- `z.string()` means "must be a string".
- `min(1)` means "cannot be empty".
- `optional()` means "can be undefined".
- `or(z.literal(""))` allows empty string.

### TypeScript syntax you should know
- `const`: define a constant.
- `await`: wait for async work (database).
- `async function`: function that returns a Promise.
- `type`: reusable type definitions.

### Common mistakes (and fixes)
- Passing empty strings to date fields -> convert to `null`.
- Converting string to number -> use `Number()` and check `isFinite`.

### Reference docs
- Zod: https://zod.dev/
- Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions
