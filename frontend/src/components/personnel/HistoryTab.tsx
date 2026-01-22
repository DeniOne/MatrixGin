import React from 'react';

interface HistoryEvent {
    id: string;
    eventType: string;
    actorId: string;
    actorRole: string;
    timestamp: Date;
    payload?: {
        reason?: string;
        from?: string;
        to?: string;
    };
}

interface HistoryTabProps {
    personalFileId: string;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ personalFileId: _personalFileId }) => {
    // TODO: Fetch events from API
    const events: HistoryEvent[] = [];

    const eventTypeLabels: Record<string, string> = {
        EMPLOYEE_HIRED: 'Сотрудник принят',
        EMPLOYEE_DISMISSED: 'Сотрудник уволен',
        EMPLOYEE_TRANSFERRED: 'Изменение статуса',
        FILE_ARCHIVED: 'Дело архивировано',
        ORDER_SIGNED: 'Приказ подписан',
        CONTRACT_TERMINATED: 'Договор расторгнут',
    };

    if (events.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p>История событий пуста</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">История изменений</h3>

            <div className="space-y-3">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h4 className="font-medium text-gray-900">
                                    {eventTypeLabels[event.eventType] || event.eventType}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {new Date(event.timestamp).toLocaleString('ru-RU')}
                                </p>
                            </div>
                            <div className="text-right text-sm text-gray-600">
                                <div>
                                    <span className="font-medium">Актор:</span> {event.actorId}
                                </div>
                                <div>
                                    <span className="font-medium">Роль:</span> {event.actorRole}
                                </div>
                            </div>
                        </div>

                        {event.payload?.reason && (
                            <div className="mt-2 text-sm text-gray-700">
                                <span className="font-medium">Причина:</span> {event.payload.reason}
                            </div>
                        )}

                        {event.payload?.from && event.payload?.to && (
                            <div className="mt-2 text-sm text-gray-700">
                                <span className="font-medium">Изменение:</span>{' '}
                                {event.payload.from} → {event.payload.to}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
