export type Freshness = "ACTIVE" | "EXPIRING_SOON" | "STALE"

export function blocksForDays(days: number, blockDurationSeconds: number): bigint {
  if (!Number.isFinite(days) || days < 0) throw new Error("days must be a non-negative number")
  if (!Number.isFinite(blockDurationSeconds) || blockDurationSeconds <= 0) {
    throw new Error("block duration must be positive")
  }
  return BigInt(Math.ceil((days * 86_400) / blockDurationSeconds))
}

export function classifyFreshness(
  expiresAt: bigint,
  currentBlock: bigint,
  blockDurationSeconds: number,
  expiringSoonDays = 7,
): Freshness {
  if (expiresAt <= currentBlock) return "STALE"
  const threshold = currentBlock + blocksForDays(expiringSoonDays, blockDurationSeconds)
  return expiresAt <= threshold ? "EXPIRING_SOON" : "ACTIVE"
}

export function approximateExpiryDate(
  expiresAt: bigint,
  currentBlock: bigint,
  currentBlockTime: number,
  blockDurationSeconds: number,
): Date {
  const seconds = Number(expiresAt - currentBlock) * blockDurationSeconds
  return new Date((currentBlockTime + seconds) * 1000)
}
