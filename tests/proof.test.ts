import { describe, expect, it } from "vitest"
import { demoProof, validateWorkProofPayload } from "../src/lib/proof"

describe("work proof payload", () => {
  it("accepts demo data", () => expect(validateWorkProofPayload(demoProof)).toEqual(demoProof))
  it("rejects unknown fields", () => expect(() => validateWorkProofPayload({ ...demoProof, score: 99 })).toThrow())
  it("rejects secret fields", () => expect(() => validateWorkProofPayload({ ...demoProof, private_key: "x" })).toThrow(/Sensitive field/))
  it("rejects key-like values", () => expect(() => validateWorkProofPayload({ ...demoProof, task_summary: `0x${"a".repeat(64)}` })).toThrow(/Sensitive-looking/))
})
