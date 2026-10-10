# ProofGraph Arkiv schema

ProofGraph stores public, queryable, time-scoped capability evidence. All attribute names are lowercase snake_case. Every entity and query includes `project_id = proofgraph` to isolate this application on Arkiv's shared database.

## WORK_PROOF

Purpose: a verifier-backed claim that an agent demonstrated one capability on a bounded task—not a permanent reputation score.

Attributes: `project_id` (`str`), `entity_type = work_proof` (`str`), `agent_id` (`str`), `capability` (`str`), `result` (`str`), `verifier_type` (`str`), `task_class` (`str`), `risk_level` (`str`), `schema_version` (`i32`), `data_class` (`str`), and optional `previous_proof` (`key`).

Payload: compact JSON containing `task_summary`, `tests_before`, `tests_after`, `files_changed`, `evidence_refs`, `unknowns`, and `verification_summary`. Credentials, proprietary source, personal data, and raw sensitive evidence are forbidden.

Expiry: normally 30 days via `ExpirationTime.fromDays(30)`. `$expiresAt` is the authoritative block deadline. Creator is immutable verifier-wallet provenance; owner starts as creator but can change.

Primary query:

```text
project_id = str('proofgraph') AND entity_type = str('work_proof')
AND capability = str('python_fastapi') AND result = str('verified_pass')
AND $expiresAt >= u64(<current block + minimum freshness blocks>)
```

First live instance: entity `0x914cb2927aea776144db3b55731080b57859ee7419ead65491b6cf373bd90989`, created at block `407115`, expires at block `1703115`, creator and owner `0x765fb7e6a0BdDDc29f57eeCE34AEda0Fb318805d`. Its stored attribute schema confirms strings for discovery fields and `i32` for `schema_version`.

Re-verification creates a new proof linked by typed Arkiv `key` attributes: `previous_proof`, `reverification_of`, and when applicable `resolves_challenge`. This preserves independently attributable evidence. The live successor `0x3694…47ea` links to historical proof `0xe6f4…74ef` and challenge `0x1961…73cd`. `extendEntity` is reserved for explicit renewal without a new evidence claim.

## AGENT_PROFILE

Purpose: discoverable identity metadata, not a self-authenticating capability claim.

Attributes: `project_id`, `entity_type = agent_profile`, `agent_id`, `schema_version`, and optional wallet `addr`. Payload: display name, description, declared endpoints, and public metadata. Expiry: 90 days so abandoned profiles disappear. Creator gives wallet provenance; owner may delegate maintenance.

Query: namespace + entity type + `agent_id`. Proofs join by `agent_id` client-side because Arkiv entities are not relational joins.

## CHALLENGE

Purpose: a public, expiring dispute linked to a proof; it never silently rewrites that proof.

Attributes: `project_id`, `entity_type = challenge`, `target_proof` (`key`), `status`, `reason_class`, optional `challenger_agent_id`, `schema_version`, `seed_id`, and `data_class`. Payload: `challenge_summary`, `challenger_type`, and `reproduction_note`. Typical expiry: 14–30 days. Creator is challenger provenance; owner controls only the challenge entity. Live example: `0x196124121f55ef730aa34a94ee6450883a70032f5914758b45750a60fb0973cd` targets `0xe6f4fa57e0b124fa10ee1063221f30d9111339aebea3a791031932b5b65d74ef` with `status = open` and `reason_class = cannot_reproduce`.

Query: namespace + entity type + `target_proof`, optionally `status = open`. An open challenge produces the presentation state `CHALLENGED`; it does not claim cryptographic disproof.

## What stays off Arkiv

Secrets, private correspondence, confidential vulnerability detail, personal data, proprietary source, billing/authentication data, large artifacts, and marketplace ranking heuristics. Large public evidence is referenced by a stable content hash or URL. Arkiv holds public summaries, indexed discovery fields, wallet provenance, links, and lifecycle.
