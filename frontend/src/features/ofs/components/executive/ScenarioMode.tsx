
import { Zap, TrendingUp } from 'lucide-react';

interface ScenarioModeProps {
    type: 'Staffing' | 'Learning' | 'Functions' | 'Expertise';
}

export default function ScenarioMode({ }: ScenarioModeProps) {
    return (
        <div className="absolute inset-x-0 bottom-0 p-6 bg-gray-950/40 backdrop-blur-2xl border-t border-amber-600/30 z-30 animate-in slide-in-from-bottom-8">
            <div className="max-w-4xl mx-auto flex items-center gap-12">
                {/* Control Panel */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">Панель управления гипотезами</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Нагрузка на персонал (Δ)</label>
                            <input type="range" className="w-full accent-amber-600" />
                            <div className="flex justify-between text-[8px] text-gray-600 font-bold">
                                <span>-20%</span>
                                <span>БАЗА</span>
                                <span>+50%</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Бюджет развития (M$)</label>
                            <input type="range" className="w-full accent-amber-600" />
                            <div className="flex justify-between text-[8px] text-gray-600 font-bold">
                                <span>0</span>
                                <span>80.5</span>
                                <span>150</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-px h-24 bg-gray-800" />

                {/* Consequences */}
                <div className="w-80 space-y-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Ожидаемые последствия</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] text-gray-500">Устойчивость системы</span>
                            <span className="text-[11px] font-bold text-green-500">+12.4%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] text-gray-500">Интеллектуальный долг</span>
                            <span className="text-[11px] font-bold text-red-500">-5.2%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] text-gray-500">Скорость масштабирования</span>
                            <span className="text-[11px] font-bold text-white">БЕЗ ИЗМЕНЕНИЙ</span>
                        </div>
                    </div>
                </div>

                <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-8 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-widest">
                    ПОКАЗАТЬ ВЛИЯНИЕ
                </button>
            </div>
        </div>
    );
}
