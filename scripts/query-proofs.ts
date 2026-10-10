import { findVerifiedAgents } from "../src/lib/arkiv.ts"
import { approximateExpiryDate, classifyFreshness } from "../src/lib/freshness.ts"

const capabilityArg = process.argv[2] ?? "python_fastapi"
const capability = capabilityArg === "all" ? undefined : capabilityArg
const minFreshnessDays = Number(process.argv[3] ?? 7)

try {
  const result = await findVerifiedAgents({ capability, minFreshnessDays })
  console.log(JSON.stringify({
    capability,
    minFreshnessDays,
    minimumExpiryBlock: result.minimumExpiryBlock.toString(),
    blockNumber: result.blockNumber.toString(),
    count: result.proofs.length,
    entities: result.proofs.map((entity) => ({
      key: entity.entityId,
      agentId: entity.agentId,
      creator: entity.creator,
      owner: entity.owner,
      expiresAt: entity.expiresAt.toString(),
      expiresAtApprox: approximateExpiryDate(
        entity.expiresAt,
        result.timing.currentBlock,
        result.timing.currentBlockTime,
        result.timing.blockDuration,
      ).toISOString(),
      remainingBlocks: (entity.expiresAt - result.timing.currentBlock).toString(),
      freshness: classifyFreshness(
        entity.expiresAt,
        result.timing.currentBlock,
        result.timing.blockDuration,
      ),
      capability: entity.capability,
      challengeState: entity.challengeState,
      taskSummary: entity.taskSummary,
    })),
  }, (_, value) => typeof value === "bigint" ? value.toString() : value, 2))
} catch (cause) {
  console.error(cause instanceof Error ? cause.message : String(cause))
  process.exitCode = 1
}
