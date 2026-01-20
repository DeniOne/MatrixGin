import React, { useState } from 'react';
import { useGetUsersWithStatusesQuery } from '../../features/participation/participationApi';
import { StatusBadge } from '../../components/status/StatusBadge';
import { AssignStatusModal } from '../../components/status/AssignStatusModal';

interface UserListItem {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    currentStatus: {
        code: string;
        description: string;
        assignedAt: string;
    } | null;
}

const StatusManagement: React.FC = () => {
    const { data: users = [], isLoading: loading, refetch } = useGetUsersWithStatusesQuery();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAssignClick = (user: UserListItem) => {
        setSelectedUser({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`
        });
        setIsModalOpen(true);
    };

    const filteredUsers = users.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.currentStatus?.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Управление статусами участия</h1>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Поиск пользователей..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-64"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пользователь</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Текущий статус</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Назначен</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">Загрузка данных...</td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">Пользователи не найдены</td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.currentStatus ? (
                                            <StatusBadge
                                                code={user.currentStatus.code}
                                                description={user.currentStatus.description}
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Не назначен</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.currentStatus
                                            ? new Date(user.currentStatus.assignedAt).toLocaleDateString('ru-RU')
                                            : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleAssignClick(user)}
                                            className="text-blue-600 hover:text-blue-900 font-semibold"
                                        >
                                            Назначить статус
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedUser && (
                <AssignStatusModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    userId={selectedUser.id}
                    userName={selectedUser.name}
                    onSuccess={refetch}
                />
            )}
        </div>
    );
};

export default StatusManagement;
