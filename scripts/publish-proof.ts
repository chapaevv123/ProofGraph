import { createPublicClient, createWalletClient, ExpirationTime, jsonToPayload } from "@arkiv-network/sdk"
import { tiramisu } from "@arkiv-network/sdk/chains"
import { http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { rpcUrlFromEnv } from "../src/lib/arkiv.ts"
import { demoProof, PROJECT_ID, validateWorkProofPayload, WORK_PROOF } from "../src/lib/proof.ts"

const privateKey = process.env.PRIVATE_KEY?.trim()
if (!privateKey) throw new Error("Write blocked: set PRIVATE_KEY locally; never paste or commit it.")
if (!/^(?:0x)?[0-9a-fA-F]{64}$/.test(privateKey)) throw new Error("PRIVATE_KEY has an invalid format.")
const normalizedPrivateKey = (privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`) as `0x${string}`

const account = privateKeyToAccount(normalizedPrivateKey)
const expected = "0x765fb7e6a0BdDDc29f57eeCE34AEda0Fb318805d"
if (account.address.toLowerCase() !== expected.toLowerCase()) {
  throw new Error(`Signer address does not match intended creator ${expected}.`)
}

const payload = validateWorkProofPayload(demoProof)
const client = createWalletClient({ chain: tiramisu, transport: http(rpcUrlFromEnv()), account })
const publicClient = createPublicClient({ chain: tiramisu, transport: http(rpcUrlFromEnv()) })
const result = await client.createEntity({
  contentType: "application/json",
  payload: jsonToPayload(payload),
  expires: ExpirationTime.fromDays(30),
  attributes: {
    project_id: PROJECT_ID,
    entity_type: WORK_PROOF,
    agent_id: "agent_demo_fastapi_01",
    capability: "python_fastapi",
    result: "verified_pass",
    verifier_type: "deterministic_tests",
    task_class: "api_regression",
    risk_level: "low",
    schema_version: 1,
    data_class: "synthetic_demo",
  },
})
const [receipt, entity] = await Promise.all([
  publicClient.getTransactionReceipt({ hash: result.txHash }),
  publicClient.getEntity(result.entityKey),
])
console.log(JSON.stringify({
  sdkResult: {
    entityKey: result.entityKey,
    txHash: result.txHash,
    expiresAt: result.expiresAt.toString(),
  },
  receipt: {
    status: receipt.status,
    blockNumber: receipt.blockNumber.toString(),
    transactionHash: receipt.transactionHash,
  },
  entity: {
    key: entity.key,
    creator: entity.creator,
    owner: entity.owner,
    createdAt: entity.createdAt?.toString(),
    updatedAt: entity.updatedAt?.toString(),
    expiresAt: entity.expiresAt?.toString(),
    contentType: entity.contentType,
    attributes: entity.attributes,
    payload: entity.toJson(),
  },
}, (_, value) => typeof value === "bigint" ? value.toString() : value, 2))
