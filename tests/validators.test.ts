import { describe, expect, it } from "vitest";

import { appointmentSchema, invoiceSchema, patientSchema, providerSchema } from "../lib/validators";

describe("validators", () => {
  it("accepts a basic patient", () => {
    const result = patientSchema.safeParse({
      firstName: "Ava",
      lastName: "Stone",
      email: "ava@healthops.local",
    });
    expect(result.success).toBe(true);
  });

  it("rejects appointment without ids", () => {
    const result = appointmentSchema.safeParse({
      scheduledAt: "2025-01-01T10:00",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a provider with minimum data", () => {
    const result = providerSchema.safeParse({
      firstName: "Leo",
      lastName: "Park",
    });
    expect(result.success).toBe(true);
  });

  it("requires invoice total", () => {
    const result = invoiceSchema.safeParse({
      patientId: "patient-id",
    });
    expect(result.success).toBe(false);
  });
});
