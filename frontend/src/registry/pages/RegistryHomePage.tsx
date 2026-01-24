import React from 'react';
import { Database, Shield, Users, Layers, Zap, Hexagon } from 'lucide-react';
import { UI_TEXT } from '../config/registryLabels.ru';

const RegistryHomePage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 animate-in fade-in duration-500">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-2xl mb-6">
                    <Database className="w-12 h-12 text-indigo-600" />
                </div>
                <h1 className="text-4xl font-medium text-[#030213] mb-4 tracking-tight">{UI_TEXT.DASHBOARD_HEADING}</h1>
                <p className="text-[#717182] max-w-lg mx-auto leading-relaxed">
                    {UI_TEXT.DASHBOARD_DESC}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: Shield, title: 'Безопасность', desc: 'Роли, Права, Политики', color: 'text-red-500', bg: 'bg-red-50' },
                    { icon: Users, title: 'Человеческий капитал', desc: 'Персоны, Сотрудники, Акторы', color: 'text-orange-500', bg: 'bg-orange-50' },
                    { icon: Layers, title: 'Структура', desc: 'Организации, Подразделения', color: 'text-blue-500', bg: 'bg-blue-50' },
                    { icon: Zap, title: 'Функциональный домен', desc: 'Функции, Группы', color: 'text-yellow-500', bg: 'bg-yellow-50' },
                    { icon: Hexagon, title: 'Ценность (ЦКП)', desc: 'Продукты, Владельцы', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { icon: Database, title: 'Системное ядро', desc: 'Токены, Задачи, Процессы', color: 'text-purple-500', bg: 'bg-purple-50' },
                ].map((card, idx) => (
                    <div key={idx} className="p-6 rounded-2xl border border-black/10 bg-white hover:shadow-md transition-all group cursor-pointer">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg} mb-4 group-hover:scale-110 transition-transform`}>
                            <card.icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                        <h3 className="text-lg font-medium text-[#030213] mb-2">{card.title}</h3>
                        <p className="text-sm text-[#717182]">{card.desc}</p>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-4 rounded-xl bg-[#F3F3F5] border border-black/5 text-center">
                <p className="text-xs font-mono text-[#717182]">
                    SECURE ENVIRONMENT • ACTION LOGGED • V1.0.0
                </p>
            </div>
        </div>
    );
};

export default RegistryHomePage;
