import { createPublicClient, type Entity } from "@arkiv-network/sdk"
import { tiramisu } from "@arkiv-network/sdk/chains"
import { u64 } from "@arkiv-network/sdk/attr"
import { eq, gte, type Expression } from "@arkiv-network/sdk/query"
import { http, type Hex } from "viem"
import { blocksForDays, classifyFreshness, type Freshness } from "./freshness.ts"
import { PROJECT_ID, WORK_PROOF } from "./proof.ts"

export type ChallengeState = "CLEAR" | "CHALLENGED"
export type NormalizedProof = {
  agentId: string; capability: string; result: string; verifier: string
  creator: Hex; owner: Hex; createdBlock: bigint; expiresAt: bigint
  freshnessState: Freshness; challengeState: ChallengeState; entityId: Hex
  taskSummary: string; verificationSummary: string; evidenceRefs: string[]
  previousProof?: Hex; transactionHash?: Hex
}

const runtimeEnv = () => (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}
export function rpcUrlFromEnv(env: Record<string, string | undefined> = runtimeEnv()): string {
  const base = env.ARKIV_RPC_URL ?? tiramisu.rpcUrls.default.http[0]
  const accessKey = env.ARKIV_API_KEY?.trim()
  return accessKey ? `${base.replace(/\/$/, "")}/${accessKey}` : base
}

export function proofQuery(capability: string | undefined, minimumExpiryBlock: bigint, result = "verified_pass") {
  const filters: Expression[] = [eq("project_id", PROJECT_ID), eq("entity_type", WORK_PROOF)]
  if (capability) filters.push(eq("capability", capability))
  if (result) filters.push(eq("result", result))
  filters.push(gte("$expiresAt", u64(minimumExpiryBlock)))
  return filters
}

function value(entity: Pick<Entity, "attributes">, name: string): unknown { return entity.attributes?.[name]?.value }

export function normalizeProofs(
  entities: readonly Entity[], challengedKeys: Set<string>, currentBlock: bigint, blockDuration: number,
  includeChallenged: boolean, transactionHashes: Record<string, Hex> = {},
): NormalizedProof[] {
  const normalized = entities.map((entity) => {
    const payload = entity.toJson() as Record<string, unknown>
    const proof: NormalizedProof = {
      agentId: String(value(entity, "agent_id")), capability: String(value(entity, "capability")),
      result: String(value(entity, "result")), verifier: String(value(entity, "verifier_type")),
      creator: entity.creator!, owner: entity.owner!, createdBlock: entity.createdAt!, expiresAt: entity.expiresAt!,
      freshnessState: classifyFreshness(entity.expiresAt!, currentBlock, blockDuration),
      challengeState: challengedKeys.has(entity.key!.toLowerCase()) ? "CHALLENGED" : "CLEAR",
      entityId: entity.key!, taskSummary: String(payload.task_summary ?? ""),
      verificationSummary: String(payload.verification_summary ?? ""),
      evidenceRefs: Array.isArray(payload.evidence_refs) ? payload.evidence_refs.map(String) : [],
      transactionHash: transactionHashes[entity.key!.toLowerCase()],
    }
    const previous = value(entity, "previous_proof")
    if (typeof previous === "string") proof.previousProof = previous as Hex
    return proof
  }).filter((proof) => includeChallenged || proof.challengeState === "CLEAR")
  const newest = new Map<string, NormalizedProof>()
  for (const proof of normalized) {
    const identity = `${proof.agentId}:${proof.capability}`
    const prior = newest.get(identity)
    if (!prior || proof.createdBlock > prior.createdBlock) newest.set(identity, proof)
  }
  return [...newest.values()].sort((a, b) => Number(b.createdBlock - a.createdBlock))
}

export async function findVerifiedAgents({ capability, minFreshnessDays = 7, result = "verified_pass", includeChallenged = false }: {
  capability?: string; minFreshnessDays?: number; result?: string; includeChallenged?: boolean
}) {
  const client = createPublicClient({ chain: tiramisu, transport: http(rpcUrlFromEnv()) })
  const timing = await client.getBlockTiming()
  const minimumExpiryBlock = timing.currentBlock + blocksForDays(minFreshnessDays, timing.blockDuration)
  const [proofPage, challengePage] = await Promise.all([
    client.select("*").where(proofQuery(capability, minimumExpiryBlock, result)).limit(200).fetch(),
    client.select({ key: true, attributes: true }).where(
      eq("project_id", PROJECT_ID), eq("entity_type", "challenge"), eq("status", "open"),
    ).limit(200).fetch(),
  ])
  const challengedKeys = new Set(challengePage.entities.map((challenge) => String(value(challenge, "target_proof")).toLowerCase()))
  return {
    proofs: normalizeProofs(proofPage.entities, challengedKeys, timing.currentBlock, timing.blockDuration, includeChallenged),
    blockNumber: proofPage.blockNumber, minimumExpiryBlock, timing,
  }
}
