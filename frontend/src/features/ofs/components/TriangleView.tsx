import { useGetTriangleStatsQuery } from '../api/ofsApi';
import { Camera, Palette, DollarSign } from 'lucide-react';

const TRIANGLE_CONFIG = {
  photographer: {
    label: 'Фотографы',
    icon: Camera,
    color: 'bg-blue-500',
    description: 'Создание первичной ценности',
  },
  designer: {
    label: 'Дизайнеры/Ретушеры',
    icon: Palette,
    color: 'bg-purple-500',
    description: 'Превращение в готовый продукт',
  },
  seller: {
    label: 'Продавцы',
    icon: DollarSign,
    color: 'bg-green-500',
    description: 'Реализация ценности',
  },
};

export default function TriangleView() {
  const { data, isLoading } = useGetTriangleStatsQuery();

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка...</div>;
  }

  const stats = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Треугольник Взаимозависимости
        </h2>
        <p className="text-gray-600 mt-1">
          3 ключевые роли: Фотографы → Дизайнеры → Продавцы
        </p>
      </div>

      {/* Triangle Visualization */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="max-w-3xl mx-auto">
          <svg viewBox="0 0 400 350" className="w-full">
            {/* Triangle */}
            <polygon
              points="200,50 350,300 50,300"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="2"
            />

            {/* Vertices */}
            {/* Top - Photographer */}
            <g>
              <circle cx="200" cy="50" r="40" fill="#3B82F6" />
              <foreignObject x="140" y="10" width="120" height="80">
                <div className="flex flex-col items-center justify-center h-full text-white text-center">
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-xs font-semibold">Фотографы</span>
                </div>
              </foreignObject>
            </g>

            {/* Bottom Left - Designer */}
            <g>
              <circle cx="50" cy="300" r="40" fill="#A855F7" />
              <foreignObject x="-10" y="260" width="120" height="80">
                <div className="flex flex-col items-center justify-center h-full text-white text-center">
                  <Palette className="w-6 h-6 mb-1" />
                  <span className="text-xs font-semibold">Дизайнеры</span>
                </div>
              </foreignObject>
            </g>

            {/* Bottom Right - Seller */}
            <g>
              <circle cx="350" cy="300" r="40" fill="#10B981" />
              <foreignObject x="290" y="260" width="120" height="80">
                <div className="flex flex-col items-center justify-center h-full text-white text-center">
                  <DollarSign className="w-6 h-6 mb-1" />
                  <span className="text-xs font-semibold">Продавцы</span>
                </div>
              </foreignObject>
            </g>
          </svg>

          <div className="text-center mt-6 text-sm text-gray-600">
            <p className="font-semibold">Эффективность = Скорость потока × Качество × (1 - Потери)</p>
            <p className="mt-2">Успех каждого напрямую влияет на результат других</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Статистика по ролям</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.by_role.map((role: any) => {
              const config = TRIANGLE_CONFIG[role.triangle_role as keyof typeof TRIANGLE_CONFIG];
              if (!config) return null;
              const Icon = config.icon;

              return (
                <div key={role.triangle_role} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-10 h-10 ${config.color} rounded-lg flex items-center justify-center text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{config.label}</h4>
                      <p className="text-xs text-gray-600">{config.description}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Всего:</span>
                      <span className="font-semibold">{role.total_employees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Основная роль:</span>
                      <span className="font-semibold">{role.primary_role_count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <span className="text-gray-600">Всего в треугольнике:</span>
            <span className="ml-2 text-xl font-bold text-gray-900">{stats.total_in_triangle}</span>
          </div>
        </div>
      )}
    </div>
  );
}
