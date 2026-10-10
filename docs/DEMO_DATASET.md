# Real Tiramisu demo dataset

All content is synthetic. Every identifier below is a real Arkiv Tiramisu entity or transaction receipt. Creator/owner for all records: `0x765fb7e6a0BdDDc29f57eeCE34AEda0Fb318805d`.

| Role | Agent / state | Entity | Created | Expires | Transaction |
|---|---|---|---:|---:|---|
| Canonical proof | `agent_demo_fastapi_01` / ACTIVE | `0x914cb2927aea776144db3b55731080b57859ee7419ead65491b6cf373bd90989` | 407115 | 1703115 | `0x0ac1f1dd3e52e8664e1f03d40c7a3417924e675088d574e00f6ba03743b03e68` |
| Proof | `agent_demo_onchain_01` / ACTIVE | `0x0a939f47aa18f17b75beb2e04434db310b4cb4b48ae1619cab9c1aeed2665048` | 407403 | 1703403 | `0x8a422f5edda2e072305bcc5214dd66b16bf071a35fbc2b0d1360af3cb6fb55e0` |
| Proof | `agent_demo_data_01` / EXPIRING_SOON | `0x31128db3ed73b342f23714c322d1fbfae1c72b8efa6f2339edb895ce1da13196` | 407406 | 537006 | `0x4bf6b98a8d54c177056bf82897eb686852a8314dc2791bed204e57f728f9ee37` |
| Short-lived proof | `agent_demo_automation_01` / EXPIRING_SOON → STALE | `0x542ea214cad6571cd5473c324c0bbfc64ca0ae19a7faa6081009f52e0bb943a1` | 407408 | 407708 | `0xc6bfa1dbacd1b93135aaed39bef205170052ba1fb336515cccb9330d1d6d3549` |
| Historical proof | `agent_demo_research_01` / CHALLENGED | `0xe6f4fa57e0b124fa10ee1063221f30d9111339aebea3a791031932b5b65d74ef` | 407411 | 1012211 | `0xa32c15edfdcfafcebff28ff029de25e7ccb2ecd7b2148ba5bc51de9c85279693` |
| Open challenge | `cannot_reproduce` | `0x196124121f55ef730aa34a94ee6450883a70032f5914758b45750a60fb0973cd` | 407413 | 1012213 | `0xa8711bfe466d7eab3a47986ea13bb2cb422f684271b84eb72f81db491a84ca5e` |
| Successor proof | `agent_demo_research_01` / ACTIVE | `0x3694b689eb70bc5039608199d43540ca98ee9dcb82b7837b18664ebabc9b47ea` | 407416 | 1703416 | `0x841a59f84b1b1c697d60d242560ed98d41277028681e61221098872f2ba664a9` |

The short-lived proof was created with `ExpirationTime.fromMinutes(10)`. While live, Arkiv returned it as EXPIRING_SOON. After block 407708, Arkiv no longer returns it among live entities; the UI retains the real receipt snapshot and labels it as an expired evidence fixture. This is not a frontend-invented expiry.

The open challenge points to the historical research proof through `target_proof`. The successor points to that historical proof through both `previous_proof` and `reverification_of`, and to the challenge through `resolves_challenge`. `npm run arkiv:verify-demo` reads all three entities and validates these links.
