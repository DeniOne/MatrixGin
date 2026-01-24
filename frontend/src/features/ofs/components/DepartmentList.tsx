import { useState } from 'react';
import { useGetDepartmentsQuery, useDeleteDepartmentMutation } from '../api/ofsApi';
import { Building2, Users, Plus, Edit2, Trash2 } from 'lucide-react';
import CreateDepartmentModal from './CreateDepartmentModal';
import EditDepartmentModal from './EditDepartmentModal';

export default function DepartmentList() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const { data, isLoading, refetch } = useGetDepartmentsQuery({ format: 'flat' });
  const [deleteDepartment] = useDeleteDepartmentMutation();

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Удалить департамент "${name}"?`)) {
      try {
        await deleteDepartment({ id, soft: true }).unwrap();
        refetch();
      } catch (err: any) {
        alert(err.data?.error?.message || 'Ошибка удаления департамента');
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-[#717182]">Загрузка...</div>;
  }

  const departments = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium text-gray-900">Департаменты</h2>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-[#030213] rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Добавить департамент
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            {/* Header with Actions */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-1">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">{dept.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                {(dept.employee_count ?? 0) > 0 && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 mr-2">
                    <Users className="w-4 h-4" />
                    <span>{dept.employee_count}</span>
                  </div>
                )}
                <button
                  onClick={() => setEditingDepartment(dept)}
                  className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Редактировать"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(dept.id, dept.name)}
                  className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {dept.description && (
              <p className="text-sm text-gray-600 mb-3">{dept.description}</p>
            )}

            {dept.functions && dept.functions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {dept.functions.map((func, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {func}
                  </span>
                ))}
              </div>
            )}

            {dept.department_type && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className={`text-xs px-2 py-1 rounded ${
                  dept.department_type === 'operational' ? 'bg-green-100 text-green-800' :
                  dept.department_type === 'support' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {dept.department_type}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Department Modal */}
      {showCreateModal && (
        <CreateDepartmentModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            refetch();
          }}
        />
      )}

      {/* Edit Department Modal */}
      {editingDepartment && (
        <EditDepartmentModal
          department={editingDepartment}
          onClose={() => setEditingDepartment(null)}
          onSuccess={() => {
            setEditingDepartment(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
