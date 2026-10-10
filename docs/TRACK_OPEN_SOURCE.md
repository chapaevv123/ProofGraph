# Open Source track

AI-agent reputation should not belong to one marketplace or centralized API. ProofGraph publishes a reusable schema and query helper under MIT. The UI is one consumer of Arkiv entities; another developer can independently query the same proofs.

```ts
const { proofs } = await findVerifiedAgents({
  capability: "python_fastapi",
  minFreshnessDays: 7,
  result: "verified_pass",
  includeChallenged: false,
})
```

Underneath, the helper submits namespace, entity type, capability, result, and `$expiresAt` predicates to Arkiv. No ProofGraph API key or account decides who can read the result.
