import React, { useState } from 'react';
import { useCreateContractMutation } from '../../api/personnelApi';

interface ContractFormProps {
    personalFileId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const ContractForm: React.FC<ContractFormProps> = ({
    personalFileId,
    onSuccess,
    onCancel
}) => {
    const [createContract, { isLoading }] = useCreateContractMutation();

    const [formData, setFormData] = useState({
        contractType: '',
        contractDate: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        positionId: '',
        departmentId: '',
        salary: '',
        salaryType: 'MONTHLY',
        workSchedule: '',
        probationDays: '0',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createContract({
                personalFileId,
                ...formData,
                salary: parseFloat(formData.salary),
                probationDays: parseInt(formData.probationDays),
                endDate: formData.endDate || undefined,
            }).unwrap();

            onSuccess?.();
        } catch (error) {
            console.error('Failed to create contract:', error);
            alert('Ошибка создания договора');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Тип договора *
                    </label>
                    <select
                        value={formData.contractType}
                        onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Выберите тип</option>
                        <option value="PERMANENT">Бессрочный</option>
                        <option value="FIXED_TERM">Срочный</option>
                        <option value="PART_TIME">Совместительство</option>
                        <option value="CIVIL">ГПХ</option>
                        <option value="INTERNSHIP">Стажировка</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Дата договора *
                    </label>
                    <input
                        type="date"
                        value={formData.contractDate}
                        onChange={(e) => setFormData({ ...formData, contractDate: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Дата начала работы *
                    </label>
                    <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Дата окончания (для срочных)
                    </label>
                    <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Должность ID *
                    </label>
                    <input
                        type="text"
                        value={formData.positionId}
                        onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                        required
                        placeholder="pos-123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Департамент ID *
                    </label>
                    <input
                        type="text"
                        value={formData.departmentId}
                        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                        required
                        placeholder="dept-123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Оклад *
                    </label>
                    <input
                        type="number"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        required
                        min="0"
                        step="0.01"
                        placeholder="100000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Тип оплаты *
                    </label>
                    <select
                        value={formData.salaryType}
                        onChange={(e) => setFormData({ ...formData, salaryType: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="MONTHLY">Месячный</option>
                        <option value="HOURLY">Почасовой</option>
                        <option value="PIECEWORK">Сдельный</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        График работы *
                    </label>
                    <input
                        type="text"
                        value={formData.workSchedule}
                        onChange={(e) => setFormData({ ...formData, workSchedule: e.target.value })}
                        required
                        placeholder="5/2, 8 часов"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Испытательный срок (дней)
                    </label>
                    <input
                        type="number"
                        value={formData.probationDays}
                        onChange={(e) => setFormData({ ...formData, probationDays: e.target.value })}
                        min="0"
                        max="90"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Отмена
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {isLoading ? 'Создание...' : 'Создать договор'}
                </button>
            </div>
        </form>
    );
};
