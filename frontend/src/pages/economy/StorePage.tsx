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
        <div className="space-y-8 max-w-7xl mx-auto p-4 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-medium text-[#030213] mb-2 flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8 text-indigo-600" />
                        Магазин
                    </h1>
                    <p className="text-[#717182] font-light max-w-xl">Обменивайте свои MatrixCoin на уникальные возможности, ресурсы и статусы.</p>
                </div>
                <div className="bg-white border border-indigo-100 rounded-2xl px-6 py-4 shadow-sm group hover:border-indigo-300 transition-all duration-300">
                    <div className="text-[10px] text-indigo-600 font-medium uppercase tracking-widest mb-1">Ваш Баланс</div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-medium text-[#030213]">{wallet?.mcBalance.toLocaleString() || '0'}</span>
                        <span className="text-sm font-medium text-indigo-500">MC</span>
                    </div>
                </div>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-2xl border border-black/10" />)}
                </div>
            ) : !items || items.length === 0 ? (
                <div className="py-20 text-center text-[#717182] italic border border-dashed border-black/10 rounded-3xl bg-[#F8FAFC]">
                    Витрина временно пуста. Пожалуйста, вернитесь позже.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item: StoreItemDto) => (
                        <StoreItemCard key={item.id} item={item} />
                    ))}
                </div>
            )}

            <footer className="mt-12 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[#717182] text-[10px] uppercase tracking-widest">
                <p>© 2026 MatrixGin Economy • Все операции окончательны</p>
                <div className="flex gap-6">
                    <span className="hover:text-[#030213] transition-colors cursor-help">Правила обмена</span>
                    <span className="hover:text-[#030213] transition-colors cursor-help">Гарантии</span>
                </div>
            </footer>
        </div>
    );
};

export default StorePage;
