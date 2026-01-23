import { Users, Star, Gem, AlertCircle, TrendingUp } from 'lucide-react';

export default function StatusQualificationOverlay() {
    const data = {
        flints: 45,
        stars: 12,
        universe: 3,
        averageLevel: 4.2,
        risk: 'Низкий'
    };

    return (
        <div className="absolute right-6 bottom-32 w-80 bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 shadow-2xl z-20 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                    <Users className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-tight">Интеллектуальный Индекс</h3>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-0.5">Статусы и Квалификации</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50 flex flex-col items-center">
                    <Star className="w-4 h-4 text-blue-400 mb-2" />
                    <span className="text-lg font-bold text-white">{data.flints}</span>
                    <span className="text-[8px] text-gray-500 font-bold uppercase mt-1">Кремень</span>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-xl border border-amber-500/20 flex flex-col items-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors" />
                    <Gem className="w-4 h-4 text-amber-500 mb-2 relative z-10" />
                    <span className="text-lg font-bold text-amber-400 relative z-10">{data.stars}</span>
                    <span className="text-[8px] text-amber-600/60 font-bold uppercase mt-1 relative z-10">Звёзды</span>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-xl border border-purple-500/20 flex flex-col items-center">
                    <TrendingUp className="w-4 h-4 text-purple-400 mb-2" />
                    <span className="text-lg font-bold text-white">{data.universe}</span>
                    <span className="text-[8px] text-gray-500 font-bold uppercase mt-1">Вселенная</span>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center p-2.5 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Риск потери знаний</span>
                    </div>
                    <span className="text-[10px] font-bold text-green-400 uppercase">{data.risk}</span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-blue-500 rounded-full" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Ср. уровень квалификации</span>
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase">{data.averageLevel} / 5.0</span>
                </div>
            </div>

            <div className="mt-6 flex gap-2">
                <div className="p-1 px-2 rounded bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                    <span className="text-[9px] text-amber-200 font-medium">Требуется аттестация для 4 позиций</span>
                </div>
            </div>
        </div>
    );
}
