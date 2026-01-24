import { useState } from 'react';
import { useUpdateDepartmentMutation, useGetDepartmentsQuery } from '../api/ofsApi';
import { X, Building2, Save } from 'lucide-react';

interface Props {
  department: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditDepartmentModal({ department, onClose, onSuccess }: Props) {
  const [name, setName] = useState(department.name || '');
  const [description, setDescription] = useState(department.description || '');
  const [parentId, setParentId] = useState(department.parent_id || '');
  const [hierarchyLevel, setHierarchyLevel] = useState<number>(department.hierarchy_level || 4);
  const [departmentType, setDepartmentType] = useState(department.department_type || 'operational');
  const [functions, setFunctions] = useState(
    department.functions ? department.functions.join(', ') : ''
  );
  const [error, setError] = useState('');

  const { data: deptData } = useGetDepartmentsQuery({ format: 'flat' });
  const [updateDepartment, { isLoading }] = useUpdateDepartmentMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Название обязательно');
      return;
    }

    try {
      const functionsArray = functions.trim() 
        ? functions.split(',').map((f: string) => f.trim()).filter(Boolean)
        : undefined;

      await updateDepartment({
        id: department.id,
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
          parent_id: parentId || undefined,
          hierarchy_level: hierarchyLevel,
          department_type: departmentType,
          functions: functionsArray,
        },
      }).unwrap();
      
      onSuccess();
    } catch (err: any) {
      setError(err.data?.error?.message || 'Ошибка обновления департамента');
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-medium">Редактировать департамент</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#717182] hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Hierarchy Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Уровень иерархии
            </label>
            <select
              value={hierarchyLevel}
              onChange={(e) => setHierarchyLevel(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={1}>1 - Совет учредителей</option>
              <option value={2}>2 - Совет директоров</option>
              <option value={3}>3 - Цифровые сотрудники уровня управления (MatrixGin)</option>
              <option value={4}>4 - Департаменты</option>
              <option value={5}>5 - Отделы</option>
              <option value={6}>6 - Функции и Должности</option>
              <option value={7}>7 - Цифровые сотрудники операционного уровня</option>
            </select>
          </div>

          {/* Parent Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Родительский департамент
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Нет (корневой уровень)</option>
              {deptData?.data
                ?.filter(d => d.id !== department.id) // Exclude self
                ?.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Department Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип департамента
            </label>
            <select
              value={departmentType}
              onChange={(e) => setDepartmentType(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="operational">Операционный</option>
              <option value="support">Поддерживающий</option>
              <option value="management">Управленческий</option>
            </select>
          </div>

          {/* Functions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Функции (через запятую)
            </label>
            <textarea
              value={functions}
              onChange={(e) => setFunctions(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-[#030213] rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                'Сохранение...'
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Сохранить
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
