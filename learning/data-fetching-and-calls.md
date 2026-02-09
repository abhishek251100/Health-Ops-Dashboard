# Data fetching & all types of calls (beginner)

This doc explains **how data is loaded and sent** in this app: from the basics of “what is an API call” to every kind of call we use. Read this after `architecture.md` and `data-flow.md`.

---

## 1. What is an “API call”? (basics)

- **API** = Application Programming Interface. In web apps it usually means: “a way for the frontend (or another service) to ask the server for data or to send data.”
- **API call** = one request from the client (browser or server) to get or send data.

In this project we don’t use a separate REST API for most features. We use **server-side code** and **server actions** instead. But the idea is the same: “call something to get or save data.”

---

## 2. Where does code run? (client vs server)

- **Server**: Node.js on your machine or the host (e.g. Vercel). Can use secrets, database, files.
- **Client**: The browser. Only sees what we send (HTML, JS, CSS). Cannot safely hold secrets or talk to the DB directly.

In Next.js App Router:

- By default, **components and pages are Server Components** → they run on the server.
- If you add `"use client"` at the top of a file, that code can run in the browser (Client Component).

So “calls” can be:

- **Server → database** (e.g. Prisma in a page or server action).
- **Browser → server** (form submit to a server action, or `fetch` to an API route).
- **Server → external API** (e.g. `fetch` from a server action or API route).

---

## 3. Types of calls in this project (and when we use them)

### A) Reading data in pages (server-side, no separate API)

We **fetch directly inside the page** (server component):

```ts
// app/patients/page.tsx (simplified)
const patients = await prisma.patient.findMany({ orderBy: { lastName: "asc" } });
```

- Runs on the **server** only.
- No “API route” needed; the page is the place that needs the data, so we load it there.
- Safe (DB credentials stay on server) and simple.

**When to use:** Whenever a page needs data to render (lists, dashboards, detail pages).

---

### B) Server actions (form submit / “do something on the server”)

Server actions are **functions that run on the server** and can read the DB, validate input, and revalidate the UI.

```ts
// app/patients/actions.ts
"use server";
export async function createPatient(formData: FormData) {
  await requirePermission("patients.write");
  const parsed = patientSchema.safeParse({ ... });
  if (!parsed.success) return;
  await prisma.patient.create({ data: parsed.data });
  revalidatePath("/patients");
}
```

- The **browser** “calls” this by submitting a form (or calling the action from a client component).
- The **code** of the action runs only on the **server**.
- We use this for: create, update, delete, and any action that must be secure and use the DB.

**When to use:** All mutations (create/edit/delete) and any action that must run on the server (permissions, DB, secrets).

---

### C) API routes (Route Handlers) – HTTP endpoints

Next.js **Route Handlers** live in `app/api/.../route.ts`. They are real HTTP endpoints (GET, POST, etc.).

Example in this app:

- `app/api/auth/[...nextauth]/route.ts` – NextAuth uses this for sign-in, callbacks, etc.

You could add more, e.g.:

```ts
// app/api/patients/route.ts
export async function GET() {
  const patients = await prisma.patient.findMany();
  return Response.json(patients);
}
```

- The **browser** (or another app) can call this with `fetch("/api/patients")`.
- The handler runs on the **server** and can use Prisma, env vars, etc.

**When to use:** When you need a “classic” API (e.g. for mobile apps, external systems, or client-side `fetch` to your own backend). In this dashboard we use them mainly for auth; most data goes through server components + server actions.

---

### D) Client-side `fetch` (calling an API from the browser)

If you write a Client Component, you can call an API with `fetch`:

```ts
"use client";
const res = await fetch("/api/something");
const data = await res.json();
```

- Runs in the **browser**.
- Can only talk to URLs the browser can reach (your own API routes or external APIs that allow CORS).
- We don’t use this for main CRUD in this project; we prefer server components + server actions for security and simplicity.

**When to use:** When you need dynamic, client-driven updates (e.g. search-as-you-type, polling) and you expose a safe API route for it.

---

## 4. Quick comparison (beginner cheat sheet)

| Type                     | Where it runs | Used for in this app              |
|--------------------------|---------------|-----------------------------------|
| Prisma in page/component | Server        | Reading data for the page         |
| Server action            | Server        | Forms, create/update/delete, auth |
| API route (Route Handler)| Server        | Auth (NextAuth), custom HTTP API  |
| `fetch` from client      | Browser       | Optional; we use it rarely here    |

---

## 5. What we don’t use (and why)

- **Separate REST API for CRUD** – We use server actions + Prisma instead; fewer moving parts and no need to design REST endpoints for every form.
- **Old “Pages Router” API routes** – This project uses App Router and `app/api/.../route.ts` (Route Handlers) when we need HTTP API.

---

## 6. Order of learning (recap)

1. **Architecture** – UI, server actions, DB.
2. **Data flow** – Form → server action → Prisma → revalidate.
3. **This doc** – All types of “calls”: server fetch, server actions, API routes, client fetch.
4. Then: **Server actions + validation**, **Prisma**, **Auth/RBAC**, **UI**, **Tests**.

---

## 7. Reference docs (updated)

- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching) – Server Components, caching, patterns.
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions) – Definition, forms, `"use server"`.
- [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) – API routes (GET, POST, etc.).
- [Server and Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components) – Where code runs.

For a full list of references and recommended videos, see `REFERENCES.md` and `videos-and-resources.md` in this folder.
