import React, { useState, useEffect } from 'react';
import { useGetAllStatusesQuery, useAssignStatusMutation } from '../../features/participation/participationApi';
import { message } from 'antd';

interface AssignStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    userName: string;
    onSuccess?: () => void;
}

export const AssignStatusModal: React.FC<AssignStatusModalProps> = ({
    isOpen,
    onClose,
    userId,
    userName,
    onSuccess
}) => {
    const { data: statuses = [], isLoading: fetchingStatuses } = useGetAllStatusesQuery(undefined, { skip: !isOpen });
    const [assignStatus, { isLoading: assigning }] = useAssignStatusMutation();

    const [selectedStatusCode, setSelectedStatusCode] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (isOpen && statuses.length > 0 && !selectedStatusCode) {
            setSelectedStatusCode(statuses[0].code);
        }
    }, [isOpen, statuses, selectedStatusCode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (reason.trim().length < 10) {
            message.error('Причина должна быть не менее 10 символов');
            return;
        }

        try {
            await assignStatus({
                userId,
                statusCode: selectedStatusCode,
                reason: reason.trim()
            }).unwrap();

            message.success(`Статус успешно назначен пользователю ${userName}`);
            if (onSuccess) onSuccess();
            onClose();
            setReason('');
        } catch (err: any) {
            const errorMessage = err.data?.error || 'Ошибка при назначении статуса';
            message.error(errorMessage);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                Назначить статус: {userName}
                            </h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Статус
                                </label>
                                {fetchingStatuses ? (
                                    <div className="animate-pulse h-10 bg-gray-100 rounded"></div>
                                ) : (
                                    <select
                                        value={selectedStatusCode}
                                        onChange={(e) => setSelectedStatusCode(e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                                        required
                                    >
                                        {statuses.map((status) => (
                                            <option key={status.code} value={status.code}>
                                                {status.code} - {status.description}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Причина изменения (мин. 10 символов)
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    rows={4}
                                    required
                                    placeholder="Опишите причину назначения данного статуса..."
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                disabled={assigning || fetchingStatuses || reason.trim().length < 10}
                                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${assigning || reason.trim().length < 10 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {assigning ? 'Назначение...' : 'Подтвердить'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
