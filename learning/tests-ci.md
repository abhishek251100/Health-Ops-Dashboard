## Tests + CI (why they matter)

### Tests
We use Vitest for fast unit tests.
File: `tests/validators.test.ts`

This test checks that your validators work.

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
