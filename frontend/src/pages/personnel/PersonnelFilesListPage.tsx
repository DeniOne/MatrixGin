import React, { useState } from 'react';
import { useGetPersonalFilesQuery } from '../../api/personnelApi';
import { PersonalFileCard } from '../../components/personnel';
import { HRStatus } from '@prisma/client';

export const PersonnelFilesListPage: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState<HRStatus | ''>('');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: files, isLoading, error } = useGetPersonalFilesQuery({
        status: statusFilter || undefined,
        search: searchQuery || undefined,
    });

    const handleArchive = async (fileId: string) => {
        const confirmed = window.confirm(
            'Вы уверены, что хотите архивировать личное дело?\n\n' +
            '⚠️ ВНИМАНИЕ:\n' +
            '- Документы будут переданы в архив (Module 29)\n' +
            '- Срок хранения: 75 лет (юридическое требование)\n' +
            '- Отменить архивирование невозможно'
        );

        if (confirmed) {
            // TODO: Implement archive API call
            console.log('Archive file:', fileId);
        }
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Поиск
                        </label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Номер дела или Employee ID"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Статус
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as HRStatus | '')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Все статусы</option>
                            <option value="ONBOARDING">На оформлении</option>
                            <option value="ACTIVE">Активен</option>
                            <option value="SUSPENDED">Приостановлен</option>
                            <option value="TERMINATED">Уволен</option>
                            <option value="ARCHIVED">Архивирован</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setStatusFilter('');
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Сбросить фильтры
                        </button>
                    </div>
                </div>
            </div>

            {/* Results */}
            {isLoading && (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Загрузка...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">Ошибка загрузки данных</p>
                </div>
            )}

            {files && files.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-600">Личные дела не найдены</p>
                </div>
            )}

            {files && files.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.map((file) => (
                        <PersonalFileCard
                            key={file.id}
                            file={file}
                            onArchive={() => handleArchive(file.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
