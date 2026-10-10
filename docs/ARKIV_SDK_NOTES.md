# Arkiv SDK notes

Verified on 2026-10-10 against the locally installed `@arkiv-network/sdk` 0.8.1 package source and type declarations, with Node.js 22.23.1 and viem installed as a peer dependency.

## Tiramisu

- Import `tiramisu` from `@arkiv-network/sdk/chains`.
- Chain ID: `7738577` (`0x7614d1`).
- Default HTTP RPC: `https://rpc.tiramisu.db-chain.testnet.arkiv.network`.
- Default WebSocket RPC: `wss://rpc.tiramisu.db-chain.testnet.arkiv.network`.
- Native test gas token: GLM.
- Explorer: `https://tiramisu.explorer.arkiv.network`.
- The official network page and the chain object shipped by SDK 0.8.1 agree on these values.
- Anonymous reads are supported but heavily rate limited. An access key can be appended to the RPC URL and should remain server-side in production.

## Clients

```ts
import { createPublicClient, createWalletClient } from "@arkiv-network/sdk"
import { tiramisu } from "@arkiv-network/sdk/chains"
import { http } from "viem"
import { privateKeyToAccount } from "viem/accounts"

const publicClient = createPublicClient({ chain: tiramisu, transport: http() })
const walletClient = createWalletClient({
  chain: tiramisu,
  transport: http(),
  account: privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`),
})
```

The public client includes Arkiv reads plus selected viem public actions. The wallet client includes reads, viem wallet actions, and Arkiv mutations. The SDK no longer re-exports `http` or account helpers; import those from `viem`.

## Read/query API

- Harmless connectivity methods: `getChainId()`, `getBlockNumber()`, `getBlockTiming()`, and `getEntityCount()`.
- `getEntity(key)` returns all fields for one live entity. Missing, deleted, and expired entities are not returned as live entities.
- Preferred query API: `client.select(selection).where(expressions).fetch()`.
- Direct escape hatch: `client.query(expressionOrRawString, options)`.
- A query builder requires at least one predicate; there is no builder spelling for “all entities.”
- Page size is capped by the node at 200. `QueryResult.next()` and async iteration handle cursors.
- Queryable system attributes are `$key`, `$owner`, `$creator`, and `$expiresAt`.
- `$createdAt`, `$updatedAt`, `$creationFlags`, `$contentType`, and `$payload` can be selected but not filtered because they are not indexed.
- Attribute filters support equality, numeric ranges, prefix matching, existence/type tests, boolean composition, owner, and creator constraints.
- Attribute names must be lowercase on Tiramisu. ProofGraph uses snake_case.

## Attributes and entity creation

`createEntity` accepts payload bytes, content type, typed attributes, an expiry, and optional salt/flags. Use `jsonToPayload` for JSON and typed attribute helpers from `@arkiv-network/sdk/attr` where needed. Bare strings, booleans, numbers, and bigints map to SDK defaults; explicit types make query intent clearer.

```ts
const receipt = await walletClient.createEntity({
  payload: jsonToPayload(payload),
  contentType: "application/json",
  attributes: {
    project_id: "proofgraph",
    entity_type: "work_proof",
    capability: "python_fastapi",
  },
  expires: ExpirationTime.fromDays(30),
})
// receipt: { entityKey, txHash, expiresAt }
```

Every ProofGraph query must include `project_id = "proofgraph"` because Arkiv is a shared database.

## Expiry and lifecycle

- `expiresAt` is an Arkiv block number, not a Unix timestamp.
- `ExpirationTime.fromDays(30)` is resolved using live block timing at mutation time.
- `ExpirationTime.atBlock(...)` supports an explicit deadline.
- `extendEntity({ entityKey, expires })` exists. It sets a later expiry and rejects a non-extension.
- Patch, delete, ownership transfer, batch execution, and event watching are also supported.
- Creator is immutable; owner can change via `changeOwnership`.
- ProofGraph will classify freshness from live block timing plus `expiresAt`, and will use an Arkiv `$expiresAt` range predicate where possible.

## ProofGraph semantic decision

Extending an entity is technically supported. For auditable re-verification, ProofGraph should normally create a new `work_proof` linked to the prior entity rather than extending old evidence: a new verification event is new evidence. Lifetime extension is appropriate only when the evidence itself remains valid and the verifier explicitly renews it. The UI and docs must distinguish these cases.

## Sources checked

- Installed SDK 0.8.1 source under `node_modules/@arkiv-network/sdk/src`.
- Official Tiramisu network page: https://docs.arkiv.network/networks/tiramisu/
- Official TypeScript querying guide: https://docs.arkiv.network/typescript-sdk/querying-data/
- Official access-key guide: https://docs.arkiv.network/start-here/access-keys/
