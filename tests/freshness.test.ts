import { describe, expect, it } from "vitest"
import { blocksForDays, classifyFreshness } from "../src/lib/freshness"

describe("freshness", () => {
  it("converts days to blocks", () => expect(blocksForDays(7, 2)).toBe(302_400n))
  it("classifies lifecycle boundaries", () => {
    expect(classifyFreshness(100n, 100n, 2)).toBe("STALE")
    expect(classifyFreshness(302_500n, 100n, 2)).toBe("EXPIRING_SOON")
    expect(classifyFreshness(302_501n, 100n, 2)).toBe("ACTIVE")
  })
})
