import React, { useState } from 'react';
import { useCreateOrderMutation } from '../../api/personnelApi';

interface OrderFormProps {
    personalFileId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
    personalFileId,
    onSuccess,
    onCancel
}) => {
    const [createOrder, { isLoading }] = useCreateOrderMutation();

    const [formData, setFormData] = useState({
        orderType: '',
        title: '',
        content: '',
        basis: '',
        orderDate: new Date().toISOString().split('T')[0],
        effectiveDate: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createOrder({
                personalFileId,
                ...formData,
            }).unwrap();

            onSuccess?.();
        } catch (error) {
            console.error('Failed to create order:', error);
            alert('Ошибка создания приказа');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тип приказа *
                </label>
                <select
                    value={formData.orderType}
                    onChange={(e) => setFormData({ ...formData, orderType: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Выберите тип</option>
                    <option value="HIRING">О приёме на работу</option>
                    <option value="DISMISSAL">Об увольнении</option>
                    <option value="TRANSFER">О переводе</option>
                    <option value="VACATION">О предоставлении отпуска</option>
                    <option value="PROMOTION">О повышении</option>
                    <option value="DISCIPLINARY">Дисциплинарное взыскание</option>
                    <option value="OTHER">Другое</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название приказа *
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Например: О приёме на работу Иванова И.И."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Содержание приказа *
                </label>
                <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={6}
                    placeholder="Полный текст приказа..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Основание *
                </label>
                <input
                    type="text"
                    value={formData.basis}
                    onChange={(e) => setFormData({ ...formData, basis: e.target.value })}
                    required
                    placeholder="Например: Трудовой договор №123 от 01.01.2024"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Дата приказа *
                    </label>
                    <input
                        type="date"
                        value={formData.orderDate}
                        onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Дата вступления в силу *
                    </label>
                    <input
                        type="date"
                        value={formData.effectiveDate}
                        onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                        required
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
                    {isLoading ? 'Создание...' : 'Создать приказ'}
                </button>
            </div>
        </form>
    );
};
