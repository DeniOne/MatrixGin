import React from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';

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
        <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-[#030213]">Обучение</h3>
                <BookOpen className="text-indigo-600 w-5 h-5" />
            </div>

            {activeCourses.length > 0 ? (
                <div className="space-y-6">
                    {activeCourses.slice(0, 3).map((course) => (
                        <div key={course.id} className="space-y-2">
                            <div className="flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-xs text-[#717182] font-medium uppercase tracking-wider">
                                        {course.academyName}
                                    </span>
                                    <span className="text-sm text-[#030213] font-medium">
                                        {course.courseTitle}
                                    </span>
                                </div>
                                <span className="text-xs text-indigo-600 font-medium">
                                    {course.progress}%
                                </span>
                            </div>

                            <div className="w-full bg-[#F3F3F5] rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-indigo-600 h-full transition-all duration-1000 ease-out"
                                    style={{ width: `${course.progress}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle2 className="text-[#717182] w-10 h-10 mb-3" />
                    <p className="text-sm text-[#717182]">
                        Нет активных курсов.<br />Время выбрать новый навык!
                    </p>
                </div>
            )}

            {courses.length > 3 && (
                <button className="w-full mt-6 py-2 text-xs font-medium text-[#717182] hover:text-[#030213] transition-colors border-t border-black/5 pt-4">
                    Посмотреть все курсы
                </button>
            )}
        </div>
    );
};

export default LearningWidget;
