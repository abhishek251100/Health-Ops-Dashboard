import { describe, expect, it } from "vitest";

import { formatMoney, formatShortDate } from "@/lib/format";

describe("format helpers", () => {
  it("formats cents into dollars", () => {
    expect(formatMoney(12345)).toBe("$123.45");
  });

  it("formats dates safely", () => {
    const date = new Date("2025-01-15T00:00:00Z");
    expect(formatShortDate(date)).toContain("Jan");
    expect(formatShortDate(null)).toBe("—");
  });
});
