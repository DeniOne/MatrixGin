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
        <div className="p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-medium text-[#030213] tracking-tight flex items-center gap-3">
                    <History className="w-8 h-8 text-indigo-500" />
                    История Транзакций
                </h1>
                <p className="text-[#717182] font-light max-w-2xl">
                    Полный реестр всех экономических событий вашего профиля.
                </p>
            </header>

            <div className="flex flex-wrap items-center gap-4 bg-white border border-black/10 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 bg-[#F3F3F5] border border-black/5 rounded-xl px-4 py-2 flex-grow max-w-md">
                    <Search className="w-4 h-4 text-[#717182]" />
                    <input
                        type="text"
                        placeholder="Поиск по описанию..."
                        className="bg-transparent border-none text-sm text-[#030213] focus:ring-0 placeholder-[#717182]/50 w-full font-normal"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <select
                        className="bg-[#F3F3F5] border border-black/5 rounded-xl px-4 py-2 text-xs text-[#717182] focus:ring-indigo-500 font-medium"
                        onChange={(e) => setCurrency(e.target.value as Currency || undefined)}
                    >
                        <option value="">Все валюты</option>
                        <option value="MC">MatrixCoin (MC)</option>
                        <option value="GMC">GlobalMatrixCoin (GMC)</option>
                    </select>

                    <select
                        className="bg-[#F3F3F5] border border-black/5 rounded-xl px-4 py-2 text-xs text-[#717182] focus:ring-indigo-500 font-medium"
                        onChange={(e) => setType(e.target.value as TransactionType || undefined)}
                    >
                        <option value="">Все типы</option>
                        <option value="REWARD">Награды</option>
                        <option value="PURCHASE">Покупки</option>
                        <option value="TRANSFER">Переводы</option>
                    </select>
                </div>
            </div>

            <div className="bg-white border border-black/10 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-6 py-4 text-[10px] font-medium text-[#717182] uppercase tracking-wider">Дата</th>
                            <th className="px-6 py-4 text-[10px] font-medium text-[#717182] uppercase tracking-wider">Тип</th>
                            <th className="px-6 py-4 text-[10px] font-medium text-[#717182] uppercase tracking-wider">Описание</th>
                            <th className="px-6 py-4 text-[10px] font-medium text-[#717182] uppercase tracking-wider text-right">Сумма</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {isLoading ? (
                            <tr><td colSpan={4} className="py-20 text-center text-indigo-500 animate-pulse italic font-medium">Синхронизация реестра...</td></tr>
                        ) : transactions.length === 0 ? (
                            <tr><td colSpan={4} className="py-20 text-center text-[#717182] italic font-normal">Операций не найдено</td></tr>
                        ) : transactions.map(tx => (
                            <tr key={tx.id} className="group hover:bg-[#F3F3F5]/50 transition-colors">
                                <td className="px-6 py-5 text-xs text-[#717182] font-mono">
                                    {new Date(tx.createdAt).toLocaleDateString('ru-RU')}
                                    <span className="block text-[10px] opacity-60 font-medium">{new Date(tx.createdAt).toLocaleTimeString('ru-RU')}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${tx.type === 'REWARD' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            tx.type === 'PURCHASE' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                'bg-indigo-50 text-indigo-600 border-indigo-100'
                                            }`}>
                                            {tx.type}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="text-sm text-[#030213] font-normal">{tx.description || 'System operation'}</div>
                                    <div className="text-[10px] text-[#717182] font-mono mt-1 font-medium">ID: {tx.id.substring(0, 8)}...</div>
                                </td>
                                <td className="px-6 py-5 text-right font-medium">
                                    <div className={`text-sm tracking-tight ${tx.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
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
                    className="px-4 py-2 bg-white border border-black/10 rounded-xl text-xs font-medium text-[#717182] disabled:opacity-30 hover:border-indigo-500 transition-colors shadow-sm"
                >
                    Назад
                </button>
                <div className="px-4 py-2 bg-[#F3F3F5] border border-black/5 rounded-xl text-xs font-medium text-indigo-600">
                    Страница {page}
                </div>
                <button
                    disabled={transactions.length < 15}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 bg-white border border-black/10 rounded-xl text-xs font-medium text-[#717182] disabled:opacity-30 hover:border-indigo-500 transition-colors shadow-sm"
                >
                    Вперед
                </button>
            </div>
        </div>
    );
};

export default TransactionsPage;
