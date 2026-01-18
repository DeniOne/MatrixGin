import React from 'react';
import { StoreItemCard } from '../../components/economy/StoreItemCard';
import { StoreItemDto } from '../../api/economy.types';

// Mock data for skeleton phase
const MOCK_ITEMS: StoreItemDto[] = [
    {
        id: '1',
        urn: 'urn:mg:economy:item:training-slot',
        label: 'Дополнительный слот обучения',
        description: 'Открывает возможность проходить еще один курс параллельно основной программе.',
        price_mc: 500,
        status: 'ACTIVE'
    },
    {
        id: '2',
        urn: 'urn:mg:economy:item:audit-pass',
        label: 'Сертификат ускоренного аудита',
        description: 'Приоритетная проверка ваших работ в течение 24 часов.',
        price_mc: 1200,
        status: 'ACTIVE'
    },
    {
        id: '3',
        urn: 'urn:mg:economy:item:premium-badge',
        label: 'Цифровой статус "Наставник"',
        description: 'Визуальное отличие в системе и доступ к закрытым чатам экспертов.',
        price_mc: 3000,
        status: 'LIMIT_REACHED'
    }
];

/**
 * StorePage - Магазин (Economy Module)
 */
const StorePage: React.FC = () => {
    return (
        <div className="space-y-6">
            <header>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Магазин (Store)</h1>
                        <p className="text-gray-400">Обменивайте свои MatrixCoin на ценные возможности и ресурсы.</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-sm">
                        Балланс: <span className="text-indigo-400 font-bold">5,430 MC</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {MOCK_ITEMS.map(item => (
                    <StoreItemCard key={item.id} item={item} />
                ))}
            </div>

            <footer className="mt-12 pt-8 border-t border-gray-800 text-gray-500 text-sm">
                <p>Все операции в магазине окончательны. MatrixCoin не является валютой и не подлежит обмену на фиатные деньги.</p>
            </footer>
        </div>
    );
};

export default StorePage;
