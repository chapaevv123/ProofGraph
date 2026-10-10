# Arkiv friction report

Environment: Windows; Node.js 22.23.1; npm 10.9.8; `@arkiv-network/sdk` 0.8.1; viem 2.57.4; Tiramisu 7738577. Only reproduced Arkiv-related findings belong here.

## Official repository README search result shows pre-Tiramisu examples

- Exact check: compare the official `Arkiv-Network/arkiv-sdk-js` README query example with SDK 0.8.1 exports and current official network docs.
- Expected: package landing documentation uses the current `tiramisu` export and API.
- Actual: the indexed README example uses `braga` and 0.6.x-era dependency text; SDK 0.8.1 and current docs use Tiramisu.
- Reproduction: inspect the repository README, then installed `src/chains/index.ts` and `src/chains/tiramisu.ts`.
- Workaround: use current docs and installed source/type declarations; import `tiramisu` from `@arkiv-network/sdk/chains`.
- Impact: copy/paste onboarding can select a retired network or stale surface.
- Suggested improvement: update README per release and compile its examples in CI against current exports.

## Wallet client description conflicts with its actual Arkiv read surface

- Environment: Node.js 22.23.1, SDK 0.8.1, viem 2.57.4.
- Exact code: create a wallet with `createWalletClient(...)`, then attempt `wallet.getEntity(entityKey)` or `wallet.select("*")`.
- Expected: `src/clients/createWalletClient.ts` says the wallet exposes mutations “on top of the read actions a Public Client has.”
- Actual: it extends viem public/wallet actions plus `walletArkivActions`, but not `publicArkivActions`. Arkiv `getEntity`, `select`, `query`, and `getBlockTiming` are absent from its type and runtime surface.
- Reproduction: inspect `createWalletClient.ts` and `decorators/arkivWallet.ts`, or type-check either call.
- Workaround: construct a separate `createPublicClient` beside the wallet. ProofGraph does this for write-then-read evidence.
- Impact: the documented mental model causes a compile failure in a common write-then-read flow.
- Suggested improvement: extend wallet clients with `publicArkivActions`, or document the paired-client requirement.

## Expiry is query-ready but not display-ready

- Environment: Node.js 22.23.1, SDK 0.8.1, Tiramisu with an observed two-second block duration.
- Exact code: read `entity.expiresAt` and call `getBlockTiming()`.
- Expected: a lifecycle helper could expose remaining lifetime or an estimated wall-clock expiry using current network timing.
- Actual: expiry is correctly a block height, while current block/time/duration are separate. Applications must implement and test the conversion.
- Reproduction: run `npm run arkiv:query -- all 0`; ProofGraph calculates `expiresAtApprox` and remaining blocks itself.
- Workaround: `currentBlockTime + (expiresAt - currentBlock) * blockDuration`, explicitly treating the result as approximate.
- Impact: every human-facing application reimplements lifecycle presentation and must avoid implying an exact date.
- Suggested improvement: provide a documented utility returning remaining blocks, estimated seconds, and estimated date with approximation semantics.

The local `tsx` `uv_os_get_passwd` failure is environment/tooling-specific and is not attributed to Arkiv.
