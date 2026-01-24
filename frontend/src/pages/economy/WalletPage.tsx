import React from 'react';
import { useGetWalletQuery, useGetTransactionsQuery } from '../../features/economy/economyApi';
import { Wallet, History, ArrowUpRight, ArrowDownLeft, ShieldCheck, Zap } from 'lucide-react';

/**
 * WalletPage - Кошелек (Economy Module)
 */
const WalletPage: React.FC = () => {
    const { data: wallet, isLoading: isWalletLoading } = useGetWalletQuery();
    const { data: transactionsData, isLoading: isTxLoading } = useGetTransactionsQuery({ limit: 5 });

    if (isWalletLoading) return <div className="p-8 text-indigo-500 animate-pulse">Загрузка данных кошелька...</div>;

    const transactions = transactionsData?.data || [];

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-4">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-medium text-[#030213] tracking-tight flex items-center gap-3">
                    <Wallet className="w-8 h-8 text-indigo-400" />
                    Мой Кошелек
                </h1>
                <p className="text-[#717182] font-light max-w-2xl">
                    Управление активами и прозрачная история вашего участия в экономике MatrixGin.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* MC Section */}
                <div className="bg-gradient-to-br from-indigo-950/40 to-black border border-indigo-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Zap className="w-32 h-32 text-indigo-400" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            <h3 className="text-indigo-400 text-[10px] font-medium uppercase tracking-[0.2em]">Операционные Активы</h3>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <div className="text-6xl font-medium text-[#030213] tracking-tighter">
                                {wallet?.mcBalance.toLocaleString() || '0'}
                            </div>
                            <div className="text-indigo-300 font-medium text-xl">MC</div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-indigo-500/70 text-xs font-light leading-relaxed max-w-xs">
                                Ликвидные средства для активации инструментов, ресурсов и участия в аукционах.
                            </p>
                            {wallet?.mcFrozen ? (
                                <div className="flex items-center gap-2 text-[10px] text-amber-500 bg-amber-500/10 w-fit px-2 py-1 rounded border border-amber-500/20">
                                    <ShieldCheck className="w-3 h-3" />
                                    Заблокировано: {wallet.mcFrozen} MC
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* GMC Section */}
                <div className="bg-gradient-to-br from-amber-950/30 to-black border border-amber-500/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-amber-500/30 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ShieldCheck className="w-32 h-32 text-amber-400" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <h3 className="text-amber-400 text-[10px] font-medium uppercase tracking-[0.2em]">Стратегический Капитал</h3>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <div className="text-6xl font-medium text-[#030213] tracking-tighter">
                                {wallet?.gmcBalance.toLocaleString() || '0'}
                            </div>
                            <div className="text-amber-300 font-medium text-xl">GMC</div>
                        </div>
                        <div className="text-amber-500/70 text-xs font-light leading-relaxed max-w-xs">
                            Ваша доля влияния и стратегический вклад. Определяет вес вашего голоса в системе.
                        </div>
                    </div>
                </div>
            </div>

            <section className="bg-white/30 border border-black/10/50 rounded-3xl p-8 backdrop-blur-md">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-medium text-[#030213] flex items-center gap-3">
                        <History className="w-6 h-6 text-[#717182]" />
                        Последние операции
                    </h2>
                    <a href="/economy/transactions" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">
                        Смотреть все
                    </a>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-black/10">
                                <th className="pb-4 text-[10px] font-medium text-[#717182] uppercase tracking-wider">Дата</th>
                                <th className="pb-4 text-[10px] font-medium text-[#717182] uppercase tracking-wider">Тип</th>
                                <th className="pb-4 text-[10px] font-medium text-[#717182] uppercase tracking-wider">Описание</th>
                                <th className="pb-4 text-[10px] font-medium text-[#717182] uppercase tracking-wider text-right">Сумма</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/30">
                            {isTxLoading ? (
                                <tr><td colSpan={4} className="py-8 text-center text-gray-600 italic">Загрузка транзакций...</td></tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan={4} className="py-8 text-center text-gray-600 italic">Операций пока не совершалось</td></tr>
                            ) : transactions.map(tx => (
                                <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-5 text-xs text-[#717182] font-mono">
                                        {new Date(tx.createdAt).toLocaleDateString('ru-RU')}
                                    </td>
                                    <td className="py-5">
                                        <div className="flex items-center gap-2">
                                            {tx.amount > 0 ? (
                                                <ArrowDownLeft className="w-3 h-3 text-emerald-500" />
                                            ) : (
                                                <ArrowUpRight className="w-3 h-3 text-red-500" />
                                            )}
                                            <span className="text-[10px] font-medium text-[#717182] uppercase tracking-tighter bg-gray-800 px-2 py-0.5 rounded">
                                                {tx.type}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <div className="text-sm text-gray-300 line-clamp-1">{tx.description || 'Без описания'}</div>
                                    </td>
                                    <td className="py-5 text-right">
                                        <div className={`text-sm font-medium tracking-tight ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} {tx.currency}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default WalletPage;
