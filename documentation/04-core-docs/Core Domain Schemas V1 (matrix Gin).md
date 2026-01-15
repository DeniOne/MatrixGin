# Core Domain Schemas v1 (MatrixGin)

**Статус:** Stable v1
**Назначение:** Строгие границы домена для ERP Core.

---

## 1. User

* id
* role_id
* qualification_level_id
* status_id
* active

## 2. Role

* id
* name
* description

## 3. RoleContract

* role_id
* mission
* value_product
* responsibility_zones[]
* kpi_definitions[]
* permissions[]
* growth_paths[]

## 4. FlowNode

* role_id
* input_rate
* processing_time
* capacity
* output_quality

## 5. DependencyGraph

* nodes: FlowNode[]
* edges: (from_role_id, to_role_id)

## 6. Event

* id
* type
* source
* subject_id
* payload
* timestamp

## 7. KPI (Sensor)

* id
* name
* formula
* source_events[]

## 8. TacticalHypothesis

* id
* goal
* duration
* kpi_changes
* expected_impacts
* status

## 9. ImpactAnalysisResult

* hypothesis_id
* risks[]
* bottlenecks[]
* recommendations[]

## 10. RewardRule

* trigger
* condition
* reward

---

## Канон

* KPI вычисляются из Events + HypothesisContext.
* Reward — следствие, не причина.
* Schemas не содержат UI-логики.
