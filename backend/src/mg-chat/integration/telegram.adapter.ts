/**
 * Telegram Core Adapter
 * 
 * Orchestrates Core pipeline execution.
 * 
 * WHY THIS EXISTS:
 * - Glue between normalized input and Core pipeline
 * - Enforces correct pipeline order
 * - NO business logic, ONLY orchestration
 * 
 * RULES:
 * - NO skipping steps
 * - NO combining branches
 * - NO decision making
 * - ONLY call Core functions in order
 */

import { NormalizedInput } from './telegram.types';
import { detectError, ErrorContext, MGChatError } from '../errors';
import { resolveIntent } from '../intent';
import { dispatchAction } from '../dispatcher';
import { renderTelegramMessage, MGChatResponse, TelegramRenderedMessage } from '../telegram';
import { routeScenario } from '../scenarios';
import { aclMiddleware, ACLForbiddenError, ACLOutOfScopeError, AccessContext } from '../../access/mg-chat-acl';

/**
 * Process text message through Core pipeline.
 * 
 * FLOW:
 * 1. Error UX Interceptor
 * 2. Intent Resolver
 * 3. ACL Middleware
 * 4. Scenario Router
 * 5. Telegram UX Renderer
 * 
 * WHY: Text messages need intent resolution from user input.
 */
export function processTextMessage(
    text: string,
    accessContext: AccessContext,
    context: ErrorContext = {}
): TelegramRenderedMessage {
    // Step 1: Error UX Interceptor
    const errorResult = detectError(text, context);

    if (errorResult.matched && errorResult.match) {
        // Error detected → render error UX
        const errorResponse: MGChatResponse = {
            text: errorResult.match.text,
            actions: errorResult.match.actions
        };
        return renderTelegramMessage(errorResponse);
    }

    // Step 2: Intent Resolver
    const intentResult = resolveIntent(text);

    if (!intentResult.resolved) {
        // Intent not resolved → fallback to unknown_intent
        // WHY: This is still handled by Core (error_ux_map.json)
        const fallbackResponse: MGChatResponse = {
            text: "Я не понял запрос. Могу помочь с основными вещами:",
            actions: ['my_tasks', 'my_shifts', 'my_status']
        };
        return renderTelegramMessage(fallbackResponse);
    }

    // Step 3: ACL Check
    try {
        aclMiddleware({
            intent: intentResult.intent!.intentId,
            accessContext
        });
    } catch (error) {
        // Проброс ACL ошибок как доменных ошибок MG Chat
        if (error instanceof ACLForbiddenError) {
            throw new MGChatError('ACL_FORBIDDEN');
        }
        if (error instanceof ACLOutOfScopeError) {
            throw new MGChatError('ACL_OUT_OF_SCOPE');
        }
        throw error;  // Unknown error → propagate
    }

    // Step 4: Build response from intent via Scenario Router
    const response = routeScenario(intentResult.intent!);

    // Step 5: Telegram UX Renderer
    return renderTelegramMessage(response);
}

/**
 * Process callback query through Core pipeline.
 * 
 * FLOW:
 * 1. Action Dispatcher
 * 2. Intent Resolver
 * 3. ACL Middleware
 * 4. Scenario Router
 * 5. Telegram UX Renderer
 * 
 * WHY: Callbacks already have action_id, skip error detection.
 */
export function processCallback(
    actionId: string,
    accessContext: AccessContext
): TelegramRenderedMessage {
    // Step 1: Action Dispatcher
    const dispatchResult = dispatchAction(actionId);

    if (dispatchResult.status === 'error') {
        // Unknown action → error UX
        const errorResponse: MGChatResponse = {
            text: `Действие не найдено: ${dispatchResult.error_code}`,
            actions: ['my_tasks', 'my_shifts']
        };
        return renderTelegramMessage(errorResponse);
    }

    // Step 2: Intent Resolver (reuse)
    const intentResult = resolveIntent(dispatchResult.intent);

    if (!intentResult.resolved) {
        // Intent not resolved → fallback
        const fallbackResponse: MGChatResponse = {
            text: "Не удалось обработать действие.",
            actions: ['my_tasks']
        };
        return renderTelegramMessage(fallbackResponse);
    }

    // Step 3: ACL Check
    try {
        aclMiddleware({
            intent: intentResult.intent!.intentId,
            accessContext
        });
    } catch (error) {
        // Проброс ACL ошибок как доменных ошибок MG Chat
        if (error instanceof ACLForbiddenError) {
            throw new MGChatError('ACL_FORBIDDEN');
        }
        if (error instanceof ACLOutOfScopeError) {
            throw new MGChatError('ACL_OUT_OF_SCOPE');
        }
        throw error;
    }

    // Step 4: Build response from intent via Scenario Router
    const response = routeScenario(intentResult.intent!);

    // Step 5: Telegram UX Renderer
    return renderTelegramMessage(response);
}
