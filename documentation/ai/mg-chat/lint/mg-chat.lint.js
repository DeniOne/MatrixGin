/**
 * MG Chat Contract Linter
 * 
 * Validates MG Chat JSON contracts against:
 * - JSON Schema compliance
 * - Cross-reference integrity (intent ↔ action ↔ component)
 * - Telegram UX limits
 * - Architectural constraints (no auto-mutations)
 * 
 * Usage: node mg-chat.lint.js
 */

import Ajv from "ajv";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_PATH = join(__dirname, "..");

// ─────────────────────────────────────────────────────────────
// Load files
// ─────────────────────────────────────────────────────────────

function loadJson(relativePath) {
    const fullPath = join(BASE_PATH, relativePath);
    try {
        return JSON.parse(readFileSync(fullPath, "utf-8"));
    } catch (err) {
        console.error(`❌ Failed to load ${relativePath}: ${err.message}`);
        process.exit(1);
    }
}

const intentMap = loadJson("mg_intent_map.json");
const uxMap = loadJson("mg_ux_components_map.json");
const errorMap = loadJson("error_ux_map.json");

const intentSchema = loadJson("schemas/intent.schema.json");
const uxSchema = loadJson("schemas/ux_components.schema.json");
const errorSchema = loadJson("schemas/error_ux.schema.json");

// ─────────────────────────────────────────────────────────────
// Schema validation
// ─────────────────────────────────────────────────────────────

const ajv = new Ajv({ allErrors: true, strict: false });

function validateSchema(schema, data, name) {
    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!valid) {
        console.error(`\n❌ Schema validation failed for ${name}:`);
        validate.errors.forEach(err => {
            console.error(`   ${err.instancePath || "/"}: ${err.message}`);
        });
        return false;
    }

    console.log(`✅ Schema OK: ${name}`);
    return true;
}

// ─────────────────────────────────────────────────────────────
// Cross-reference validation
// ─────────────────────────────────────────────────────────────

function validateCrossReferences(intents, uxComponents, errorIntents) {
    const errors = [];

    // Collect all known IDs
    const intentIds = new Set(intents.intents.map(i => i.id));
    const componentIds = new Set(Object.keys(uxComponents.components));
    const errorIds = new Set(errorIntents.error_intents.map(e => e.id));

    // All valid action targets
    const validTargets = new Set([...intentIds, ...componentIds, ...errorIds]);

    // Check intent actions
    intents.intents.forEach(intent => {
        const actions = intent.response?.actions || [];
        actions.forEach(actionId => {
            if (!validTargets.has(actionId)) {
                errors.push(`Intent "${intent.id}" references unknown action: "${actionId}"`);
            }
        });
    });

    // Check UX component action_ids
    Object.entries(uxComponents.components).forEach(([compId, comp]) => {
        comp.layout.forEach((row, rowIdx) => {
            row.forEach((btn, btnIdx) => {
                if (!validTargets.has(btn.action_id)) {
                    errors.push(`Component "${compId}" [row ${rowIdx}, btn ${btnIdx}] references unknown action: "${btn.action_id}"`);
                }
            });
        });
    });

    // Check error intent actions
    errorIntents.error_intents.forEach(err => {
        const actions = err.response?.actions || [];
        actions.forEach(actionId => {
            if (!validTargets.has(actionId)) {
                errors.push(`Error intent "${err.id}" references unknown action: "${actionId}"`);
            }
        });
    });

    if (errors.length > 0) {
        console.error("\n❌ Cross-reference errors:");
        errors.forEach(e => console.error(`   ${e}`));
        return false;
    }

    console.log("✅ Cross-references OK");
    return true;
}

// ─────────────────────────────────────────────────────────────
// Telegram UX limits
// ─────────────────────────────────────────────────────────────

