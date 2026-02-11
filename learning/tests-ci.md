## Tests + CI (why they matter)

### Tests
We use Vitest for fast unit tests. Config: `vitest.config.mts` (path alias `@`, Node environment).

- **`tests/validators.test.ts`** — checks Zod validators (e.g. patient schema).
- **`tests/format.test.ts`** — checks display helpers (`formatMoney`, `formatShortDate` from `lib/format.ts`).

Together these give confidence that validation and formatting behave as expected.

Example test:
```ts
it("accepts a basic patient", () => {
  const result = patientSchema.safeParse({
    firstName: "Ava",
    lastName: "Stone",
  });
  expect(result.success).toBe(true);
});
```

### CI (GitHub Actions)
File: `.github/workflows/ci.yml`
On every push, it runs:
- `npm run lint`
- `npm run test`

If tests fail, your badge goes red. If they pass, it is green.

### Why companies care
Tests = confidence.
CI = your safety net.

### Practice tasks
- Add a new test that checks bad input.
- Break a test on purpose and watch CI fail.

### Reference docs
- Vitest: https://vitest.dev/
- GitHub Actions: https://docs.github.com/actions
