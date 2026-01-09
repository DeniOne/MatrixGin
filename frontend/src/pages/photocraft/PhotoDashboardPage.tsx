import React from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Calendar,
  Award,
  Bell,
  ChevronRight,
  PlayCircle,
  Clock
} from 'lucide-react';
import { BadgeCard } from '../../features/university/components/BadgeCard';

const PhotoDashboardPage: React.FC = () => {
  // Mock data
  const progress = {
    currentLevel: 'Фотограф 2-й категории',
    nextLevel: 'Фотограф 1-й категории',
    percent: 65,
    xp: 1250,
    nextLevelXp: 2000
  };

  const notifications = [
    { id: 1, title: 'Новая смена', message: 'Вам назначена практическая смена на 25.11', time: '2 ч. назад', type: 'info' },
    { id: 2, title: 'Проверка задания', message: 'Наставник проверил ваше задание по "Свету"', time: '5 ч. назад', type: 'success' },
    { id: 3, title: 'Вебинар', message: 'Не пропустите вебинар по ретуши завтра в 19:00', time: '1 д. назад', type: 'warning' },
  ];

  const activeCourses = [
    { id: 101, title: 'Основы студийного света', progress: 45, nextLesson: 'Схемы света High Key' },
    { id: 102, title: 'Работа с детьми', progress: 10, nextLesson: 'Психология возраста 3-5 лет' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Camera className="w-8 h-8 mr-3 text-blue-600" />
          Факультет Фотомастерства
        </h1>
        <p className="mt-2 text-gray-600">
          Развивайте свои навыки фотографии, проходите практику и повышайте категорию.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Progress Widget */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Ваш прогресс</h2>
                  <p className="text-sm text-blue-600 font-medium">{progress.currentLevel}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">{progress.percent}%</span>
                  <p className="text-xs text-gray-500">до следующего уровня</p>
                </div>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress.percent}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>{progress.xp} XP</span>
                <span>{progress.nextLevelXp} XP ({progress.nextLevel})</span>
              </div>
            </div>
          </div>

          {/* Active Courses */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Активные курсы</h2>
              <Link to="/photocraft/courses" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Все курсы &rarr;
              </Link>
            </div>
            <div className="space-y-4">
              {activeCourses.map(course => (
                <div key={course.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <span className="text-sm font-medium text-blue-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <PlayCircle className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Далее: {course.nextLesson}</span>
                    <Link
                      to={`/photocraft/course/${course.id}`}
                      className="ml-auto text-blue-600 hover:underline text-sm"
                    >
                      Продолжить
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Последние достижения</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <BadgeCard
                title="Мастер света"
                description="За прохождение курса по студийному свету"
                earnedAt="2023-11-20"
              />
              <BadgeCard
                title="Первая смена"
                description="Успешное завершение первой самостоятельной смены"
                earnedAt="2023-11-15"
              />
              <BadgeCard
                title="Гуру ретуши"
                description="Сдайте экзамен по Photoshop"
                isLocked={true}
              />
              <BadgeCard
                title="Наставник"
                description="Получите статус наставника"
                isLocked={true}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-4">Быстрые действия</h3>
            <div className="space-y-3">
              <Link to="/photocraft/shifts" className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Calendar className="w-5 h-5 mr-3 text-blue-300" />
                <span>Записаться на смену</span>
              </Link>
              <Link to="/photocraft/trainers" className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Award className="w-5 h-5 mr-3 text-purple-300" />
                <span>Найти наставника</span>
              </Link>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Уведомления
              </h3>
              <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5 rounded-full">3</span>
            </div>
            <div className="space-y-4">
              {notifications.map(notif => (
                <div key={notif.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className={`w-2 h-2 mt-1.5 rounded-full mr-3 flex-shrink-0 ${notif.type === 'info' ? 'bg-blue-500' :
                      notif.type === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                    <p className="text-xs text-gray-500 mb-1">{notif.message}</p>
                    <div className="flex items-center text-[10px] text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {notif.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-center text-sm text-gray-500 hover:text-gray-700">
              Показать все
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDashboardPage;
