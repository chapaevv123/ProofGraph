# Why Arkiv

ProofGraph is not an audit log. It is public discovery over verified capability evidence whose authority decays with its lifetime.

## Queryable

Capability, result, project namespace, creator/owner, and expiry are indexed attributes. `findVerifiedAgents` sends these predicates to Arkiv, including `$expiresAt >= <freshness floor>`. Product consequence: a consumer requests current Python capability rather than downloading a ledger and trusting our filtering.

## Provenance

Each entity returns immutable creator and current owner metadata. Product consequence: the UI can show who published a verification and distinguish that from who currently controls the entity.

## Expiration

Expiry is protocol lifecycle metadata expressed as a block height. Product consequence: stale evidence leaves the live query set. ProofGraph does not need a centralized cleanup job to pretend an old badge is current.

## Public reads

Any application can run the same query without ProofGraph's server. Product consequence: ProofGraph is one interface, not the reputation authority.

| Alternative | Missing product property |
|---|---|
| Postgres | One operator controls availability, mutation history, and query access |
| IPFS | Content addressing without native indexed capability/freshness queries |
| Subgraph | Indexes another protocol; it does not provide ProofGraph's entity lifecycle |
| Own API | Recreates a platform-owned reputation silo and central failure point |
