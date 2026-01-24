import React from 'react';
import { DollarSign, Calendar } from 'lucide-react';

const TrainersRewardsPage: React.FC = () => {
    const payouts = [
        { id: '1', month: 'Ноябрь 2024', amount: '45,000₽', status: 'paid', date: '30.11.2024' },
        { id: '2', month: 'Октябрь 2024', amount: '38,500₽', status: 'paid', date: '31.10.2024' },
        { id: '3', month: 'Сентябрь 2024', amount: '42,000₽', status: 'paid', date: '30.09.2024' }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-8">Выплаты и Награды</h1>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 mb-8 border border-green-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-[#717182] mb-1">Ожидаемая выплата в декабре</h3>
                        <div className="text-3xl font-medium text-gray-900 mb-2">~48,000₽</div>
                        <p className="text-sm text-gray-600">На основе текущей активности</p>
                    </div>
                    <DollarSign className="w-16 h-16 text-green-600" />
                </div>
            </div>

            <h2 className="text-xl font-medium text-gray-900 mb-4">История выплат</h2>
            <div className="space-y-3">
                {payouts.map(payout => (
                    <div key={payout.id} className="bg-white p-5 rounded-xl border flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-gray-900">{payout.month}</h3>
                            <p className="text-sm text-[#717182] flex items-center mt-1">
                                <Calendar className="w-3 h-3 mr-1" />
                                Выплачено {payout.date}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-medium text-green-600">{payout.amount}</div>
                            <span className="text-xs text-green-600">✓ Оплачено</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrainersRewardsPage;
