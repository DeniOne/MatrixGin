import { useState, useCallback } from 'react';
import { PurchaseRequestDto, StorePurchaseError } from '../api/economy.types';

export interface PurchaseState {
    isLoading: boolean;
    error: string | null;
    success: boolean;
}

/**
 * useStorePurchase - Хук для управления процессом покупки.
 * Обеспечивает защиту от двойных кликов и маппинг ошибок бэкенда.
 */
export const useStorePurchase = () => {
    const [state, setState] = useState<PurchaseState>({
        isLoading: false,
        error: null,
        success: false,
    });

    const purchase = useCallback(async (itemUrn: string) => {
        setState({ isLoading: true, error: null, success: false });

        try {
            const response = await fetch('/api/store/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item_urn: itemUrn,
                    quantity: 1
                } as PurchaseRequestDto),
            });

            if (response.ok) {
                setState({ isLoading: false, error: null, success: true });
                return true;
            }

            // Маппинг ошибок согласно Error Handling Matrix
            let errorMessage = 'Неизвестная ошибка при совершении покупки';

            switch (response.status) {
                case StorePurchaseError.INSUFFICIENT_FUNDS:
                    errorMessage = 'Недостаточно MatrixCoin';
                    break;
                case StorePurchaseError.IDEMPOTENCY_CONFLICT:
                    errorMessage = 'Транзакция уже в обработке';
                    break;
                case StorePurchaseError.BUSINESS_RESTRICTION:
                    errorMessage = 'Лимит исчерпан или предмет недоступен';
                    break;
                case StorePurchaseError.FORBIDDEN:
                    errorMessage = 'Доступ к этой покупке ограничен';
                    break;
                case StorePurchaseError.UNAUTHORIZED:
                    errorMessage = 'Необходима авторизация';
                    break;
                default:
                    errorMessage = `Ошибка сервера: ${response.status}`;
            }

            setState({ isLoading: false, error: errorMessage, success: false });
            return false;

        } catch (err) {
            setState({
                isLoading: false,
                error: 'Ошибка сети. Проверьте соединение.',
                success: false
            });
            return false;
        }
    }, []);

    const reset = useCallback(() => {
        setState({ isLoading: false, error: null, success: false });
    }, []);

    return { ...state, purchase, reset };
};
