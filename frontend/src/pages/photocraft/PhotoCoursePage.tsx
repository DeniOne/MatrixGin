import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  PlayCircle,
  FileText,
  CheckCircle,
  Lock,
  Download,
  Clock,
  Award,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import {
  useGetCourseByIdQuery,
  useEnrollInCourseMutation,
} from '../../features/university/api/universityApi';

const PhotoCoursePage: React.FC = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetCourseByIdQuery(id || '');
  // const [enroll, { isLoading: enrolling }] = useEnrollInCourseMutation();
  // const [complete, { isLoading: completing }] = useCompleteCourseMutation();
  const [enroll, { isLoading: enrolling }] = useEnrollInCourseMutation();
  const [activeTab, setActiveTab] = useState<'info' | 'files' | 'tests'>('info');

  // Mock Modules Data
  const modules = [
    {
      id: 1,
      title: 'Введение в студийную съемку',
      lessons: [
        { id: 101, title: 'Оборудование студии', duration: '15:00', type: 'video', isCompleted: true },
        { id: 102, title: 'Техника безопасности', duration: '10:00', type: 'video', isCompleted: true },
        { id: 103, title: 'Чек-лист подготовки', duration: '5:00', type: 'text', isCompleted: false },
      ]
    },
    {
      id: 2,
      title: 'Работа со светом',
      lessons: [
        { id: 201, title: 'Жесткий и мягкий свет', duration: '20:00', type: 'video', isLocked: true },
        { id: 202, title: 'Схемы света: Рембрандт', duration: '25:00', type: 'video', isLocked: true },
        { id: 203, title: 'Практическое задание', duration: '45:00', type: 'practice', isLocked: true },
      ]
    }
  ];

  const course = data?.data;

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error || !course) return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-center">
      <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        Курс не найден или произошла ошибка загрузки.
      </div>
      <div className="mt-4">
        <Link to="/photocraft/courses" className="text-blue-600 hover:underline">
          Вернуться в каталог
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs / Back Link */}
      <div className="mb-6">
        <Link to="/photocraft/courses" className="flex items-center text-[#717182] hover:text-gray-700 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Назад к курсам
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {/* Video Player Placeholder */}
          <div className="bg-white rounded-xl aspect-video flex items-center justify-center mb-6 relative overflow-hidden group shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <PlayCircle className="w-20 h-20 text-[#030213] opacity-80 group-hover:opacity-100 transition-all transform group-hover:scale-110 cursor-pointer" />
            <div className="absolute bottom-4 left-4 text-[#030213] opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="font-medium">1.1 Оборудование студии</p>
              <p className="text-sm text-gray-300">15:00</p>
            </div>
          </div>

          {/* Course Title & Actions */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-medium text-gray-900 mb-2">{course.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-[#717182]">
                {course.totalDuration && (
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {Math.round(course.totalDuration / 60)} ч.
                  </span>
                )}
                {course.modulesCount && (
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {course.modulesCount} модулей
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${course.isMandatory ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                  {course.isMandatory ? 'Обязательный' : 'Рекомендованный'}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => id && enroll({ courseId: id })}
                disabled={enrolling}
                className="bg-blue-600 hover:bg-blue-700 text-[#030213] px-6 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enrolling ? 'Запись...' : 'Начать обучение'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[300px]">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'info' ? 'border-blue-600 text-blue-600' : 'border-transparent text-[#717182] hover:text-gray-700'
                  }`}
              >
                О курсе
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'files' ? 'border-blue-600 text-blue-600' : 'border-transparent text-[#717182] hover:text-gray-700'
                  }`}
              >
                Материалы
              </button>
              <button
                onClick={() => setActiveTab('tests')}
                className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'tests' ? 'border-blue-600 text-blue-600' : 'border-transparent text-[#717182] hover:text-gray-700'
                  }`}
              >
                Тесты
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'info' && (
                <div className="prose max-w-none text-gray-600">
                  <p>{course.description || 'Описание курса отсутствует.'}</p>
                  <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Чему вы научитесь:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Работать с профессиональным студийным оборудованием</li>
                    <li>Выстраивать классические и креативные схемы света</li>
                    <li>Взаимодействовать с моделью на съемочной площадке</li>
                  </ul>
                </div>
              )}

              {activeTab === 'files' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-blue-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Презентация курса.pdf</p>
                        <p className="text-xs text-[#717182]">2.4 MB</p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-[#717182]" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-blue-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Схемы света (шпаргалка).jpg</p>
                        <p className="text-xs text-[#717182]">1.1 MB</p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-[#717182]" />
                  </div>
                </div>
              )}

              {activeTab === 'tests' && (
                <div className="text-center py-8">
                  <div className="bg-yellow-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="text-gray-900 font-medium mb-1">Тестирование недоступно</h3>
                  <p className="text-sm text-[#717182]">
                    Пройдите все уроки курса, чтобы получить доступ к финальному тесту.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Syllabus */}
        <div className="lg:col-span-1 space-y-6">
          {/* Rewards Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-[#030213] shadow-lg">
            <h3 className="font-medium mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Награда за курс
            </h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-indigo-100">MatrixCoins</span>
              <span className="font-medium text-xl">+{course.rewardMC}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-100">GMC</span>
              <span className="font-medium text-xl">+{course.rewardGMC}</span>
            </div>
          </div>

          {/* Syllabus */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-medium text-gray-900">Программа курса</h3>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
              <p className="text-xs text-[#717182] mt-1">Прогресс: 15%</p>
            </div>
            <div className="divide-y divide-gray-100">
              {modules.map(module => (
                <div key={module.id}>
                  <div className="px-4 py-3 bg-gray-50/50 font-medium text-sm text-gray-900">
                    {module.title}
                  </div>
                  <div>
                    {module.lessons.map(lesson => (
                      <div
                        key={lesson.id}
                        className={`px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer ${(lesson as any).isLocked ? 'opacity-60' : ''
                          }`}
                      >
                        <div className="flex items-center overflow-hidden">
                          {(lesson as any).isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          ) : (lesson as any).isLocked ? (
                            <Lock className="w-4 h-4 text-[#717182] mr-3 flex-shrink-0" />
                          ) : (
                            <PlayCircle className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                          )}
                          <div className="truncate">
                            <p className="text-sm text-gray-700 truncate">{lesson.title}</p>
                            <p className="text-[10px] text-[#717182]">{lesson.duration}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCoursePage;
