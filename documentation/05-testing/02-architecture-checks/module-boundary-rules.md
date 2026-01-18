# MatrixGin — Module Boundary & Dependency Rules

This document defines mandatory architectural boundaries and dependency rules.

Any violation is considered an ARCHITECTURAL DEFECT,
even if functionality appears correct.


## 1. Architectural Layers

MatrixGin architecture is divided into the following layers:

1. Interface Layer  
   (Web UI, Telegram, External APIs)

2. Application Layer  
   (Controllers, Routes, DTOs)

3. Domain Layer  
   (Services, Business Logic)

4. Core Engines Layer  
   (AI Core, KPI, Qualification, Reward)

5. Infrastructure Layer  
   (Database, Redis, Event Store)

Each layer has strict dependency direction.


## 2. Allowed Dependency Direction

Dependencies are allowed only DOWNWARDS:

Interface → Application → Domain → Core Engines → Infrastructure

Reverse dependencies are forbidden.

Lateral dependencies between sibling modules are forbidden unless explicitly defined.


## 3. Forbidden Dependencies

The following are strictly prohibited:

- Domain importing UI or Controller logic
- Core Engines importing Application or Interface code
- Infrastructure logic leaking into Domain decisions
- AI Core calling external APIs
- UI accessing database schemas directly
- Telegram or Web bypassing Application layer


## 4. Cross-Cutting Concerns Rules

Cross-cutting concerns (logging, auth, validation) must:
- be centralized,
- be injected,
- not introduce hidden dependencies.

No module may implement its own authentication logic.


## 5. AI Core Isolation Rules

AI Core must remain isolated:

- No write access to databases
- No direct network access
- No external SDKs
- No side effects

AI Core receives only:
- aggregated data,
- snapshots,
- immutable inputs.


## 6. Integration Boundary Rules

External systems (Telegram, LLMs, APIs):
- interact only via Application Layer,
- use strict DTOs,
- never touch Domain or Infrastructure directly.

All integrations must pass through validation and sanitization.


## 7. Anti-Corruption Principles

No external model, schema, or logic may:
- leak into Domain layer,
- dictate internal data structures,
- redefine system concepts.

Adapters must translate, not propagate.


## 8. Violation Policy

1. Architectural violations block merge.
2. Violations override feature urgency.
3. Violations require redesign, not patching.
4. Repeated violations indicate governance failure.
