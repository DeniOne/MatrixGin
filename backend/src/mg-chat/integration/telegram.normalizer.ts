/**
 * Telegram Input Normalizer
 * 
 * Converts Telegram webhook updates to Core-compatible DTOs.
 * 
 * WHY THIS EXISTS:
 * - Telegram sends complex nested objects
 * - Core expects simple, normalized inputs
 * - This layer decouples Core from Telegram specifics
 * 
 * RULES:
 * - NO business logic
 * - NO decision making
 * - ONLY data transformation
 */

import { TelegramUpdate, NormalizedInput, NormalizedTextInput, NormalizedCallbackInput } from './telegram.types';

/**
 * Normalize Telegram update to Core input.
 * 
 * @param update - Telegram webhook update
 * @returns Normalized input or null if invalid
 */
export function normalizeUpdate(update: TelegramUpdate): NormalizedInput | null {
    // Text message
    if (update.message?.text) {
        return normalizeTextMessage(update);
    }

    // Callback query
    if (update.callback_query?.data) {
        return normalizeCallbackQuery(update);
    }

    // Unsupported update type
    return null;
}

/**
 * Normalize text message.
 * 
 * WHY: Extract only what Core needs, discard Telegram metadata.
 */
function normalizeTextMessage(update: TelegramUpdate): NormalizedTextInput | null {
    const message = update.message!;
    const text = message.text!;

    // Validate required fields
    if (!message.chat?.id || !message.message_id) {
        return null;
    }

    return {
        type: 'text',
        chatId: message.chat.id,
        messageId: message.message_id,
        userId: message.from?.id || 0,
        text: text.trim() // Sanitize: trim whitespace
    };
}

/**
 * Normalize callback query.
 * 
 * WHY: Extract action_id and metadata, discard Telegram specifics.
 */
function normalizeCallbackQuery(update: TelegramUpdate): NormalizedCallbackInput | null {
    const callback = update.callback_query!;
    const actionId = callback.data!;

    // Validate required fields
    if (!callback.message?.chat?.id || !callback.message.message_id || !callback.id) {
        return null;
    }

    return {
        type: 'callback',
        chatId: callback.message.chat.id,
        messageId: callback.message.message_id,
        userId: callback.from.id,
        callbackQueryId: callback.id,
        actionId: actionId.trim() // Sanitize: trim whitespace
    };
}
