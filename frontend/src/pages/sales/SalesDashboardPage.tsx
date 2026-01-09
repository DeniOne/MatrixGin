import React from 'react';
import {
  TrendingUp,
  Users,
  Target,
  Award,
  BookOpen,
  MessageCircle,
  PlayCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SalesDashboardPage: React.FC = () => {
  // Mock Data
  const kpis = [
    { label: 'Конверсия', value: '24%', change: '+2.5%', trend: 'up', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Средний чек', value: '15 400 ₽', change: '+12%', trend: 'up', icon: Target, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'NPS', value: '9.2', change: '-0.1', trend: 'down', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Личный план', value: '85%', change: 'Осталось 3 дня', trend: 'neutral', icon: Award, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const activeCourses = [
    { id: 1, title: 'Психология влияния', progress: 75, total: 12, completed: 9, image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=100' },
    { id: 2, title: 'Работа с возражениями', progress: 30, total: 8, completed: 2, image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100' },
  ];

  const quickActions = [
    { title: 'Скрипты продаж', icon: BookOpen, path: '/sales/playbooks', color: 'bg-indigo-600' },
    { title: 'Тренировка диалога', icon: MessageCircle, path: '/sales/roleplay', color: 'bg-pink-600' },
    { title: 'Лидерборд', icon: Award, path: '/sales/leaderboard', color: 'bg-yellow-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sales Excellence Academy</h1>
        <p className="text-gray-500 mt-1">Дашборд эффективности и обучения</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <div className={`flex items-center text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : kpi.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                }`}>
                {kpi.trend === 'up' && <ArrowUpRight className="w-4 h-4 mr-1" />}
                {kpi.trend === 'down' && <ArrowDownRight className="w-4 h-4 mr-1" />}
                {kpi.change}
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{kpi.label}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.path}
                className={`${action.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex flex-col items-center text-center group`}
              >
                <div className="bg-white/20 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="font-bold">{action.title}</span>
              </Link>
            ))}
          </div>

          {/* Active Courses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Мое обучение</h2>
              <Link to="/sales/courses" className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center">
                Все курсы <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {activeCourses.map((course) => (
                <div key={course.id} className="p-6 flex items-center hover:bg-gray-50 transition-colors">
                  <img src={course.image} alt={course.title} className="w-16 h-16 rounded-lg object-cover mr-4" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{course.title}</h3>
                      <span className="text-sm text-gray-500">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {course.completed} из {course.total} уроков завершено
                    </p>
                  </div>
                  <Link
                    to={`/sales/course/${course.id}`}
                    className="ml-4 p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <PlayCircle className="w-8 h-8" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Daily Tip */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center mb-4">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold">Совет дня</h3>
            </div>
            <p className="text-purple-100 text-sm mb-4">
              "Используйте технику 'Именно поэтому', чтобы превратить возражение клиента в аргумент для покупки."
            </p>
            <button className="w-full bg-white text-purple-700 py-2 rounded-lg text-sm font-bold hover:bg-purple-50 transition-colors">
              Читать подробнее
            </button>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Ближайшие события</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-50 text-blue-700 rounded-lg p-2 text-center min-w-[50px] mr-3">
                  <span className="block text-xl font-bold">25</span>
                  <span className="text-xs uppercase font-bold">Ноя</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Мастер-класс по продажам</h4>
                  <p className="text-xs text-gray-500 mt-1">14:00 • Zoom</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-orange-50 text-orange-700 rounded-lg p-2 text-center min-w-[50px] mr-3">
                  <span className="block text-xl font-bold">28</span>
                  <span className="text-xs uppercase font-bold">Ноя</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Аттестация (Теория)</h4>
                  <p className="text-xs text-gray-500 mt-1">10:00 • Офис 304</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboardPage;
