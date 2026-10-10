# Threat model

ProofGraph proves that a wallet created public evidence metadata, what verification result it asserted, whether the entity is still live/fresh, and which challenge/successor entities link to it.

It does not prove verifier honesty, real-world identity, absence of Sybil wallets, permanent availability of referenced off-chain artifacts, or that a creator wallet was uncompromised.

Key risks and controls:

- Malicious verifier: expose creator/verifier identity and challenge linkage; reputation consumers choose trust policy.
- Stale evidence: short protocol lifetime plus Arkiv-side expiry queries remove it from active discovery.
- Wallet compromise: creator provenance remains factual but cannot prove authorization intent; consumers can challenge and publish successors, not rewrite history.
- Sybil identities: ProofGraph makes no uniqueness claim. Multiple wallets are not automatically independent evidence.
- Evidence availability: compact summaries remain on Arkiv; external artifacts need durable content-addressed storage and availability monitoring.
- Sensitive data: validation rejects common secret fields and key-like values before publishing; synthetic demo content only.
- Challenge abuse: a challenge is an attributable claim, not automatic guilt. The UI shows linkage and resolution without staking, slashing, or voting theater.
