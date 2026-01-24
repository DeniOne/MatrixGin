import { useState } from 'react';
import { useGetPyramidRolesQuery, useCreatePyramidRoleMutation } from '../api/ofsApi';
import { Crown, Camera, Cog, TrendingUp, Plus } from 'lucide-react';

const PYRAMID_ICONS = {
  management: Crown,
  photographers: Camera,
  production: Cog,
  sales: TrendingUp,
};

const PYRAMID_COLORS = {
  management: 'bg-purple-100 text-purple-800 border-purple-300',
  photographers: 'bg-blue-100 text-blue-800 border-blue-300',
  production: 'bg-green-100 text-green-800 border-green-300',
  sales: 'bg-orange-100 text-orange-800 border-orange-300',
};

export default function PyramidView() {
  const [showAddRole, setShowAddRole] = useState(false);
  const { data, isLoading, refetch } = useGetPyramidRolesQuery();

  if (isLoading) {
    return <div className="text-center py-8 text-[#717182]">Загрузка...</div>;
  }

  const roles = data?.data || [];
  const groupedRoles = roles.reduce((acc: any, role) => {
    if (!acc[role.role_type]) acc[role.role_type] = [];
    acc[role.role_type].push(role);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-medium text-gray-900">
            Пирамида Взаимозависимости
          </h2>
          <p className="text-gray-600 mt-1">
            4 вершины: Management, Photographers, Production, Sales
          </p>
        </div>
        <button
          onClick={() => setShowAddRole(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-[#030213] rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Добавить роль
        </button>
      </div>

      {/* Pyramid Visualization */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Management - Top */}
          <div className="flex justify-center">
            <div className={`w-64 p-4 rounded-lg border-2 text-center ${PYRAMID_COLORS.management}`}>
              <Crown className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-medium">Управление</h3>
              <p className="text-xs mt-1">Стратегия, ресурсы, синхронизация</p>
            </div>
          </div>

          {/* Three operational vertices */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className={`p-4 rounded-lg border-2 text-center ${PYRAMID_COLORS.photographers}`}>
              <Camera className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-medium">Фотографы</h3>
              <p className="text-xs mt-1">Первичная ценность</p>
            </div>

            <div className={`p-4 rounded-lg border-2 text-center ${PYRAMID_COLORS.production}`}>
              <Cog className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-medium">Производство</h3>
              <p className="text-xs mt-1">Готовый продукт</p>
            </div>

            <div className={`p-4 rounded-lg border-2 text-center ${PYRAMID_COLORS.sales}`}>
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-medium">Продажи</h3>
              <p className="text-xs mt-1">Реализация ценности</p>
            </div>
          </div>
        </div>
      </div>

      {/* Roles by Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(groupedRoles).map(([type, typeRoles]: [string, any]) => {
          const Icon = PYRAMID_ICONS[type as keyof typeof PYRAMID_ICONS];
          const colorClass = PYRAMID_COLORS[type as keyof typeof PYRAMID_COLORS];

          return (
            <div key={type} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${colorClass}`}>
                <Icon className="w-5 h-5" />
                <h3 className="font-medium capitalize">{type}</h3>
              </div>

              <div className="space-y-3">
                {typeRoles.map((role: any) => (
                  <div key={role.id} className="border border-gray-200 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900">{role.role_name}</h4>
                    {role.description && (
                      <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                    )}
                    {role.kpi_metrics && (
                      <div className="mt-2 text-xs text-[#717182]">
                        KPI: {Object.keys(role.kpi_metrics).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Role Form */}
      {showAddRole && (
        <AddPyramidRoleForm
          onClose={() => setShowAddRole(false)}
          onSuccess={() => {
            setShowAddRole(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}

// Add Role Form Component
function AddPyramidRoleForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [roleType, setRoleType] = useState<'management' | 'photographers' | 'production' | 'sales'>('photographers');
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [kpiMetrics, setKpiMetrics] = useState('');
  
  const [createRole, { isLoading }] = useCreatePyramidRoleMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const kpiObj = kpiMetrics.trim() 
        ? Object.fromEntries(
            kpiMetrics.split(',').map(m => {
              const [key, value] = m.trim().split(':');
              return [key?.trim() || '', value?.trim() || ''];
            }).filter(([k]) => k)
          )
        : undefined;

      await createRole({
        role_type: roleType,
        role_name: roleName,
        description: description || undefined,
        kpi_metrics: kpiObj,
      }).unwrap();
      onSuccess();
    } catch (err) {
      console.error('Create role error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <h3 className="font-medium text-gray-900">Добавить роль в пирамиду</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Вершина пирамиды</label>
        <select
          value={roleType}
          onChange={(e) => setRoleType(e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        >
          <option value="management">Management - Управление</option>
          <option value="photographers">Photographers - Фотографы</option>
          <option value="production">Production - Производство</option>
          <option value="sales">Sales - Продажи</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Название роли</label>
        <input
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">KPI метрики (через запятую, формат: key:value)</label>
        <input
          type="text"
          value={kpiMetrics}
          onChange={(e) => setKpiMetrics(e.target.value)}
          placeholder="shoots_per_day:15, conversion_rate:25%"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-[#030213] rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Создание...' : 'Создать'}
        </button>
      </div>
    </form>
  );
}
