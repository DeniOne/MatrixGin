import React from 'react';
import { useGetTrainersQuery } from '../../features/university/api/universityApi';

const PhotoTrainerDirectoryPage: React.FC = () => {
  const { data, isLoading, error } = useGetTrainersQuery({ specialty: 'PHOTOGRAPHER' });

  if (isLoading) return <div className="text-white">Загрузка наставников…</div>;
  if (error) return <div className="text-red-400">Ошибка загрузки наставников.</div>;

  const trainers = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Наставники — Фотомастерство</h1>

      {trainers.length === 0 ? (
        <div className="text-gray-400">Пока нет наставников.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((t) => (
            <div key={t.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{t.userName || t.id}</div>
                <div className="text-xs px-2 py-1 rounded bg-gray-800 border border-gray-700">{t.status}</div>
              </div>
              <div className="text-sm text-gray-300">
                Специализация: Фотограф<br />
                Рейтинг: {t.rating ?? '—'} • NPS: {t.statistics.avgNPS ?? '—'}
              </div>
              <div className="mt-3 text-sm text-gray-400">
                Стажёров: {t.statistics.traineesTotal} • Успешных: {t.statistics.traineesSuccessful}
              </div>
              <div className="mt-4 flex gap-2">
                <button className="bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded">Назначить стажёра</button>
                <button className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded border border-gray-700">Профиль</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoTrainerDirectoryPage;
