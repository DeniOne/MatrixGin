import React, { useState } from 'react';
import { useGetTransactionsQuery, Currency, TransactionType } from '../../features/economy/economyApi';
import { History, Search } from 'lucide-react';

const TransactionsPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [currency, setCurrency] = useState<Currency | undefined>(undefined);
    const [type, setType] = useState<TransactionType | undefined>(undefined);

    const { data, isLoading } = useGetTransactionsQuery({
        page,
        limit: 15,
        currency,
        type
    });

    const transactions = data?.data || [];

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <History className="w-8 h-8 text-indigo-400" />
                    История Транзакций
                </h1>
                <p className="text-gray-400 font-light max-w-2xl">
                    Полный реестр всех экономических событий вашего профиля.
                </p>
            </header>

            <div className="flex flex-wrap items-center gap-4 bg-gray-900/50 p-4 border border-gray-800 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center gap-2 bg-black/40 border border-gray-800 rounded-xl px-4 py-2 flex-grow max-w-md">
                    <Search className="w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Поиск по описанию..."
                        className="bg-transparent border-none text-sm text-white focus:ring-0 placeholder-gray-600 w-full"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <select
                        className="bg-black/40 border border-gray-800 rounded-xl px-4 py-2 text-xs text-gray-400 focus:ring-indigo-500"
                        onChange={(e) => setCurrency(e.target.value as Currency || undefined)}
                    >
                        <option value="">Все валюты</option>
                        <option value="MC">MatrixCoin (MC)</option>
                        <option value="GMC">GlobalMatrixCoin (GMC)</option>
                    </select>

                    <select
                        className="bg-black/40 border border-gray-800 rounded-xl px-4 py-2 text-xs text-gray-400 focus:ring-indigo-500"
                        onChange={(e) => setType(e.target.value as TransactionType || undefined)}
                    >
                        <option value="">Все типы</option>
                        <option value="REWARD">Награды</option>
                        <option value="PURCHASE">Покупки</option>
                        <option value="TRANSFER">Переводы</option>
                    </select>
                </div>
            </div>

            <div className="bg-gray-900/30 border border-gray-800/50 rounded-3xl overflow-hidden backdrop-blur-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-800/20">
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Дата</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Тип</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Описание</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Сумма</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/30">
                        {isLoading ? (
                            <tr><td colSpan={4} className="py-20 text-center text-indigo-500 animate-pulse italic">Синхронизация реестра...</td></tr>
                        ) : transactions.length === 0 ? (
                            <tr><td colSpan={4} className="py-20 text-center text-gray-600 italic">Операций не найдено</td></tr>
                        ) : transactions.map(tx => (
                            <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-5 text-xs text-gray-500 font-mono">
                                    {new Date(tx.createdAt).toLocaleDateString('ru-RU')}
                                    <span className="block text-[10px] opacity-40">{new Date(tx.createdAt).toLocaleTimeString('ru-RU')}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${tx.type === 'REWARD' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                            tx.type === 'PURCHASE' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                                            }`}>
                                            {tx.type}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="text-sm text-gray-300">{tx.description || 'System operation'}</div>
                                    <div className="text-[10px] text-gray-600 font-mono mt-1">ID: {tx.id.substring(0, 8)}...</div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className={`text-sm font-black tracking-tight ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} {tx.currency}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center gap-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs font-bold text-gray-400 disabled:opacity-30 hover:border-indigo-500 transition-colors"
                >
                    Назад
                </button>
                <div className="px-4 py-2 bg-black/40 border border-gray-800 rounded-xl text-xs font-bold text-indigo-400">
                    Страница {page}
                </div>
                <button
                    disabled={transactions.length < 15}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs font-bold text-gray-400 disabled:opacity-30 hover:border-indigo-500 transition-colors"
                >
                    Вперед
                </button>
            </div>
        </div>
    );
};

export default TransactionsPage;
