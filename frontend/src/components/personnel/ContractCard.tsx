import React from 'react';
import { LaborContract } from '@prisma/client';
import { useTerminateContractMutation } from '../../api/personnelApi';

interface ContractCardProps {
    contract: LaborContract;
    userRole?: string;
    onUpdate?: () => void;
}

export const ContractCard: React.FC<ContractCardProps> = ({ contract, userRole, onUpdate }) => {
    const [terminateContract, { isLoading }] = useTerminateContractMutation();

    const handleTerminate = async () => {
        const confirmed = window.confirm(
            'Вы уверены, что хотите расторгнуть договор?\n\n' +
            '⚠️ ВНИМАНИЕ:\n' +
            '- Расторжение договора — юридически значимое действие\n' +
            '- Доступно только для DIRECTOR\n' +
            '- Отменить расторжение невозможно'
        );

        if (!confirmed) return;

        const reason = window.prompt('Укажите причину расторжения:');
        if (!reason) return;

        const terminationDate = window.prompt('Дата расторжения (YYYY-MM-DD):');
        if (!terminationDate) return;

        try {
            await terminateContract({
                id: contract.id,
                body: { reason, terminationDate },
            }).unwrap();

            onUpdate?.();
        } catch (error) {
            console.error('Failed to terminate contract:', error);
            alert('Ошибка расторжения договора');
        }
    };

    const statusColors = {
        ACTIVE: 'bg-green-100 text-green-700',
        SUSPENDED: 'bg-gray-100 text-gray-700',
        TERMINATED: 'bg-red-100 text-red-700',
    };

    const statusLabels = {
        ACTIVE: 'Активен',
        SUSPENDED: 'Приостановлен',
        TERMINATED: 'Расторгнут',
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{contract.contractNumber}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[contract.status]}`}>
                            {statusLabels[contract.status]}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">{contract.contractType}</p>
                </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1 mb-4">
                <div>
                    <span className="font-medium">Дата договора:</span>{' '}
                    {new Date(contract.contractDate).toLocaleDateString('ru-RU')}
                </div>
                <div>
                    <span className="font-medium">Начало работы:</span>{' '}
                    {new Date(contract.startDate).toLocaleDateString('ru-RU')}
                </div>
                {contract.endDate && (
                    <div>
                        <span className="font-medium">Окончание:</span>{' '}
                        {new Date(contract.endDate).toLocaleDateString('ru-RU')}
                    </div>
                )}
                <div>
                    <span className="font-medium">Оклад:</span> {contract.salary.toString()} ₽ ({contract.salaryType})
                </div>
                {contract.terminationDate && (
                    <div>
                        <span className="font-medium">Расторгнут:</span>{' '}
                        {new Date(contract.terminationDate).toLocaleDateString('ru-RU')}
                    </div>
                )}
            </div>

            {/* Actions */}
            {contract.status === 'ACTIVE' && userRole === 'DIRECTOR' && (
                <div className="flex gap-2 pt-3 border-t">
                    <button
                        onClick={handleTerminate}
                        disabled={isLoading}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Расторжение...' : 'Расторгнуть договор'}
                    </button>
                </div>
            )}
        </div>
    );
};
