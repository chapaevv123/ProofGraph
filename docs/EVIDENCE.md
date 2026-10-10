# Build evidence

- Installed SDK: `@arkiv-network/sdk` 0.8.1.
- Runtime: Node.js 22.23.1.
- Unit tests: 3 files, 7 tests passed on 2026-10-10.
- Live read: passed; see `TIRAMISU_EVIDENCE.md`.
- First live entity: `0x914cb2927aea776144db3b55731080b57859ee7419ead65491b6cf373bd90989`.
- Live transaction: `0x0ac1f1dd3e52e8664e1f03d40c7a3417924e675088d574e00f6ba03743b03e68`, receipt success at block `407115`.
- Live ProofGraph query: passed and returned `agent_demo_fastapi_01` with Arkiv-side freshness filtering.
- Write guard verifies signer format and derives the intended creator address before mutation.
- Screenshots: not captured yet.
- Explorer URL verified with HTTP 200; full receipt and query details are in `TIRAMISU_EVIDENCE.md`.
