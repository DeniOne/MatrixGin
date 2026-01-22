import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetPersonalFileByIdQuery } from '../../api/personnelApi';
import { PersonalFileStatusBadge, DocumentUploader } from '../../components/personnel';

type TabType = 'documents' | 'orders' | 'contracts' | 'history';

export const PersonalFileDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<TabType>('documents');

    const { data: file, isLoading, error } = useGetPersonalFileByIdQuery(id!);

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Загрузка...</p>
            </div>
        );
    }

    if (error || !file) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">Личное дело не найдено</p>
            </div>
        );
    }

    const tabs: { id: TabType; label: string }[] = [
        { id: 'documents', label: 'Документы' },
        { id: 'orders', label: 'Приказы' },
        { id: 'contracts', label: 'Договоры' },
        { id: 'history', label: 'История' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-gray-900">{file.fileNumber}</h2>
                            <PersonalFileStatusBadge status={file.hrStatus} />
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                            <div>
                                <span className="font-medium">Employee ID:</span> {file.employeeId}
                            </div>
                            <div>
                                <span className="font-medium">Создано:</span>{' '}
                                {new Date(file.createdAt).toLocaleDateString('ru-RU')}
                            </div>
                            {file.closedAt && (
                                <div>
                                    <span className="font-medium">Закрыто:</span>{' '}
                                    {new Date(file.closedAt).toLocaleDateString('ru-RU')}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {file.hrStatus === 'TERMINATED' && (
                            <button
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                onClick={() => {
                                    // Archive confirmation handled in parent
                                    console.log('Archive file');
                                }}
                            >
                                Архивировать
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {activeTab === 'documents' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Документы</h3>
                        <DocumentUploader
                            personalFileId={file.id}
                            onUploadComplete={() => {
                                // Refetch documents
                                console.log('Document uploaded');
                            }}
                        />
                        {/* TODO: Add DocumentList component */}
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="text-center py-12 text-gray-500">
                        <p>Приказы (в разработке)</p>
                    </div>
                )}

                {activeTab === 'contracts' && (
                    <div className="text-center py-12 text-gray-500">
                        <p>Договоры (в разработке)</p>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="text-center py-12 text-gray-500">
                        <p>История изменений (в разработке)</p>
                    </div>
                )}
            </div>
        </div>
    );
};
