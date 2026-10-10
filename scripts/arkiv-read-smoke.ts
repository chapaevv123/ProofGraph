import { createPublicClient } from "@arkiv-network/sdk"
import { tiramisu } from "@arkiv-network/sdk/chains"
import { http } from "viem"

const expectedChainId = 7_738_577
const baseRpcUrl = process.env.ARKIV_RPC_URL ?? tiramisu.rpcUrls.default.http[0]
const apiKey = process.env.ARKIV_API_KEY?.trim()
const rpcUrl = apiKey ? `${baseRpcUrl.replace(/\/$/, "")}/${apiKey}` : baseRpcUrl

const client = createPublicClient({
  chain: tiramisu,
  transport: http(rpcUrl, { timeout: 15_000 }),
})

try {
  const [chainId, blockNumber, timing, entityCount] = await Promise.all([
    client.getChainId(),
    client.getBlockNumber(),
    client.getBlockTiming(),
    client.getEntityCount(),
  ])

  if (chainId !== expectedChainId) {
    throw new Error(`Wrong chain: expected ${expectedChainId}, received ${chainId}`)
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        network: tiramisu.name,
        chainId,
        rpc: baseRpcUrl,
        authenticated: Boolean(apiKey),
        blockNumber: blockNumber.toString(),
        blockTiming: {
          currentBlock: timing.currentBlock.toString(),
          currentBlockTime: timing.currentBlockTime,
          blockDurationSeconds: timing.blockDuration,
        },
        activeEntityCount: entityCount,
      },
      null,
      2,
    ),
  )
} catch (cause) {
  const message = cause instanceof Error ? cause.message : String(cause)
  console.error(
    JSON.stringify(
      {
        ok: false,
        network: tiramisu.name,
        expectedChainId,
        rpc: baseRpcUrl,
        authenticated: Boolean(apiKey),
        error: message,
        hint: apiKey
          ? "Verify the RPC URL, access key, and network availability."
          : "Anonymous Tiramisu access may be rate limited; set ARKIV_API_KEY if required.",
      },
      null,
      2,
    ),
  )
  process.exitCode = 1
}
