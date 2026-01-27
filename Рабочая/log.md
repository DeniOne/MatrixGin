
> matrix_gin@1.0.0 dev
> nodemon src/index.ts

[nodemon] 3.1.11
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node src/index.ts`
[dotenv@17.2.3] injecting env (12) from .env -- tip: ⚙️  override existing env vars with { override: true }
[dotenv@17.2.3] injecting env (0) from .env -- tip: ✅ audit secrets and track compliance: https://dotenvx.com/ops
Registry Visibility Rules validated (4 rules).
[REGISTRY ROUTES] loaded at 2026-01-27T18:51:51.071Z
2026-01-27 21:51:55 [info]: === STARTING MATRIXGIN SERVER === {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:55 [info]: [RegistryBootstrap] === STARTING REGISTRY BOOTSTRAP === {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:55 [info]: [RegistryLoader] Starting load from: F:\Matrix_Gin\backend\src\registry\bootstrap {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:55 [info]: [RegistryLoader] Found 51 JSON files {"service":"matrixgin-api","environment":"development"}2026-01-27 21:51:55 [debug]: [RegistryLoader] Loaded: urn:mg:entity-type:entity_type:v1 {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:55 [debug]: [RegistryLoader] Loaded: urn:mg:entity-type:attribute_definition:v1 {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:55 [debug]: [RegistryLoader] Loaded: urn:mg:entity-type:relationship_definition:v1 {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:55 [debug]: [RegistryLoader] Loaded: urn:mg:entity-type:fsm_definition:v1 {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:55 [debug]: [RegistryLoader] Loaded: urn:mg:type:user_account {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:55 [debug]: [RegistryLoader] Loaded: urn:mg:type:role {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:55 [debug]: [RegistryLoader] Loaded: urn:mg:type:permission {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:55 [debug]: [RegistryLoader] Loaded: urn:mg:type:role_permission {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:access_scope {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:policy_rule {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:retention_policy {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:person {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:employee {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:external_actor {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:ai_agent {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:expert {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:organization {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:org_unit_type {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:org_unit {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:org_relation {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:structural_role {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:position {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:function_group {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:function {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:status {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:status_rule {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:qualification {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:qualification_level {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:appointment {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:cpk {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:cpk_hierarchy {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:cpk_owner {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:task_type {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:task_state {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:workflow {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:value_token {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:reward_rule {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:penalty_rule {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:faculty {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:program {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:course {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:knowledge_unit {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:methodology {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:research_artifact {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:content_item {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:tag {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:legal_entity {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:document {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:integration {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:webhook {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [RegistryLoader] Loaded: urn:mg:type:data_import {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [info]: [RegistryLoader] Loaded 51 entities, checksum: 308dc77c164bfdc8 {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [info]: [RegistryBootstrap] Loaded 51 entities {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [info]: [RegistryValidator] Validating 51 entities {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [info]: [RegistryValidator] Validation PASSED (0 warning(s)) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [info]: [RegistryGraph] Building graph with 51 entities {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [info]: [RegistryGraph] Graph built: 51 nodes, 26 edges {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [info]: ============================================================ {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [info]: [REGISTRY] Bootstrap summary {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [info]: [REGISTRY]   entities=51 {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [info]: [REGISTRY]   relations=26 {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [info]: [REGISTRY]   enums=13 {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [info]: [REGISTRY]   checksum=308dc77c164bfdc8 {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [info]: [REGISTRY]   domains=meta, security, human, structure, functional, hierarchy, value, process, economy, knowledge, legal, integration {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [info]: [REGISTRY]   byClass={"meta":4,"core":11,"reference":31,"relation":5} {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [info]: ============================================================ {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [info]: [EntityCardService] Initializing... {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [info]: [EntityCardCache] Initializing cache... {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:entity-type:entity_type:v1 {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:entity-type:entity_type:v1 (7 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:entity-type:attribute_definition:v1 {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:entity-type:attribute_definition:v1 (5 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:entity-type:relationship_definition:v1 {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:entity-type:relationship_definition:v1 (5 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:entity-type:fsm_definition:v1 {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:entity-type:fsm_definition:v1 (3 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:user_account {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:user_account (3 attrs, 1 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:role {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:role (0 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:permission {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:permission (3 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:role_permission {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:role_permission (0 attrs, 2 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:access_scope {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:access_scope (1 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:policy_rule {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:policy_rule (2 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:retention_policy {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:retention_policy (2 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:person {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:person (4 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:employee {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:employee (2 attrs, 1 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:external_actor {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:external_actor (3 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:ai_agent {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:ai_agent (3 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:expert {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:expert (0 attrs, 1 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:organization {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:organization (1 attrs, 1 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:org_unit_type {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:org_unit_type (1 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:org_unit {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:org_unit (0 attrs, 3 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:org_relation {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:org_relation (1 attrs, 2 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:structural_role {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:structural_role (2 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:position {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:position (1 attrs, 2 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:function_group {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:function_group (0 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:function {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:function (0 attrs, 1 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:status {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:status (2 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:status_rule {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:status_rule (0 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:qualification {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:qualification (1 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:qualification_level {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:qualification_level (1 attrs, 1 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:appointment {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:appointment (2 attrs, 2 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:cpk {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:cpk (1 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:cpk_hierarchy {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:cpk_hierarchy (0 attrs, 2 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:cpk_owner {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:cpk_owner (0 attrs, 2 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:task_type {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:task_type (1 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:task_state {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:task_state (2 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:workflow {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:workflow (1 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:value_token {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:value_token (2 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:reward_rule {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:reward_rule (2 attrs, 1 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:penalty_rule {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:penalty_rule (2 attrs, 1 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:faculty {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:faculty (0 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:program {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:program (1 attrs, 1 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:course {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:course (1 attrs, 1 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:knowledge_unit {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:knowledge_unit (1 attrs, 1 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:methodology {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:methodology (0 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:research_artifact {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:56 [debug]: [EntityCardBuilder] Card built: urn:mg:type:research_artifact (0 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:57 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:content_item {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:57 [debug]: [EntityCardBuilder] Card built: urn:mg:type:content_item (0 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:57 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:tag {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:57 [debug]: [EntityCardBuilder] Card built: urn:mg:type:tag (0 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:57 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:legal_entity {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:57 [debug]: [EntityCardBuilder] Card built: urn:mg:type:legal_entity (4 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:57 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:document {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:57 [debug]: [EntityCardBuilder] Card built: urn:mg:type:document (2 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:57 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:integration {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:57 [debug]: [EntityCardBuilder] Card built: urn:mg:type:integration (3 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:57 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:webhook {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:57 [debug]: [EntityCardBuilder] Card built: urn:mg:type:webhook (3 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:57 [debug]: [EntityCardBuilder] Building card for: urn:mg:type:data_import {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:57 [debug]: [EntityCardBuilder] Card built: urn:mg:type:data_import (2 attrs, 0 rels) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:57 [info]: [EntityCardCache] Initialized: 51 cards in 474ms {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:57 [info]: [EntityCardService] Initialized with 48 cards {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:57 [warn]: Redis disabled via REDIS_ENABLED=false {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:57 [info]: [EventFlow] Starting University Event Worker (interval: 10000ms) {"service":"matrixgin-api","environment":"development"}
2026-01-27 21:51:57 [info]: Server is running at http://localhost:3000 {"service":"matrixgin-api","environment":"development"}
prisma:error
Invalid `prisma.$queryRaw()` invocation:


Raw query failed. Code: `42P01`. Message: `relation "employee_registration_requests" does not exist`
Unhandled error while processing {
  update_id: 549159533,
  message: {
    message_id: 144,
    from: {
      id: 441610858,
      is_bot: false,
      first_name: 'DeniOne',
      username: 'denisgovako',
      language_code: 'ru',
      is_premium: true
    },
    chat: {
      id: 441610858,
      first_name: 'DeniOne',
      username: 'denisgovako',
      type: 'private'
    },
    date: 1769539018,
    text: '/start',
    entities: [ [Object] ]
  }
}
prisma:error
Invalid `prisma.$queryRaw()` invocation:


Raw query failed. Code: `42P01`. Message: `relation "employee_registration_requests" does not exist`
Unhandled error while processing {
  update_id: 549159535,
  message: {
    message_id: 146,
    from: {
      id: 8146375085,
      is_bot: false,
      first_name: 'Денис',
      username: 'Photomatrix_Den',
      language_code: 'ru'
    },
    chat: {
      id: 8146375085,
      first_name: 'Денис',
      username: 'Photomatrix_Den',
      type: 'private'
    },
    date: 1769539353,
    text: '/start',
    entities: [ [Object] ]
  }
}
prisma:error
Invalid `prisma.$queryRaw()` invocation:


Raw query failed. Code: `42P01`. Message: `relation "employee_registration_requests" does not exist`
Unhandled error while processing {
  update_id: 549159534,
  message: {
    message_id: 145,
    from: {
      id: 441610858,
      is_bot: false,
      first_name: 'DeniOne',
      username: 'denisgovako',
      language_code: 'ru',
      is_premium: true
    },
    chat: {
      id: 441610858,
      first_name: 'DeniOne',
      username: 'denisgovako',
      type: 'private'
    },
    date: 1769539093,
    text: '/start',
    entities: [ [Object] ]
  }
}
2026-01-27 21:51:58 [error]: Failed to initialize Telegram bot {"service":"matrixgin-api","environment":"development","error":"\nInvalid `prisma.$queryRaw()` invocation:\n\n\nRaw query failed. Code: `42P01`. Message: `relation \"employee_registration_requests\" does not exist`"}