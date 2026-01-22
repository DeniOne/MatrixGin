import React from 'react';
import { PersonnelOrder } from '@prisma/client';
import { useSignOrderMutation, useCancelOrderMutation } from '../../api/personnelApi';

interface OrderCardProps {
    order: PersonnelOrder;
    userRole?: string;
    onUpdate?: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, userRole, onUpdate }) => {
    const [signOrder, { isLoading: isSigning }] = useSignOrderMutation();
    const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

    const handleSign = async () => {
        const confirmed = window.confirm(
            'Вы уверены, что хотите подписать приказ?\n\n' +
            '⚠️ ВНИМАНИЕ:\n' +
            '- Подписание приказа — юридически значимое действие\n' +
            '- Ваше имя и дата будут зафиксированы в audit log\n' +
            '- Отменить подписание невозможно'
        );

        if (!confirmed) return;

        try {
            await signOrder({
                id: order.id,
                body: { signature: 'DIRECTOR_SIGNATURE' }, // TODO: Real signature
            }).unwrap();

            onUpdate?.();
        } catch (error) {
            console.error('Failed to sign order:', error);
            alert('Ошибка подписания приказа');
        }
    };

    const handleCancel = async () => {
        const reason = window.prompt('Укажите причину отмены приказа:');
        if (!reason) return;

        try {
            await cancelOrder({
                id: order.id,
                reason,
            }).unwrap();

            onUpdate?.();
        } catch (error) {
            console.error('Failed to cancel order:', error);
            alert('Ошибка отмены приказа');
        }
    };

    const statusColors = {
        DRAFT: 'bg-gray-100 text-gray-700',
        SIGNED: 'bg-green-100 text-green-700',
        CANCELLED: 'bg-red-100 text-red-700',
    };

    const statusLabels = {
        DRAFT: 'Черновик',
        SIGNED: 'Подписан',
        CANCELLED: 'Отменён',
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                            {statusLabels[order.status]}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.title}</p>
                </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1 mb-4">
                <div>
                    <span className="font-medium">Тип:</span> {order.orderType}
                </div>
                <div>
                    <span className="font-medium">Дата приказа:</span>{' '}
                    {new Date(order.orderDate).toLocaleDateString('ru-RU')}
                </div>
                <div>
                    <span className="font-medium">Вступает в силу:</span>{' '}
                    {new Date(order.effectiveDate).toLocaleDateString('ru-RU')}
                </div>
                {order.signedAt && (
                    <div>
                        <span className="font-medium">Подписан:</span>{' '}
                        {new Date(order.signedAt).toLocaleDateString('ru-RU')}
                    </div>
                )}
            </div>

            {/* Actions */}
            {order.status === 'DRAFT' && (
                <div className="flex gap-2 pt-3 border-t">
                    {userRole === 'DIRECTOR' && (
                        <button
                            onClick={handleSign}
                            disabled={isSigning}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSigning ? 'Подписание...' : 'Подписать'}
                        </button>
                    )}
                    <button
                        onClick={handleCancel}
                        disabled={isCancelling}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        {isCancelling ? 'Отмена...' : 'Отменить приказ'}
                    </button>
                </div>
            )}
        </div>
    );
};
