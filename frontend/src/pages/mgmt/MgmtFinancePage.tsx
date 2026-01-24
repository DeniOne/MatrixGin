import React from 'react';
import { DollarSign, Calculator } from 'lucide-react';

const MgmtFinancePage: React.FC = () => {
    const courses = [
        {
            id: '1',
            title: 'Основы P&L для менеджеров',
            status: 'available',
            duration: '3 часа',
            lessons: 8
        },
        {
            id: '2',
            title: 'Бюджетирование и контроль расходов',
            status: 'in-progress',
            duration: '4 часа',
            lessons: 10,
            progress: 60
        },
        {
            id: '3',
            title: 'Финансовая грамотность лидера',
            status: 'completed',
            duration: '2 часа',
            lessons: 6
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-8">Финансы для Менеджеров</h1>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-gray-900 mb-1">Калькулятор бюджета обучения</h3>
                        <p className="text-sm text-gray-600">Рассчитайте ROI инвестиций в развитие команды</p>
                    </div>
                    <button className="p-3 bg-green-600 rounded-lg text-[#030213] hover:bg-green-700">
                        <Calculator className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {courses.map(course => (
                    <div key={course.id} className="bg-white p-6 rounded-xl border">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-1">{course.title}</h3>
                                <p className="text-sm text-[#717182]">{course.lessons} уроков • {course.duration}</p>
                            </div>
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        {course.status === 'in-progress' && course.progress && (
                            <div>
                                <div className="flex justify-between text-xs text-[#717182] mb-1">
                                    <span>Прогресс</span>
                                    <span>{course.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                </div>
                            </div>
                        )}
                        {course.status === 'completed' && (
                            <span className="text-xs text-green-600 font-medium">✓ Пройдено</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MgmtFinancePage;
