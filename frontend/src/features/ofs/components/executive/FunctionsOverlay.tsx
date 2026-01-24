import { Activity } from 'lucide-react';

export default function FunctionsOverlay() {
    const functionData = [
        { name: 'Стратегическое планирование', coverage: 100, status: 'stable', type: 'Основная' },
        { name: 'Операционное управление', coverage: 85, status: 'warning', type: 'Основная' },
        { name: 'Ресурсное обеспечение', coverage: 40, status: 'critical', type: 'Вспомогательная' },
        { name: 'Технологический контроль', coverage: 90, status: 'stable', type: 'Рисковая' },
        { name: 'Контроль качества', coverage: 15, status: 'critical', type: 'Целевая' },
    ];

    return (
        <div className="absolute left-6 bottom-32 w-80 bg-white/90 backdrop-blur-xl border border-black/10 rounded-2xl p-5 shadow-2xl z-20 animate-in fade-in slide-in-from-left-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Activity className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-[#030213] uppercase tracking-tight">Функциональная Карта</h3>
                    <p className="text-[10px] text-[#717182] uppercase font-medium tracking-widest mt-0.5">Покрытие и Нагрузка</p>
                </div>
            </div>

            <div className="space-y-4">
                {functionData.map((fn, i) => (
                    <div key={i} className="space-y-1.5">
                        <div className="flex justify-between items-center text-[11px]">
                            <span className="text-gray-300 font-medium">{fn.name}</span>
                            <span className={`text-[9px] px-1 rounded-sm font-medium uppercase ${fn.status === 'stable' ? 'text-green-400' :
                                fn.status === 'warning' ? 'text-amber-400' : 'text-red-400'
                                }`}>
                                {fn.coverage}%
                            </span>
                        </div>
                        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${fn.status === 'stable' ? 'bg-green-500' :
                                    fn.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${fn.coverage}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-[8px] uppercase tracking-tighter font-medium">
                            <span className="text-gray-600">{fn.type}</span>
                            <span className={fn.status === 'critical' ? 'text-red-500' : 'text-gray-600'}>
                                {fn.status === 'critical' ? 'ДЕФИЦИТ КАДРОВ' : 'УКОМПЛЕКТОВАНО'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-black/10">
                <div className="flex items-center justify-between text-[10px] text-[#717182] font-medium uppercase">
                    <span>Общий охват системы</span>
                    <span className="text-[#030213]">66.2%</span>
                </div>
            </div>
        </div>
    );
}
