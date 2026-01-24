import { useState } from 'react';
import { useGetRegistrationsQuery, useApproveRegistrationMutation, useRejectRegistrationMutation } from '../api/registrationApi';
import { CheckCircle2, XCircle, UserPlus, Search, Filter, Eye } from 'lucide-react';
import RegistrationDetailModal from './RegistrationDetailModal';
import SendInvitationModal from './SendInvitationModal';

const STATUS_COLORS = {
  PENDING: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  REVIEW: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

const STATUS_LABELS = {
  PENDING: 'Ожидает',
  IN_PROGRESS: 'В процессе',
  REVIEW: 'На проверке',
  APPROVED: 'Одобрено',
  REJECTED: 'Отклонено',
};

export default function RegistrationList() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const { data, isLoading, refetch } = useGetRegistrationsQuery({
    status: statusFilter || undefined,
    page,
    limit: 20,
  });

  const [approve] = useApproveRegistrationMutation();
  const [reject] = useRejectRegistrationMutation();

  const handleApprove = async (id: string) => {
    if (confirm('Одобрить регистрацию?')) {
      await approve(id);
      refetch();
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Укажите причину отклонения:');
    if (reason) {
      await reject({ id, reason });
      refetch();
    }
  };

  const filteredData = data?.data?.filter((reg) =>
    searchQuery === '' ||
    reg.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-medium text-gray-900">Регистрация сотрудников</h2>
          <p className="text-sm text-gray-600 mt-1">
            Управление заявками на регистрацию через Telegram бот
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-[#030213] rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Отправить приглашение
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#717182]" />
            <input
              type="text"
              placeholder="Поиск по имени или email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#717182]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Все статусы</option>
              <option value="PENDING">Ожидает</option>
              <option value="IN_PROGRESS">В процессе</option>
              <option value="REVIEW">На проверке</option>
              <option value="APPROVED">Одобрено</option>
              <option value="REJECTED">Отклонено</option>
            </select>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-gray-600">Всего:</span>
              <span className="ml-2 font-medium">{data?.pagination.total || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-[#717182]">Загрузка...</div>
        ) : filteredData && filteredData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#717182] uppercase tracking-wider">
                    Кандидат
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#717182] uppercase tracking-wider">
                    Контакты
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#717182] uppercase tracking-wider">
                    Должность
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#717182] uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#717182] uppercase tracking-wider">
                    Шаг
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#717182] uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#717182] uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((registration) => (
                  <tr key={registration.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {registration.photo_url ? (
                          <img
                            src={registration.photo_url}
                            alt={`${registration.first_name} ${registration.last_name}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {registration.first_name[0]}{registration.last_name[0]}
                            </span>
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {registration.last_name} {registration.first_name}
                          </div>
                          {registration.middle_name && (
                            <div className="text-sm text-[#717182]">{registration.middle_name}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{registration.email}</div>
                      <div className="text-sm text-[#717182]">{registration.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{registration.position}</div>
                      {registration.department_name && (
                        <div className="text-sm text-[#717182]">{registration.department_name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${STATUS_COLORS[registration.status]}`}>
                        {STATUS_LABELS[registration.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#717182]">
                      {registration.current_step}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#717182]">
                      {new Date(registration.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedId(registration.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Подробности"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {registration.status === 'REVIEW' && (
                          <>
                            <button
                              onClick={() => handleApprove(registration.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Одобрить"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(registration.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Отклонить"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-[#717182]">
            Нет заявок на регистрацию
          </div>
        )}

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Страница {data.pagination.page} из {data.pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Назад
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Вперед
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedId && (
        <RegistrationDetailModal
          registrationId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}

      {showInviteModal && (
        <SendInvitationModal
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            setShowInviteModal(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
