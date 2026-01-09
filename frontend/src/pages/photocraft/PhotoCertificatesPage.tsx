import React from 'react';
import {
    Award,
    CheckCircle,
    Lock,
    Download,
    Share2,
    Calendar,
    Star
} from 'lucide-react';

interface Certificate {
    id: string;
    title: string;
    date: string;
    grade: string;
    image: string;
    skills: string[];
}

interface Badge {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progress?: number;
}

const PhotoCertificatesPage: React.FC = () => {
    // Mock Data
    const certificates: Certificate[] = [
        {
            id: '1',
            title: 'Базовый курс фотографии',
            date: '15.10.2024',
            grade: 'Отлично',
            image: 'https://images.unsplash.com/photo-1589330694653-4a8b2436a223?auto=format&fit=crop&q=80&w=400',
            skills: ['Экспозиция', 'Композиция', 'Свет']
        },
        {
            id: '2',
            title: 'Работа со студийным светом',
            date: '20.11.2024',
            grade: 'Хорошо',
            image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=400',
            skills: ['Импульсный свет', 'Схемы света', 'Модификаторы']
        }
    ];

    const badges: Badge[] = [
        {
            id: '1',
            title: 'Первые шаги',
            description: 'Завершите первый урок',
            icon: '🚀',
            unlocked: true
        },
        {
            id: '2',
            title: 'Мастер света',
            description: 'Пройдите курс по свету на отлично',
            icon: '💡',
            unlocked: true
        },
        {
            id: '3',
            title: 'Гуру ретуши',
            description: 'Обработайте 100 фотографий',
            icon: '🎨',
            unlocked: false,
            progress: 65
        },
        {
            id: '4',
            title: 'Наставник',
            description: 'Обучите 3 стажёров',
            icon: '👨‍🏫',
            unlocked: false,
            progress: 0
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Мои достижения</h1>
                <p className="text-gray-500 mt-1">Сертификаты, бейджи и подтвержденные навыки</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Certificates Column */}
                <div className="lg:col-span-2 space-y-8">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <Award className="w-6 h-6 mr-2 text-indigo-600" />
                        Сертификаты
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {certificates.map(cert => (
                            <div key={cert.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="h-48 bg-gray-100 relative">
                                    <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                        <div className="text-white">
                                            <div className="text-xs font-medium opacity-80 mb-1">Выдан: {cert.date}</div>
                                            <h3 className="font-bold text-lg leading-tight">{cert.title}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center text-green-600 font-medium text-sm">
                                            <CheckCircle className="w-4 h-4 mr-1.5" />
                                            Подтвержден
                                        </div>
                                        <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold">
                                            {cert.grade}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {cert.skills.map(skill => (
                                            <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex space-x-2 pt-2 border-t border-gray-100">
                                        <button className="flex-1 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                            <Download className="w-4 h-4 mr-2" />
                                            Скачать PDF
                                        </button>
                                        <button className="flex items-center justify-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Placeholder for next certificate */}
                        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-8 text-center h-full min-h-[300px]">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                <Lock className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Следующая цель</h3>
                            <p className="text-gray-500 text-sm mb-4">Курс "Продвинутая ретушь"</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2 max-w-[200px]">
                                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                            <span className="text-xs text-gray-500">Прогресс: 45%</span>
                        </div>
                    </div>
                </div>

                {/* Badges Column */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <Star className="w-6 h-6 mr-2 text-yellow-500" />
                        Бейджи
                    </h2>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="space-y-6">
                            {badges.map(badge => (
                                <div key={badge.id} className={`flex items-start space-x-4 ${!badge.unlocked ? 'opacity-60 grayscale' : ''}`}>
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-gray-100">
                                        {badge.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900 text-sm">{badge.title}</h3>
                                            {badge.unlocked && <CheckCircle className="w-4 h-4 text-green-500" />}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{badge.description}</p>

                                        {!badge.unlocked && badge.progress !== undefined && (
                                            <div className="mt-2">
                                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                    <div
                                                        className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                                                        style={{ width: `${badge.progress}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-right text-[10px] text-gray-400 mt-1">{badge.progress}%</div>
                                            </div>
                                        )}
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

export default PhotoCertificatesPage;
