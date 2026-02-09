## Prisma + data model (plain English)

Prisma is the bridge between your code and the database.
You write a schema, Prisma generates a client, and you use it in code.

### Where the schema lives
`prisma/schema.prisma`

### Example model
```prisma
model Patient {
  id        String   @id @default(cuid())
  firstName String
  lastName  String
  createdAt DateTime @default(now())
}
```

### What the syntax means
- `model`: a database table.
- `id`: primary key.
- `String`: a text column.
- `@id`: primary key marker.
- `@default(cuid())`: auto-generate id.
- `DateTime`: date column.

### Relationships (simple)
```prisma
model Appointment {
  patientId String
  patient   Patient @relation(fields: [patientId], references: [id])
}
```
This means each appointment belongs to one patient.

### How you read/write data
```ts
const patients = await prisma.patient.findMany();
await prisma.patient.create({ data: { firstName: "Ava", lastName: "Stone" } });
```

### Why Prisma is good for jobs
Companies want you to be confident with real databases.
Prisma is one of the most common ORMs for Node.

### Practice tasks
- Add a `middleName` field to `Patient`.
- Add a `department` field to `Provider`.
- Run `npx prisma migrate dev` and update forms.

### Reference docs
- Prisma schema: https://www.prisma.io/docs/orm/prisma-schema
- Prisma relations: https://www.prisma.io/docs/orm/prisma-schema/data-model/relations
- Prisma Client queries: https://www.prisma.io/docs/orm/prisma-client/queries
