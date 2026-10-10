# Arkiv Global Tour Stop 2026 — Canonical Requirements

Verified 2026-10-10 against `Arkiv-Network/global-tour-stop-pre-devcon`.

## Window and gates

- Build: 9 October 2026 12:00 BST through 18 October 2026 23:59 BST (22:59 UTC).
- Public working Tiramisu deployment, usable without requesting access.
- Reproducible build and the exact Arkiv query behind each claim.
- Public MIT repository with setup instructions.
- Required `/arkiv/schema.md`, `/arkiv/friction.md`, creator-wallet evidence, and demo video ≤3 minutes.
- At least one Devfolio track and every required form answer.
- Original Arkiv integration and core logic built during the window. Disclose earlier work with baseline SHA.
- The deadline commit is judged; history rewrites after the deadline disqualify the entry.
- Keep deployment available through 23 October 2026.

## Tiramisu

- Chain ID: `7738577` (`0x7614d1`).
- HTTP RPC: `https://rpc.tiramisu.db-chain.testnet.arkiv.network`.
- WebSocket RPC: `wss://rpc.tiramisu.db-chain.testnet.arkiv.network`.
- Explorer: `https://tiramisu.explorer.arkiv.network`.
- SDK: official `@arkiv-network/sdk` 0.8.x.

## Data and implementation rules

- Arkiv is the primary data layer and must be meaningfully queried.
- Filterable fields are typed attributes; payloads are not queryable.
- Every entity expires. Use **Entity Expiration** and **Lifetime Extension**.
- `$creator` is immutable provenance; `$owner` is mutable control.
- Arkiv entities are publicly readable.
- Never store private keys, secrets, or real personal data, plaintext or hashed.
- Use synthetic demo content and compact public evidence metadata only.

## Rubric and form

Four criteria are worth 25 points each: Why this pillar, Why Arkiv, How Arkiv is used, and friction report. Open Source rewards a documented contract anyone can build on without permission. Security rewards displaying/filtering immutable `$creator` provenance.

Required form material includes live URL, repo, ≤3-minute demo, problem, challenges, tracks, Why Arkiv, feature usage with code links, friction/schema links, creator wallets, reproduction steps, reused-work disclosure, Arkiv surfaces, time-to-first-entity, LLM disclosure, top improvement, feedback preference, and attestations.

The Devfolio page prevails if it conflicts with the repository. Recheck both before submission.
