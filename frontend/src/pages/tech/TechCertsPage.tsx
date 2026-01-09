import React from 'react';
import { Award, CheckCircle, Lock } from 'lucide-react';

const TechCertsPage: React.FC = () => {
    const certs = [
        { id: '1', title: 'Сертификат работы с Canon EOS R5', status: 'earned', date: '15.10.2024', level: 'advanced' },
        { id: '2', title: 'Базовая сертификация Lightroom', status: 'in-progress', progress: 75, level: 'basic' },
        { id: '3', title: 'Экспертная работа с освещением', status: 'locked', level: 'expert' }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Сертификация</h1>

            <div className="space-y-4">
                {certs.map(cert => (
                    <div key={cert.id} className="bg-white rounded-xl border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div className={`p-3 rounded-lg mr-4 ${cert.status === 'earned' ? 'bg-green-100' :
                                        cert.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'
                                    }`}>
                                    {cert.status === 'earned' ? <Award className="w-6 h-6 text-green-600" /> :
                                        cert.status === 'locked' ? <Lock className="w-6 h-6 text-gray-400" /> :
                                            <Award className="w-6 h-6 text-blue-600" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{cert.title}</h3>
                                    <p className="text-xs text-gray-500">
                                        {cert.level === 'basic' ? 'Базовый' : cert.level === 'advanced' ? 'Продвинутый' : 'Экспертный'} уровень
                                    </p>
                                </div>
                            </div>
                            {cert.status === 'earned' && (
                                <span className="text-xs text-green-600 font-medium flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-1" /> Получен {cert.date}
                                </span>
                            )}
                        </div>

                        {cert.status === 'in-progress' && cert.progress && (
                            <div>
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Прогресс</span>
                                    <span>{cert.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${cert.progress}%` }}></div>
                                </div>
                                <button className="mt-3 w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                                    Продолжить обучение
                                </button>
                            </div>
                        )}

                        {cert.status === 'locked' && (
                            <p className="text-sm text-gray-500">Требуется завершить предыдущие сертификации</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TechCertsPage;
