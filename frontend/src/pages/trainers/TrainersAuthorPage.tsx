import React from 'react';
import { Plus, FileText, Sparkles } from 'lucide-react';

const TrainersAuthorPage: React.FC = () => {
    const courses = [
        { id: '1', title: 'Основы портретной съёмки', status: 'published', modules: 8, students: 45 },
        { id: '2', title: 'Работа со светом', status: 'draft', modules: 5, students: 0 }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Конструктор Курсов</h1>
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Создать курс
                </button>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-8 border border-purple-200">
                <div className="flex items-center">
                    <Sparkles className="w-8 h-8 text-purple-600 mr-4" />
                    <div>
                        <h3 className="font-bold text-gray-900 mb-1">AI Помощник</h3>
                        <p className="text-sm text-gray-600">Генерируйте контент курса с помощью ИИ</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {courses.map(course => (
                    <div key={course.id} className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{course.title}</h3>
                                <p className="text-sm text-gray-500">{course.modules} модулей • {course.students} учеников</p>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded ${course.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {course.status === 'published' ? 'Опубликован' : 'Черновик'}
                            </span>
                        </div>
                        <div className="flex space-x-2">
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center">
                                <FileText className="w-4 h-4 mr-2" />
                                Редактировать
                            </button>
                            {course.status === 'draft' && (
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                                    Опубликовать
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrainersAuthorPage;
