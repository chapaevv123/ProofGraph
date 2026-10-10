import { describe, expect, it } from "vitest"
import { proofQuery } from "../src/lib/arkiv"

it("filters namespace, capability, result, and expiry in Arkiv", () => {
  expect(proofQuery("python_fastapi", 123n).map(String).join(" AND ")).toContain("$expiresAt >= u64(123)")
  expect(proofQuery("python_fastapi", 123n).map(String).join(" AND ")).toContain("project_id = str('proofgraph')")
})
