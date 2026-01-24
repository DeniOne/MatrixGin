import React from 'react';
import {
    BookOpen,
    Target,
    Zap,
    Calendar,
    Award,
    TrendingUp,
    Play,
    Clock,
    Star,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SoftDashboardPage: React.FC = () => {
    const navigate = useNavigate();

    // Mock Data
    const activeCourses = [
        {
            id: '1',
            title: 'Эмоциональный интеллект в переговорах',
            progress: 65,
            totalLessons: 12,
            completedLessons: 8,
            image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
            nextLesson: 'Управление гневом клиента'
        },
        {
            id: '2',
            title: 'Тайм-менеджмент для лидеров',
            progress: 30,
            totalLessons: 10,
            completedLessons: 3,
            image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=400',
            nextLesson: 'Матрица Эйзенхауэра'
        }
    ];

    const recommendations = [
        {
            id: '3',
            title: 'Искусство обратной связи',
            duration: '2ч 15мин',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
            tags: ['Коммуникация', 'Management']
        },
        {
            id: '4',
            title: 'Публичные выступления',
            duration: '4ч 30мин',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1475721027767-4d063a3db548?auto=format&fit=crop&q=80&w=400',
            tags: ['Soft Skills', 'Presentation']
        },
        {
            id: '5',
            title: 'Критическое мышление',
            duration: '3ч 45мин',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80&w=400',
            tags: ['Thinking', 'Analysis']
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-gray-900">Soft Skills & Развитие</h1>
                    <p className="text-[#717182] mt-1">Развивайте навыки, которые помогут вам расти профессионально и лично</p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                    <button
                        onClick={() => navigate('/personal/plan')}
                        className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <Target className="w-4 h-4 mr-2 text-indigo-500" />
                        Мой план развития
                    </button>
                    <button
                        onClick={() => navigate('/personal/coaching')}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-[#030213] rounded-lg text-sm font-medium hover:bg-indigo-700"
                    >
                        <Calendar className="w-4 h-4 mr-2" />
                        Записаться к коучу
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-[#030213] shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Zap className="w-6 h-6 text-[#030213]" />
                        </div>
                        <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">Уровень 5</span>
                    </div>
                    <div className="mb-1">
                        <span className="text-3xl font-medium">1,250</span>
                        <span className="text-sm opacity-80 ml-2">XP</span>
                    </div>
                    <p className="text-sm opacity-90">До следующего уровня 250 XP</p>
                    <div className="w-full bg-white/20 rounded-full h-1.5 mt-3">
                        <div className="bg-white h-1.5 rounded-full" style={{ width: '83%' }}></div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/personal/practices')}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+2 дня</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Стрик практики</h3>
                    <p className="text-sm text-[#717182]">Вы выполняете задания 5 дней подряд! Так держать!</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/personal/badges')}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-yellow-50 rounded-lg">
                            <Award className="w-6 h-6 text-yellow-600" />
                        </div>
                        <span className="text-xs font-medium text-[#717182]">Всего 12</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Мои достижения</h3>
                    <p className="text-sm text-[#717182]">Последнее: "Мастер эмпатии"</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/personal/library')}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-xs font-medium text-[#717182]">Новое</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Библиотека</h3>
                    <p className="text-sm text-[#717182]">Добавлено 3 новые книги по лидерству</p>
                </div>
            </div>

            {/* Active Learning */}
            <div className="mb-10">
                <h2 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
                    <Play className="w-5 h-5 mr-2 text-indigo-600" />
                    Продолжить обучение
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeCourses.map(course => (
                        <div key={course.id} className="bg-white rounded-xl border border-gray-200 p-4 flex space-x-4 hover:shadow-md transition-shadow">
                            <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900 line-clamp-1">{course.title}</h3>
                                    <p className="text-sm text-[#717182] mt-1">Следующий урок: {course.nextLesson}</p>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs text-[#717182] mb-1">
                                        <span>Прогресс</span>
                                        <span>{course.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <button className="self-center p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors">
                                <Play className="w-5 h-5 fill-current" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommendations */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium text-gray-900 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-yellow-500" />
                        Рекомендуем вам
                    </h2>
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                        Весь каталог <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendations.map(course => (
                        <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
                            <div className="h-48 bg-gray-100 relative overflow-hidden">
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium flex items-center shadow-sm">
                                    <Star className="w-3 h-3 text-yellow-500 mr-1 fill-current" />
                                    {course.rating}
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {course.tags.map(tag => (
                                        <span key={tag} className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 h-12">{course.title}</h3>
                                <div className="flex items-center text-sm text-[#717182] mb-4">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {course.duration}
                                </div>
                                <button className="w-full py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all">
                                    Подробнее
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SoftDashboardPage;
