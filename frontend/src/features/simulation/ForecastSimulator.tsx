import React, { useState, useMemo } from 'react';

// --- TYPES ---
interface SimulationState {
    quality: number;
    speed: number;
    sales: number;
}

interface ForecastSimulatorProps {
    currentStats: {
        quality: number;
        speed: number;
        sales: number;
        mcEarnings: number; // Daily AVG
    };
    onSuggestGoal: () => void;
}

// --- CONSTANTS ---
// Based on mes-rates.ts (simplified for client-side simulation)
const BASE_RATE_MC = 10; // MC per perfect task
const QUALITY_MULTIPLIER_THRESHOLD = 95; // %
const SALES_BONUS_RATIO = 0.01; // 1% of sales to MC (simplified)

// --- COMPONENT ---

export const ForecastSimulator: React.FC<ForecastSimulatorProps> = ({ currentStats, onSuggestGoal }) => {
    const [simulated, setSimulated] = useState<SimulationState>({
        quality: currentStats.quality,
        speed: currentStats.speed,
        sales: currentStats.sales,
    });

    const [copied, setCopied] = useState(false);

    // --- LOGIC: Client-Side "What If" Calculation ---
    const calculation = useMemo(() => {
        // 1. Current Income Calculation
        const currentDailyTasks = currentStats.speed * 8; // 8 hour shift
        const currentBaseMC = currentDailyTasks * BASE_RATE_MC;
        const currentQualityBonus = currentStats.quality >= QUALITY_MULTIPLIER_THRESHOLD ? 1.2 : 1.0;
        const currentSalesBonus = currentStats.sales * SALES_BONUS_RATIO;
        const currentTotalMC = Math.round((currentBaseMC * currentQualityBonus) + currentSalesBonus);

        // 2. Simulated Income Calculation
        const simDailyTasks = simulated.speed * 8;
        const simBaseMC = simDailyTasks * BASE_RATE_MC;
        const simQualityBonus = simulated.quality >= QUALITY_MULTIPLIER_THRESHOLD ? 1.2 : 1.0;
        const simSalesBonus = simulated.sales * SALES_BONUS_RATIO;
        const simTotalMC = Math.round((simBaseMC * simQualityBonus) + simSalesBonus);

        const diffMC = simTotalMC - currentTotalMC;

        return {
            currentTotalMC,
            simTotalMC,
            diffMC
        };
    }, [currentStats, simulated]);

    // --- HANDLERS ---
    const handleSliderChange = (field: keyof SimulationState, value: number) => {
        setSimulated(prev => ({ ...prev, [field]: value }));
    };

    const handleExport = () => {
        const text = `🎯 Моя цель (Симуляция):\nКачество: ${simulated.quality}%\nСкорость: ${simulated.speed}/ч\nПродажи: ${simulated.sales}₽\n--> Прогноз: ${calculation.simTotalMC} MC/смена`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    🧪 Симулятор "Что если?"
                    <span className="text-xs font-normal text-amber-400 bg-amber-900/30 px-2 py-0.5 rounded border border-amber-700">
                        Simulation Only
                    </span>
                </h3>
                <div className="text-xs text-slate-400">
                    Не является офертой
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* CONTROLS */}
                <div className="space-y-6">
                    {/* Speed Slider */}
                    <div>
                        <label className="flex justify-between text-sm text-slate-300 mb-2">
                            <span>Скорость (задач/час)</span>
                            <span className="font-mono text-cyan-400">{simulated.speed}</span>
                        </label>
                        <input
                            type="range" min="1" max="20" step="0.5"
                            value={simulated.speed}
                            onChange={(e) => handleSliderChange('speed', parseFloat(e.target.value))}
                            className="w-full accent-cyan-500 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {/* Quality Slider */}
                    <div>
                        <label className="flex justify-between text-sm text-slate-300 mb-2">
                            <span>Качество (%)</span>
                            <span className={`font-mono ${simulated.quality >= 95 ? 'text-green-400' : 'text-yellow-400'}`}>
                                {simulated.quality}%
                            </span>
                        </label>
                        <input
                            type="range" min="50" max="100" step="1"
                            value={simulated.quality}
                            onChange={(e) => handleSliderChange('quality', parseFloat(e.target.value))}
                            className="w-full accent-green-500 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                        />
                        {simulated.quality >= 95 && (
                            <div className="text-xs text-green-500 mt-1 flex items-center">
                                ✨ Коэффициент x1.2 активирован!
                            </div>
                        )}
                    </div>

                    {/* Sales Slider */}
                    <div>
                        <label className="flex justify-between text-sm text-slate-300 mb-2">
                            <span>Продажи (₽/смена)</span>
                            <span className="font-mono text-purple-400">{simulated.sales} ₽</span>
                        </label>
                        <input
                            type="range" min="0" max="50000" step="1000"
                            value={simulated.sales}
                            onChange={(e) => handleSliderChange('sales', parseFloat(e.target.value))}
                            className="w-full accent-purple-500 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                {/* RESULTS PANEL */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-dashed border-slate-600 flex flex-col justify-center">
                    <div className="text-center mb-2">
                        <span className="text-slate-400 text-sm">Прогноз заработка (за смену)</span>
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-6">
                        {/* Current */}
                        <div className="text-center opacity-60 grayscale blur-[0.5px]">
                            <div className="text-2xl font-bold text-slate-300">{calculation.currentTotalMC} MC</div>
                            <div className="text-xs text-slate-500">Сейчас</div>
                        </div>

                        <div className="text-slate-600">→</div>

                        {/* Simulated */}
                        <div className="text-center">
                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 drop-shadow-sm">
                                {calculation.simTotalMC} MC
                            </div>
                            <div className="text-xs text-amber-500 font-medium">
                                {calculation.diffMC > 0 ? `+${calculation.diffMC}` : calculation.diffMC} MC
                            </div>
                            <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1 border border-slate-700 px-1 py-0.5 rounded inline-block">
                                Simulated
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS (Non-Binding) */}
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                        <button
                            onClick={onSuggestGoal}
                            className="bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                        >
                            🗺️ Suggest Goal
                        </button>
                        <button
                            onClick={handleExport}
                            className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {copied ? '✅ Скопировано!' : '💾 Export Plan'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
