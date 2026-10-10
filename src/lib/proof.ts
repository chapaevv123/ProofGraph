import { z } from "zod"

export const PROJECT_ID = "proofgraph" as const
export const WORK_PROOF = "work_proof" as const

export const workProofPayloadSchema = z.object({
  task_summary: z.string().min(1).max(500),
  tests_before: z.array(z.string().max(200)).max(25),
  tests_after: z.array(z.string().max(200)).max(25),
  files_changed: z.array(z.string().max(240)).max(100),
  evidence_refs: z.array(z.string().max(500)).max(50),
  unknowns: z.array(z.string().max(500)).max(25),
  verification_summary: z.string().min(1).max(1000),
}).strict()

export type WorkProofPayload = z.infer<typeof workProofPayloadSchema>

const forbiddenKey = /(private[_-]?key|mnemonic|seed[_-]?phrase|api[_-]?token|authorization|cookie|session)/i
const secretLike = /(0x[a-f0-9]{64}|(?:bearer|basic)\s+[a-z0-9._~+/=-]{12,})/i

export function assertNoSensitiveData(value: unknown, path = "payload"): void {
  if (typeof value === "string" && secretLike.test(value)) {
    throw new Error(`Sensitive-looking value rejected at ${path}`)
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoSensitiveData(item, `${path}[${index}]`))
    return
  }
  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      if (forbiddenKey.test(key)) throw new Error(`Sensitive field rejected at ${path}.${key}`)
      assertNoSensitiveData(nested, `${path}.${key}`)
    }
  }
}

export function validateWorkProofPayload(input: unknown): WorkProofPayload {
  assertNoSensitiveData(input)
  return workProofPayloadSchema.parse(input)
}

export const demoProof = validateWorkProofPayload({
  task_summary: "Fixed malformed numeric input regression in a synthetic FastAPI service.",
  tests_before: ["1 failing regression test for malformed numeric input"],
  tests_after: ["14 / 14 passing"],
  files_changed: ["synthetic_demo/app/routes/numbers.py", "synthetic_demo/tests/test_numbers.py"],
  evidence_refs: ["synthetic://proofgraph/sha256/fastapi-numeric-regression-v1"],
  unknowns: [],
  verification_summary: "Deterministic test verification passed.",
})
