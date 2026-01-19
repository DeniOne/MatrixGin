import React from 'react';
import { BookOpen, CheckCircle2, Clock } from 'lucide-react';

interface CourseProgress {
    id: string;
    courseTitle?: string;
    academyName?: string;
    progress: number; // 0-100
    status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
}

interface LearningWidgetProps {
    courses: CourseProgress[];
}

const LearningWidget: React.FC<LearningWidgetProps> = ({ courses }) => {
    const activeCourses = courses.filter(c => c.status === 'ACTIVE');

    return (
        <div className="bg-gray-900/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white/80">Обучение</h3>
                <BookOpen className="text-indigo-400 w-5 h-5" />
            </div>

            {activeCourses.length > 0 ? (
                <div className="space-y-6">
                    {activeCourses.slice(0, 3).map((course) => (
                        <div key={course.id} className="space-y-2">
                            <div className="flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                        {course.academyName}
                                    </span>
                                    <span className="text-sm text-white/90 font-medium">
                                        {course.courseTitle}
                                    </span>
                                </div>
                                <span className="text-xs text-indigo-400 font-bold">
                                    {course.progress}%
                                </span>
                            </div>

                            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-indigo-500 h-full transition-all duration-1000 ease-out"
                                    style={{ width: `${course.progress}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle2 className="text-gray-600 w-10 h-10 mb-3" />
                    <p className="text-sm text-gray-400">
                        Нет активных курсов.<br />Время выбрать новый навык!
                    </p>
                </div>
            )}

            {courses.length > 3 && (
                <button className="w-full mt-6 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors border-t border-white/5 pt-4">
                    Посмотреть все курсы
                </button>
            )}
        </div>
    );
};

export default LearningWidget;
