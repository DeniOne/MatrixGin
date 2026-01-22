import React from 'react';
import { PersonalFile } from '@prisma/client';
import { PersonalFileStatusBadge } from './PersonalFileStatusBadge';
import { useNavigate } from 'react-router-dom';

interface PersonalFileCardProps {
    file: PersonalFile;
    onStatusChange?: (newStatus: string) => void;
    onArchive?: () => void;
}

export const PersonalFileCard: React.FC<PersonalFileCardProps> = ({
    file,
    onStatusChange,
    onArchive
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/personnel/files/${file.id}`);
    };

    return (
        <div
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={handleClick}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {file.fileNumber}
                        </h3>
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

                <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                    {file.hrStatus === 'TERMINATED' && (
                        <button
                            onClick={onArchive}
                            className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                        >
                            Архивировать
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
