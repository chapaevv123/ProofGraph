# ProofGraph — submission draft

## Project name and tagline

ProofGraph — Reputation that expires when the proof gets stale.

## Description

ProofGraph is an open capability-discovery layer for AI agents. It stores verifier-backed work proofs as queryable, expiring Arkiv entities, then links challenges and re-verification successors without rewriting history.

## Problem and solution

Even a once-valid reputation becomes dangerous when old evidence remains trusted after models, tools, dependencies, and environments change. ProofGraph publishes evidence about specific work, who verified it, who created it, when it expires, and whether it was challenged or reverified. Active discovery applies the freshness floor in Arkiv.

## Why Open Source

Reputation should not belong to one marketplace. ProofGraph's MIT schema and query helper let another developer build a marketplace, router, risk engine, reputation UI, or verification service over the same public records. The UI is a consumer, not the authority.

## Why Security

The security problem is stale or unverifiable capability claims. ProofGraph narrows that risk with specific-work receipts, verifier metadata, creator provenance, protocol expiry, public challenges, and linked successor proofs. It does not claim to solve dishonest verifiers or Sybil identity.

## Why Arkiv

ProofGraph needs indexed queries, wallet provenance, entity expiration, and public reads together. Expiry is not decorative UI metadata: stale entities leave the live Arkiv result set. Postgres or an own API centralizes authority; IPFS lacks the query/lifecycle layer; a Subgraph indexes another protocol.

## How Arkiv is used

- Real work_proof and challenge entities on Tiramisu chain 7738577.
- Arkiv-side filters for project, entity type, capability, result, and expiry.
- Immutable creator and mutable owner displayed separately.
- A ten-minute proof demonstrates natural expiration.
- Typed key links connect challenge, historical proof, and successor.
- Public SDK reads require no ProofGraph account.

## What stays off Arkiv

Secrets, private work, proprietary source, personal data, confidential vulnerability detail, authentication data, large artifacts, and ranking heuristics.

## Evidence and stack

Six real work proofs, one real challenge, five capabilities, and a real successor chain. Canonical entity: 0x914cb2927aea776144db3b55731080b57859ee7419ead65491b6cf373bd90989.

TypeScript, React, Vite, Arkiv SDK 0.8.1, viem, Zod, and Vitest. Creator wallet: 0x765fb7e6a0BdDDc29f57eeCE34AEda0Fb318805d.

## Friction report

Reproduced findings cover stale repository onboarding examples, a wallet-client/read-action documentation mismatch, and display-ready expiry conversion. Each includes reproduction, workaround, impact, and suggested improvement.

## Publication fields

Public repository, live deployment, and video URL are pending owner approval. Do not replace them with fabricated links.

## Build disclosure

Fresh repository built for Arkiv Global Tour Stop 2026. Synthetic data content; real Arkiv entities. MIT licensed.
