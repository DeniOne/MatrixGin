import React from 'react';
import { StoreItemDto } from '../../api/economy.types';
import { useStorePurchase } from '../../hooks/useStorePurchase';

interface StoreItemCardProps {
    item: StoreItemDto;
    onPurchaseSuccess?: () => void;
}

/**
 * StoreItemCard - Карточка товара в магазине.
 * Отображает информацию о товаре и управляет процессом его покупки.
 */
export const StoreItemCard: React.FC<StoreItemCardProps> = ({ item, onPurchaseSuccess }) => {
    const { isLoading, error, success, purchase, reset } = useStorePurchase();

    const handlePurchase = async () => {
        const result = await purchase(item.urn);
        if (result && onPurchaseSuccess) {
            onPurchaseSuccess();
        }
    };

    const isInactive = item.status === 'INACTIVE';
    const isLimitReached = item.status === 'LIMIT_REACHED';
    const isUnavailable = item.status === 'UNAVAILABLE';
    const canPurchase = !isInactive && !isLimitReached && !isUnavailable && !isLoading;

    return (
        <div className={`flex flex-col h-full bg-white border ${error ? 'border-red-200' : 'border-black/10'} rounded-2xl p-5 transition-all hover:shadow-md hover:border-indigo-200`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-[#030213] leading-tight">{item.label}</h3>
                <span className="bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full border border-indigo-200">
                    {item.price_mc} MC
                </span>
            </div>

            <p className="text-[#717182] text-sm flex-grow mb-6">
                {item.description}
            </p>

            <div className="mt-auto space-y-3">
                {/* Error Display */}
                {error && (
                    <div className="text-red-700 text-xs bg-red-50 border border-red-200 p-2 rounded-lg">
                        ⚠ {error}
                    </div>
                )}

                {/* Success Display */}
                {success && (
                    <div className="text-emerald-700 text-xs bg-emerald-50 border border-emerald-200 p-2 rounded-lg">
                        ✓ Приобретено успешно
                    </div>
                )}

                {/* Status Badges for non-active states */}
                {!canPurchase && !isLoading && !success && (
                    <div className="text-[#717182] text-xs italic text-center mb-2">
                        {isLimitReached ? 'Достигнут лимит покупок' : isInactive ? 'Временно недоступно' : 'Недоступно'}
                    </div>
                )}

                <button
                    onClick={handlePurchase}
                    disabled={!canPurchase}
                    className={`w-full py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2
                        ${canPurchase
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-[#030213] shadow-lg shadow-indigo-600/20 active:scale-95'
                            : 'bg-[#F3F3F5] text-[#717182] cursor-not-allowed'}
                    `}
                >
                    {isLoading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-indigo-300/30 border-t-indigo-300 rounded-full animate-spin"></span>
                            Обработка...
                        </>
                    ) : success ? (
                        'Купить еще'
                    ) : (
                        'Приобрести'
                    )}
                </button>

                {error && (
                    <button
                        onClick={reset}
                        className="w-full text-xs text-[#717182] hover:text-[#030213] transition-colors py-1"
                    >
                        Сбросить ошибку
                    </button>
                )}
            </div>
        </div>
    );
};