function validateTelegramLimits(uxComponents) {
    const errors = [];
    const MAX_ROWS = 3;
    const MAX_BUTTONS_PER_ROW = 2;

    Object.entries(uxComponents.components).forEach(([compId, comp]) => {
        if (comp.layout.length > MAX_ROWS) {
            errors.push(`Component "${compId}" exceeds max rows (${comp.layout.length} > ${MAX_ROWS})`);
        }

        comp.layout.forEach((row, rowIdx) => {
            if (row.length > MAX_BUTTONS_PER_ROW) {
                errors.push(`Component "${compId}" row ${rowIdx} exceeds max buttons (${row.length} > ${MAX_BUTTONS_PER_ROW})`);
            }

            row.forEach((btn, btnIdx) => {
                if (btn.text.length > 64) {
                    errors.push(`Component "${compId}" [row ${rowIdx}, btn ${btnIdx}] text exceeds 64 chars`);
                }
            });
        });
    });

    if (errors.length > 0) {
        console.error("\n❌ Telegram UX limit violations:");
        errors.forEach(e => console.error(`   ${e}`));
        return false;
    }

    console.log("✅ Telegram UX limits OK");
    return true;
}

// ─────────────────────────────────────────────────────────────
// Danger action validation
// ─────────────────────────────────────────────────────────────

function validateDangerActions(intents, uxComponents) {
    const errors = [];

    // Build map of intents with confirmation_required
    const confirmedIntents = new Set(
        intents.intents.filter(i => i.confirmation_required).map(i => i.id)
    );

    // Check all danger-styled buttons
    Object.entries(uxComponents.components).forEach(([compId, comp]) => {
        comp.layout.forEach((row, rowIdx) => {
            row.forEach((btn, btnIdx) => {
                if (btn.style === "danger") {
                    // Button with danger style should point to intent with confirmation_required
                    const targetIntent = intents.intents.find(i => i.id === btn.action_id);
                    if (targetIntent && !targetIntent.confirmation_required) {
                        errors.push(`Danger button "${btn.text}" in "${compId}" points to intent without confirmation_required`);
                    }
                }
            });
        });
    });

    if (errors.length > 0) {
        console.error("\n❌ Danger action violations:");
        errors.forEach(e => console.error(`   ${e}`));
        return false;
    }

    console.log("✅ Danger actions OK");
    return true;
}

// ─────────────────────────────────────────────────────────────
// Forbidden auto-mutation actions
// ─────────────────────────────────────────────────────────────

function validateNoAutoMutations(intents) {
    const errors = [];
    const FORBIDDEN_PATTERNS = [
        "delete", "fire", "assign", "pay", "transfer",
        "approve_auto", "reject_auto", "execute", "run"
    ];

    intents.intents.forEach(intent => {
        FORBIDDEN_PATTERNS.forEach(pattern => {
            if (intent.id.includes(pattern)) {
                errors.push(`Intent "${intent.id}" contains forbidden auto-mutation pattern: "${pattern}"`);
            }
        });

        const actions = intent.response?.actions || [];
        actions.forEach(actionId => {
            FORBIDDEN_PATTERNS.forEach(pattern => {
                if (actionId.includes(pattern)) {
                    errors.push(`Intent "${intent.id}" references forbidden action: "${actionId}"`);
                }
            });
        });
    });

    if (errors.length > 0) {
        console.error("\n❌ Forbidden auto-mutation violations:");
        errors.forEach(e => console.error(`   ${e}`));
        return false;
    }

    console.log("✅ No auto-mutations OK");
    return true;
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

console.log("\n═══════════════════════════════════════════════════════");
console.log("  MG Chat Contract Linter");
console.log("═══════════════════════════════════════════════════════\n");

const results = [
    validateSchema(intentSchema, intentMap, "mg_intent_map.json"),
    validateSchema(uxSchema, uxMap, "mg_ux_components_map.json"),
    validateSchema(errorSchema, errorMap, "error_ux_map.json"),
    validateCrossReferences(intentMap, uxMap, errorMap),
    validateTelegramLimits(uxMap),
    validateDangerActions(intentMap, uxMap),
    validateNoAutoMutations(intentMap),
];

console.log("\n═══════════════════════════════════════════════════════");

if (results.every(r => r)) {
    console.log("  ✅ All MG Chat contracts are VALID");
    console.log("═══════════════════════════════════════════════════════\n");
    process.exit(0);
} else {
    console.log("  ❌ MG Chat contracts have ERRORS");
    console.log("═══════════════════════════════════════════════════════\n");
    process.exit(1);
}
