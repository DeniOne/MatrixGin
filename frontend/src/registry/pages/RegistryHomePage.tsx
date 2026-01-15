import React from 'react';
import { Database, Shield, Users, Layers, Zap, Hexagon } from 'lucide-react';
import { UI_TEXT } from '../config/registryLabels.ru';

const RegistryHomePage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-4 bg-indigo-900/30 rounded-2xl mb-6">
                    <Database className="w-12 h-12 text-indigo-400" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">{UI_TEXT.DASHBOARD_HEADING}</h1>
                <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
                    {UI_TEXT.DASHBOARD_DESC}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: Shield, title: 'Безопасность', desc: 'Роли, Права, Политики', color: 'text-red-400', bg: 'bg-red-900/10' },
                    { icon: Users, title: 'Человеческий капитал', desc: 'Персоны, Сотрудники, Акторы', color: 'text-orange-400', bg: 'bg-orange-900/10' },
                    { icon: Layers, title: 'Структура', desc: 'Организации, Подразделения', color: 'text-blue-400', bg: 'bg-blue-900/10' },
                    { icon: Zap, title: 'Функциональный домен', desc: 'Функции, Группы', color: 'text-yellow-400', bg: 'bg-yellow-900/10' },
                    { icon: Hexagon, title: 'Ценность (ЦКП)', desc: 'Продукты, Владельцы', color: 'text-emerald-400', bg: 'bg-emerald-900/10' },
                    { icon: Database, title: 'Системное ядро', desc: 'Токены, Задачи, Процессы', color: 'text-purple-400', bg: 'bg-purple-900/10' },
                ].map((card, idx) => (
                    <div key={idx} className="p-6 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-all group">
                        <card.icon className={`w-8 h-8 ${card.color} mb-4 group-hover:scale-110 transition-transform`} />
                        <h3 className="text-lg font-bold text-slate-200 mb-2">{card.title}</h3>
                        <p className="text-sm text-slate-500">{card.desc}</p>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-4 rounded bg-slate-900 border border-slate-800 text-center">
                <p className="text-xs font-mono text-slate-600">
                    SECURE ENVIRONMENT • ACTION LOGGED • V1.0.0
                </p>
            </div>
        </div>
    );
};

export default RegistryHomePage;
