/**
 * Telegram Webhook Handler
 * 
 * Entry point for Telegram webhook updates.
 * 
 * WHY THIS EXISTS:
 * - Telegram sends updates via webhook
 * - This layer routes them to Core pipeline
 * - Returns HTTP 200 to Telegram
 * 
 * ARCHITECTURE:
 * 1. Receive Telegram update
 * 2. Normalize input
 * 3. Route to appropriate pipeline
 * 4. Send response back to Telegram
 * 5. Return HTTP 200
 * 
 * RULES:
 * - NO business logic
 * - NO decision making beyond routing
 * - ONLY glue code
 */

import { Request, Response } from 'express';
import { TelegramUpdate } from './telegram.types';
import { normalizeUpdate } from './telegram.normalizer';
import { processTextMessage, processCallback } from './telegram.adapter';
import { sendMessage, editMessage, answerCallbackQuery } from './telegram.sender';
import { AccessContext } from '../../access/mg-chat-acl';

/**
 * TEMP: Demo user mapping for ACL integration.
 * 
 * TODO: Replace with Auth service call in production.
 * This inline mapping is explicitly marked as temporary.
 */
function getDemoAccessContext(telegramUserId: number): AccessContext {
    const DEMO_USERS: Record<number, AccessContext> = {
        123456: { userId: 'user1', roles: ['EMPLOYEE'], contour: 'employee', scope: 'self' },
        789012: { userId: 'user2', roles: ['MANAGER'], contour: 'manager', scope: 'own_unit' },
        345678: { userId: 'user3', roles: ['EXECUTIVE'], contour: 'exec', scope: 'global' }
    };

    return DEMO_USERS[telegramUserId] || {
        userId: `telegram_${telegramUserId}`,
        roles: ['EMPLOYEE'],
        contour: 'employee',
        scope: 'self'
    };
}

/**
 * Handle Telegram webhook update.
 * 
 * This is the ONLY entry point for Telegram integration.
 */
export async function handleTelegramWebhook(req: Request, res: Response): Promise<void> {
    try {
        const update: TelegramUpdate = req.body;

        console.log('[Telegram Webhook] Received update:', update.update_id);

        // 1. Normalize input
        const normalized = normalizeUpdate(update);

        if (!normalized) {
            console.log('[Telegram Webhook] Unsupported update type, ignoring');
            res.status(200).send('OK');
            return;
        }

        // 2. Route to appropriate pipeline
        if (normalized.type === 'text') {
            // Text message flow
            console.log('[Telegram Webhook] Processing text message');

            const telegramUserId = update.message?.from?.id || 0;
            const accessContext = getDemoAccessContext(telegramUserId);
            const rendered = processTextMessage(normalized.text, accessContext);

            await sendMessage(normalized.chatId, rendered);
        } else {
            // Callback query flow
            console.log('[Telegram Webhook] Processing callback query');

            const telegramUserId = update.callback_query?.from?.id || 0;
            const accessContext = getDemoAccessContext(telegramUserId);
            const rendered = processCallback(normalized.actionId, accessContext);

            // Answer callback query (acknowledge)
            await answerCallbackQuery(normalized.callbackQueryId);

            // Edit message with new content
            await editMessage(normalized.chatId, normalized.messageId, rendered);
        }

        // 3. Return HTTP 200 to Telegram
        res.status(200).send('OK');
    } catch (error) {
        console.error('[Telegram Webhook] Error processing update:', error);

        // WHY: Always return 200 to Telegram to prevent retries
        res.status(200).send('OK');
    }
}
