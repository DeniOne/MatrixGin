import React, { useMemo, useState } from 'react';
import { Search, Camera } from 'lucide-react';
import { useGetCoursesQuery } from '../../features/university/api/universityApi';
import { CourseCard } from '../../features/university/components/CourseCard';
import { FilterPanel } from '../../features/university/components/FilterPanel';
import { useAcademyId } from '../../features/university/hooks/useAcademyId';

const PhotoCourseListPage: React.FC = () => {
  const { academyId, isLoading: loadingAcademy, error: academyError } = useAcademyId('photocraft');
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    grade: [],
    mandatory: []
  });

  // Convert filters for API
  const params = useMemo(
    () => ({
      academyId,
      requiredGrade: activeFilters.grade[0], // API supports single value for now
      isMandatory: activeFilters.mandatory.includes('yes') ? true : activeFilters.mandatory.includes('no') ? false : undefined,
    }),
    [academyId, activeFilters]
  );

  const { data, isLoading, error } = useGetCoursesQuery(academyId ? params : undefined);

  const handleFilterChange = (groupId: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[groupId] || [];
      // Toggle logic for single select behavior on grade, or multi if needed. 
      // For now, let's keep it simple: if clicked, set as only value (radio behavior) for grade
      if (groupId === 'grade' || groupId === 'mandatory') {
        return { ...prev, [groupId]: current.includes(value) ? [] : [value] };
      }
      return prev;
    });
  };

  const clearFilters = () => {
    setActiveFilters({ grade: [], mandatory: [] });
    setSearch('');
  };

  const filterConfig = [
    {
      id: 'grade',
      label: 'Уровень квалификации',
      options: [
        { value: 'INTERN', label: 'Стажёр' },
        { value: 'SPECIALIST', label: 'Специалист' },
        { value: 'PROFESSIONAL', label: 'Профессионал' },
        { value: 'EXPERT', label: 'Эксперт' },
        { value: 'MASTER', label: 'Мастер' },
      ]
    },
    {
      id: 'mandatory',
      label: 'Тип курса',
      options: [
        { value: 'yes', label: 'Обязательные' },
        { value: 'no', label: 'Рекомендованные' },
      ]
    }
  ];

  if (loadingAcademy) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (academyError || !academyId) return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-center">
      <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
        Не удалось загрузить данные факультета. Пожалуйста, попробуйте позже.
      </div>
    </div>
  );

  const courses = (data?.data || []).filter((c) =>
    search.trim() ? c.title.toLowerCase().includes(search.trim().toLowerCase()) : true
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-medium text-gray-900 flex items-center mb-2">
            <Camera className="w-8 h-8 mr-3 text-blue-600" />
            Каталог курсов
          </h1>
          <p className="text-gray-600">
            Обучающие материалы для развития навыков фотографии и ретуши
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск курса..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#717182]" />
          </div>

          <FilterPanel
            filters={filterConfig}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Course Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse h-64">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-red-500">Ошибка при загрузке курсов</p>
              <button onClick={() => window.location.reload()} className="mt-4 text-blue-600 hover:underline">
                Попробовать снова
              </button>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-[#717182] text-lg">Курсы не найдены</p>
              <p className="text-[#717182] text-sm mt-2">Попробуйте изменить параметры поиска</p>
              <button onClick={clearFilters} className="mt-4 text-blue-600 hover:underline">
                Сбросить все фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  baseUrl="/photocraft/course"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoCourseListPage;

