import React from 'react';
import { TransactionDto } from '../../api/economy.types';

// Mock data for skeleton phase
const MOCK_TRANSACTIONS: TransactionDto[] = [
    {
        id: 'tx_1',
        type: 'DEBIT',
        currency: 'MC',
        amount: 500,
        purpose: 'Покупка: Дополнительный слот обучения',
        timestamp: '2026-01-18T14:20:00Z'
    },
    {
        id: 'tx_2',
        type: 'CREDIT',
        currency: 'MC',
        amount: 1000,
        purpose: 'Начисление: Завершение модуля 07',
        timestamp: '2026-01-17T18:00:00Z'
    },
    {
        id: 'tx_3',
        type: 'CREDIT',
        currency: 'GMC',
        amount: 0.5,
        purpose: 'Начисление: Вклад в развитие продукта',
        timestamp: '2026-01-16T10:00:00Z'
    }
];

/**
 * WalletPage - Кошелек (Economy Module)
 */
const WalletPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">Мой Кошелек (Wallet)</h1>
                <p className="text-gray-400 font-light">Управление активами и история вашего участия в MatrixGin.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* MC Section */}
                <div className="bg-gradient-to-br from-indigo-950/40 to-black border border-indigo-500/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <div className="text-6xl font-black">MC</div>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Operational Assets</h3>
                        <div className="flex items-baseline gap-2">
                            <div className="text-5xl font-bold text-white tracking-tight">5,430</div>
                            <div className="text-indigo-300 font-medium text-lg">MC</div>
                        </div>
                        <div className="text-indigo-500/70 text-sm mt-4 font-light">
                            Используется для взаимодействия с инструментами и ресурсами системы.
                        </div>
                    </div>
                </div>

                {/* GMC Section */}
                <div className="bg-gradient-to-br from-amber-950/30 to-black border border-amber-500/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <div className="text-6xl font-black">GMC</div>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Strategic Capital</h3>
                        <div className="flex items-baseline gap-2">
                            <div className="text-5xl font-bold text-white tracking-tight">12.50</div>
                            <div className="text-amber-300 font-medium text-lg">GMC</div>
                        </div>
                        <div className="text-amber-500/70 text-sm mt-4 font-light">
                            Представляет вашу долю влияния и стратегический вклад в проект.
                        </div>
                    </div>
                </div>
            </div>

            <section>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    История транзакций
                    <span className="text-xs font-normal bg-gray-800 text-gray-400 px-2 py-1 rounded">Последние 3</span>
                </h2>

                <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800/30">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Дата</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Назначение</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Сумма</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {MOCK_TRANSACTIONS.map(tx => (
                                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                        {new Date(tx.timestamp).toLocaleDateString('ru-RU')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-200">{tx.purpose}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className={`text-sm font-bold ${tx.type === 'DEBIT' ? 'text-red-400' : 'text-emerald-400'}`}>
                                            {tx.type === 'DEBIT' ? '-' : '+'}{tx.amount} {tx.currency}
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
