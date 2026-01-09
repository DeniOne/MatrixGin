import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetCoursesQuery } from '../../features/university/api/universityApi';
import { CourseCard } from '../../features/university/components/CourseCard';
import { useAcademyId } from '../../features/university/hooks/useAcademyId';

const SalesCourseListPage: React.FC = () => {
  const { academyId, isLoading: loadingAcademy, error: academyError } = useAcademyId('sales');
  const [search, setSearch] = useState('');
  const params = useMemo(() => ({ academyId }), [academyId]);
  const { data, isLoading, error } = useGetCoursesQuery(academyId ? params : undefined);

  if (loadingAcademy) return <div className="text-white">Загрузка академии…</div>;
  if (academyError || !academyId) return <div className="text-red-400">Не удалось определить академию "Продажи и сервис".</div>;

  const courses = (data?.data || []).filter((c) =>
    search.trim() ? c.title.toLowerCase().includes(search.trim().toLowerCase()) : true
  );

  return (
    <div className="max-w-7xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Продажи и сервис — Курсы</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6">
        <label className="block text-sm text-gray-400 mb-1">Поиск</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Название курса…"
          className="w-full bg-gray-800 text-white rounded px-3 py-2 border border-gray-700"
        />
      </div>

      {isLoading ? (
        <div className="text-gray-300">Загрузка курсов…</div>
      ) : error ? (
        <div className="text-red-400">Ошибка загрузки курсов.</div>
      ) : courses.length === 0 ? (
        <div className="text-gray-400">Курсы не найдены.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link key={course.id} to={`/photocraft/course/${course.id}`}>
              <CourseCard course={course} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesCourseListPage;
