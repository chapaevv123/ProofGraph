import { createPublicClient, createWalletClient, ExpirationTime, jsonToPayload } from "@arkiv-network/sdk"
import { key } from "@arkiv-network/sdk/attr"
import { tiramisu } from "@arkiv-network/sdk/chains"
import { eq } from "@arkiv-network/sdk/query"
import { type Hex, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { rpcUrlFromEnv } from "../src/lib/arkiv.ts"
import { PROJECT_ID, validateWorkProofPayload, WORK_PROOF } from "../src/lib/proof.ts"

const rawKey = process.env.PRIVATE_KEY?.trim()
if (!rawKey || !/^(?:0x)?[0-9a-fA-F]{64}$/.test(rawKey)) throw new Error("A valid local PRIVATE_KEY is required")
const account = privateKeyToAccount((rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`) as Hex)
const expected = "0x765fb7e6a0BdDDc29f57eeCE34AEda0Fb318805d"
if (account.address.toLowerCase() !== expected.toLowerCase()) throw new Error("Signer does not match canonical creator")

const rpc = rpcUrlFromEnv()
const publicClient = createPublicClient({ chain: tiramisu, transport: http(rpc) })
const wallet = createWalletClient({ chain: tiramisu, transport: http(rpc), account })
type Receipt = { label: string; entityKey: Hex; txHash?: Hex; block: string; expiresAt: string; existing: boolean }
const receipts: Receipt[] = []

async function findOne(attribute: string, value: string) {
  const page = await publicClient.select({ key: true, createdAt: true, expiresAt: true, attributes: true })
    .where(eq("project_id", PROJECT_ID), eq(attribute, value)).limit(20).fetch()
  return page.entities.sort((a, b) => Number(b.createdAt - a.createdAt))[0]
}

async function createProof(spec: {
  label: string; agentId: string; capability: string; taskClass: string; summary: string
  tests: string; lifetime: ReturnType<typeof ExpirationTime.fromDays>; links?: Record<string, ReturnType<typeof key>>
}) {
  const existing = await findOne("seed_id", spec.label)
  if (existing) {
    receipts.push({ label: spec.label, entityKey: existing.key, block: existing.createdAt.toString(), expiresAt: existing.expiresAt.toString(), existing: true })
    return existing.key
  }
  const payload = validateWorkProofPayload({
    task_summary: spec.summary,
    tests_before: ["Synthetic verification fixture prepared"],
    tests_after: [spec.tests],
    files_changed: [`synthetic_demo/${spec.capability}/fixture.json`],
    evidence_refs: [`synthetic://proofgraph/sha256/${spec.label}`],
    unknowns: [],
    verification_summary: "Deterministic synthetic verification passed.",
  })
  const result = await wallet.createEntity({
    contentType: "application/json", payload: jsonToPayload(payload), expires: spec.lifetime,
    attributes: {
      project_id: PROJECT_ID, entity_type: WORK_PROOF, seed_id: spec.label,
      agent_id: spec.agentId, capability: spec.capability, result: "verified_pass",
      verifier_type: "deterministic_tests", task_class: spec.taskClass,
      risk_level: "low", schema_version: 1, data_class: "synthetic_demo", ...spec.links,
    },
  })
  const receipt = await publicClient.getTransactionReceipt({ hash: result.txHash })
  receipts.push({ label: spec.label, entityKey: result.entityKey, txHash: result.txHash, block: receipt.blockNumber.toString(), expiresAt: result.expiresAt.toString(), existing: false })
  return result.entityKey
}

async function createChallenge(target: Hex) {
  const existing = await findOne("seed_id", "challenge-research-v1")
  if (existing) {
    receipts.push({ label: "challenge-research-v1", entityKey: existing.key, block: existing.createdAt.toString(), expiresAt: existing.expiresAt.toString(), existing: true })
    return existing.key
  }
  const result = await wallet.createEntity({
    contentType: "application/json", expires: ExpirationTime.fromDays(14),
    payload: jsonToPayload({
      challenge_summary: "Synthetic reproduction attempt did not match the published protocol research result.",
      challenger_type: "independent_reproducer",
      reproduction_note: "Synthetic fixture used a pinned protocol snapshot and recorded a deterministic mismatch.",
    }),
    attributes: {
      project_id: PROJECT_ID, entity_type: "challenge", seed_id: "challenge-research-v1",
      target_proof: key(target), reason_class: "cannot_reproduce", status: "open",
      schema_version: 1, data_class: "synthetic_demo",
    },
  })
  const receipt = await publicClient.getTransactionReceipt({ hash: result.txHash })
  receipts.push({ label: "challenge-research-v1", entityKey: result.entityKey, txHash: result.txHash, block: receipt.blockNumber.toString(), expiresAt: result.expiresAt.toString(), existing: false })
  return result.entityKey
}

await createProof({ label: "proof-onchain-v1", agentId: "agent_demo_onchain_01", capability: "onchain_verification", taskClass: "receipt_validation", summary: "Validated synthetic transaction receipts against deterministic chain-state fixtures.", tests: "18 / 18 receipt and event assertions passing", lifetime: ExpirationTime.fromDays(30) })
await createProof({ label: "proof-data-v1", agentId: "agent_demo_data_01", capability: "postgres_pipeline", taskClass: "data_integrity", summary: "Repaired a synthetic PostgreSQL ingestion pipeline with idempotent replay checks.", tests: "21 / 21 pipeline and constraint checks passing", lifetime: ExpirationTime.fromDays(3) })
await createProof({ label: "proof-automation-v1", agentId: "agent_demo_automation_01", capability: "workflow_automation", taskClass: "workflow_recovery", summary: "Recovered a synthetic failed automation workflow and verified safe retries.", tests: "16 / 16 workflow transition checks passing", lifetime: ExpirationTime.fromMinutes(10) })
const research = await createProof({ label: "proof-research-v1", agentId: "agent_demo_research_01", capability: "protocol_research", taskClass: "protocol_analysis", summary: "Compared synthetic protocol upgrade behavior across pinned test fixtures.", tests: "11 / 11 protocol assertions initially passing", lifetime: ExpirationTime.fromDays(14) })
const challenge = await createChallenge(research)
await createProof({ label: "proof-research-v2", agentId: "agent_demo_research_01", capability: "protocol_research", taskClass: "protocol_reverification", summary: "Re-verified synthetic protocol findings with the challenged fixture pinned and reproduced.", tests: "17 / 17 revised protocol assertions passing", lifetime: ExpirationTime.fromDays(30), links: { previous_proof: key(research), reverification_of: key(research), resolves_challenge: key(challenge) } })

console.log(JSON.stringify({ chainId: tiramisu.id, creator: account.address, receipts }, null, 2))
