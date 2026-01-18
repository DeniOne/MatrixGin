# MatrixGin — Registry Contracts

## 1. Registry Role

Registry defines:
- entities,
- attributes,
- relationships,
- allowed values.

Registry is the canonical source of domain truth.


## 2. Rules

1. Registry types are GENERATED CONTRACTS.
2. Frontend types are read-only projections.
3. No local extensions are allowed.
4. Any change goes through registry first.


## 3. Breaking Changes

The following are considered breaking:
- removing attributes,
- changing attribute meaning,
- redefining relationships.

Breaking changes require:
- versioning,
- migration,
- validation tests.


## 4. Validation

- Registry schemas must be machine-validated
- Generated types must match registry definitions
- Drift between registry and code is forbidden
