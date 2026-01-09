import { useGetHierarchyStructureQuery } from '../api/ofsApi';
import { Building2, Users } from 'lucide-react';

export default function HierarchyView() {
  const { data, isLoading } = useGetHierarchyStructureQuery();

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка...</div>;
  }

  const levels = data?.data || [];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">
        7-уровневая иерархия (из Конституции)
      </h2>

      {levels.map((level) => (
        <div key={level.level_number} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {level.level_number}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {level.level_name_ru}
                </h3>
                <p className="text-sm text-gray-600">{level.description}</p>
              </div>
            </div>
          </div>

          {level.departments && level.departments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {level.departments.map((dept: any) => (
                <div
                  key={dept.id}
                  className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-900">{dept.name}</span>
                  </div>
                  {dept.employee_count > 0 && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{dept.employee_count} сотрудников</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic mt-4">
              Пока нет подразделений на этом уровне
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
