# MATRIXGIN — FOUNDATION ENTITIES

Status: CANONICAL  
Version: 1.1  
Scope: System-wide  
Applies to: ALL modules without exception

Depends on:
- SYSTEM-REGISTRY-UI-SPEC.md
- REGISTRY-API-CONTRACT.md

---

## 0. PURPOSE

This document defines the **canonical list of foundation entities** in MatrixGin.

Foundation entities are:
- Created **once**
- Exist **system-wide**
- Shared by **all modules**
- Introduced **only via System Registry**
- NOT owned by business modules

Any module that creates its own version of a foundation entity
is considered **architecturally invalid**.

MatrixGin is a **read-heavy system**.
Write-points are strictly limited.

---

## 1. CLASSIFICATION LEGEND

- 📝 **Manual (Registry)** — created only via System Registry
- ⚙️ **Derived** — calculated by system logic
- 🔁 **Event-based** — created from events (append-only)
- ❌ **Abstract** — logical / base entity, no table
- **UI** — visibility & manageability via System Registry UI

---

## 2. SYSTEM / META LAYER

| Entity | Type | UI |
|------|-----|----|
| PolicyRule | 📝 | YES |
| RetentionPolicy | 📝 | YES |
| AuditEvent | 🔁 | NO |
| EntityLifecycle | ⚙️ | NO |
| RegistrySource | ⚙️ | NO |
| SystemEntity | ❌ | NO |

---

## 3. IDENTITY & ACCESS (RBAC)

| Entity | Type | UI |
|------|-----|----|
| Role | 📝 | YES |
| Permission | 📝 | YES |
| RolePermission | 📝 | YES |
| AccessScope | 📝 | YES |
| UserAccount | 📝 | NO |
| Session | 🔁 | NO |

Notes:
- Role defines access only
- Role ≠ Position ≠ Status

---

## 4. HUMAN / ACTORS

| Entity | Type | UI |
|------|-----|----|
| Person | 📝 | YES |
| Employee | 📝 | NO |
| ExternalActor | 📝 | YES |
| AI-Agent | 📝 | NO |
| ActorIdentity | ⚙️ | NO |

---

## 5. ORGANIZATIONAL STRUCTURE (OFS)

| Entity | Type | UI |
|------|-----|----|
| Organization | 📝 | YES |
| OrgUnit | 📝 | YES |
| OrgUnitType | 📝 | YES |
| OrgRelation | 📝 | YES |
| StructuralRole | 📝 | YES |

---

## 6. FUNCTIONAL LAYER

| Entity | Type | UI |
|------|-----|----|
| Function | 📝 | YES |
| FunctionGroup | 📝 | YES |
| FunctionAssignment | ⚙️ | NO |
| FunctionCoverage | ⚙️ | NO |

---

## 7. POSITION / WORK MODEL

| Entity | Type | UI |
|------|-----|----|
| Position | 📝 | YES |
| Appointment | 📝 | NO |
| PositionFunction | ⚙️ | NO |
| Workload | ⚙️ | NO |

---

## 8. STATUS & QUALIFICATION

| Entity | Type | UI |
|------|-----|----|
| Status | 📝 | YES |
| StatusRule | 📝 | YES |
| Qualification | 📝 | YES |
| QualificationLevel | 📝 | YES |
| QualificationEvidence | 🔁 | NO |

---

## 9. VALUE / CPK

| Entity | Type | UI |
|------|-----|----|
| CPK | 📝 | YES |
| CPKHierarchy | 📝 | YES |
| CPKOwner | 📝 | YES |
| CPKConflict | ⚙️ | NO |
| CPKSignal | 🔁 | NO |

---

## 10. TASK & OPERATIONS

| Entity | Type | UI |
|------|-----|----|
| TaskType | 📝 | YES |
| TaskState | 📝 | YES |
| Workflow | 📝 | YES |
| Task | 🔁 | NO |
| Operation | 🔁 | NO |

---

## 11. EVENTS & MEANING

| Entity | Type | UI |
|------|-----|----|
| SystemEvent | 🔁 | NO |
| MeaningfulEvent | 🔁 | NO |
| EventImpact | ⚙️ | NO |
| EventSource | ⚙️ | NO |

---

## 12. ECONOMY

| Entity | Type | UI |
|------|-----|----|
| ValueToken | 📝 | YES |
| RewardRule | 📝 | YES |
| PenaltyRule | 📝 | YES |
| Wallet | 🔁 | NO |
| Transaction | 🔁 | NO |

---

## 13. KNOWLEDGE & UNIVERSITY

| Entity | Type | UI |
|------|-----|----|
| Faculty | 📝 | YES |
| Methodology | 📝 | YES |
| KnowledgeUnit | 📝 | YES |
| Course | 📝 | NO |
| Program | 📝 | NO |
| Expert | 📝 | NO |
| ResearchArtifact | 📝 | NO |

---

## 14. EMOTIONAL / SUPPORT

| Entity | Type | UI |
|------|-----|----|
| EmotionalState | 🔁 | NO |
| EmotionalSignal | 🔁 | NO |
| BurnoutRisk | ⚙️ | NO |
| SupportAction | 🔁 | NO |

---

## 15. LEGAL & COMPLIANCE

| Entity | Type | UI |
|------|-----|----|
| LegalEntity | 📝 | YES |
| Document | 📝 | NO |
| ConsentRecord | 🔁 | NO |
| ComplianceIncident | 🔁 | NO |

---

## 16.
