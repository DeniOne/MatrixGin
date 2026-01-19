import React from 'react';
import { StoreItemCard } from '../../components/economy/StoreItemCard';
import { useGetWalletQuery, useGetStoreItemsQuery } from '../../features/economy/economyApi';
import { StoreItemDto } from '../../api/economy.types';
import { ShoppingBag } from 'lucide-react';

/**
 * StorePage - Магазин (Economy Module)
 */
const StorePage: React.FC = () => {
    const { data: wallet } = useGetWalletQuery();
    const { data: items, isLoading } = useGetStoreItemsQuery();

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-4">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8 text-indigo-400" />
                        Магазин
                    </h1>
                    <p className="text-gray-400 font-light max-w-xl">Обменивайте свои MatrixCoin на уникальные возможности, ресурсы и статусы.</p>
                </div>
                <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl px-6 py-4 backdrop-blur-sm group hover:border-indigo-500/40 transition-all duration-300">
                    <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1">Ваш Баланс</div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white">{wallet?.mcBalance.toLocaleString() || '0'}</span>
                        <span className="text-sm font-bold text-indigo-300">MC</span>
                    </div>
                </div>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-900/50 rounded-2xl border border-gray-800" />)}
                </div>
            ) : !items || items.length === 0 ? (
                <div className="py-20 text-center text-gray-600 italic border border-dashed border-gray-800 rounded-3xl">
                    Витрина временно пуста. Пожалуйста, вернитесь позже.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item: StoreItemDto) => (
                        <StoreItemCard key={item.id} item={item} />
                    ))}
                </div>
            )}

            <footer className="mt-12 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-[10px] uppercase tracking-widest">
                <p>© 2026 MatrixGin Economy • Все операции окончательны</p>
                <div className="flex gap-6">
                    <span className="hover:text-gray-400 transition-colors cursor-help">Правила обмена</span>
                    <span className="hover:text-gray-400 transition-colors cursor-help">Гарантии</span>
                </div>
            </footer>
        </div>
    );
};

export default StorePage;
