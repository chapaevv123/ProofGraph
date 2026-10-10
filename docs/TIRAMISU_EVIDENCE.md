# Tiramisu evidence

Verified live on 2026-10-10. **DATA CONTENT = SYNTHETIC. ARKIV ENTITY = REAL.**

## Public read

Command: `npm run arkiv:read-smoke`

Result: PASS. Chain ID `7738577`; RPC `https://rpc.tiramisu.db-chain.testnet.arkiv.network`; observed head `406558`; Arkiv block duration `2` seconds; active entity count `1651`. The script uses SDK 0.8.1 methods `getChainId`, `getBlockNumber`, `getBlockTiming`, and `getEntityCount`.

## First real WORK_PROOF

- Entity ID: `0x914cb2927aea776144db3b55731080b57859ee7419ead65491b6cf373bd90989`
- Transaction: `0x0ac1f1dd3e52e8664e1f03d40c7a3417924e675088d574e00f6ba03743b03e68`
- Explorer: https://tiramisu.explorer.arkiv.network/tx/0x0ac1f1dd3e52e8664e1f03d40c7a3417924e675088d574e00f6ba03743b03e68
- Chain ID: `7738577`
- Receipt status: `success`
- Creator: `0x765fb7e6a0BdDDc29f57eeCE34AEda0Fb318805d`
- Owner: `0x765fb7e6a0BdDDc29f57eeCE34AEda0Fb318805d`
- Created block: `407115`
- Expiry block: `1703115`
- Lifetime: `1296000` blocks = 30 days at the observed 2-second block duration
- Approximate creation time: `2026-10-10T20:26:22Z`
- Approximate expiry time: `2026-11-09T20:26:22Z`

Raw SDK create result:

```json
{"entityKey":"0x914cb2927aea776144db3b55731080b57859ee7419ead65491b6cf373bd90989","txHash":"0x0ac1f1dd3e52e8664e1f03d40c7a3417924e675088d574e00f6ba03743b03e68","expiresAt":"1703115"}
```

The immediate `getEntity` read returned creator/owner above, `createdAt = updatedAt = 407115`, `contentType = application/json`, all ten requested attributes plus `data_class = synthetic_demo`, and the exact requested synthetic payload. The transaction URL was separately checked and returned HTTP 200.

## Capability query

Command: `npm run arkiv:query -- python_fastapi 7`

Result: PASS at block `407212`. Arkiv applied namespace, entity type, capability, verification result, and `$expiresAt >= u64(709612)` filters. Result count was `1`; returned agent `agent_demo_fastapi_01` and entity ID `0x914cb2927aea776144db3b55731080b57859ee7419ead65491b6cf373bd90989`.

At that query block, `1295903` blocks (`2591806` seconds, about 29 days 23 hours 56 minutes) remained. State: `ACTIVE`. `EXPIRING_SOON` and `STALE` are implemented classifications but are not claimed for this entity.

## Creator readiness

Creator: `0x765fb7e6a0BdDDc29f57eeCE34AEda0Fb318805d`.

Command: `npm run arkiv:wallet-readiness`

Pre-write observed balance: `10 GLM`. Local signer configured: yes. Readiness passed without printing key material.

## Reproduction

1. `npm run arkiv:wallet-readiness`
2. `npm run arkiv:read-smoke`
3. `npm run arkiv:query -- python_fastapi 7`

The publish command is a live mutation and must not be rerun casually; the first transaction is already complete.
