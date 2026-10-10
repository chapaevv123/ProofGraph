import { createPublicClient } from "@arkiv-network/sdk"
import { tiramisu } from "@arkiv-network/sdk/chains"
import { formatEther, getAddress, http } from "viem"

const creator = getAddress("0x765fb7e6a0BdDDc29f57eeCE34AEda0Fb318805d")
const baseRpcUrl = process.env.ARKIV_RPC_URL ?? tiramisu.rpcUrls.default.http[0]
const apiKey = process.env.ARKIV_API_KEY?.trim()
const rpcUrl = apiKey ? `${baseRpcUrl.replace(/\/$/, "")}/${apiKey}` : baseRpcUrl
const client = createPublicClient({ chain: tiramisu, transport: http(rpcUrl) })

try {
  const balance = await client.getBalance({ address: creator })
  console.log(JSON.stringify({
    creator,
    chainId: tiramisu.id,
    balanceWei: balance.toString(),
    balanceGlm: formatEther(balance),
    funded: balance > 0n,
    signerConfigured: Boolean(process.env.PRIVATE_KEY?.trim()),
    writeReady: balance > 0n && Boolean(process.env.PRIVATE_KEY?.trim()),
  }, null, 2))
} catch (cause) {
  console.error(JSON.stringify({
    creator,
    ok: false,
    error: cause instanceof Error ? cause.message : String(cause),
  }, null, 2))
  process.exitCode = 1
}
