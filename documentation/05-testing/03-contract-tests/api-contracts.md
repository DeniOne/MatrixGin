# MatrixGin — API Contracts

## 1. API Contract Definition

An API contract defines:
- endpoints,
- request/response shapes,
- authorization requirements,
- error semantics.

Implementation details are excluded.


## 2. Mandatory Rules

1. No breaking change without version bump.
2. No undocumented fields.
3. No implicit defaults.
4. Error responses must be deterministic.
5. Authorization rules are part of the contract.


## 3. Forbidden Practices

- Returning dynamic or context-dependent schemas
- Overloading fields with multiple meanings
- Silent behavior changes
- Frontend relying on undocumented responses


## 4. Validation Strategy

- OpenAPI specification is the source of truth
- Contract tests validate schema compliance
- Frontend relies only on contract, not implementation
