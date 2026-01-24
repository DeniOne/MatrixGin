import { Target, GitMerge, AlertTriangle } from 'lucide-react';

interface CPKOverlayProps {
    nodeId: string;
    nodeName: string;
}

export default function CPKOverlay({ nodeName }: CPKOverlayProps) {
    const cpkData = {
        name: "ЦКП Отдела Продаж",
        alignment: 85,
        parentCpk: "ЦКП Департамента Бизнеса",
        conflicts: [
            { type: 'Ресурсный', status: 'high', desc: 'Пересечение по квалифицированным кадрам' },
            { type: 'Логический', status: 'low', desc: 'Незначительное расхождение в метриках' }
        ],
        hypothesis: [
            { id: 'h1', title: 'Внедрение AI в пре-сейл', state: 'testing' },
            { id: 'h2', title: 'Расширение штата на 20%', state: 'approved' }
        ]
    };

    return (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-80 bg-white/90 backdrop-blur-xl border border-black/10 rounded-2xl p-5 shadow-2xl z-20 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Target className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-[#030213] uppercase tracking-tight">Анализ ЦКП</h3>
                    <p className="text-[10px] text-[#717182] uppercase font-medium tracking-widest mt-0.5">{nodeName}</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Alignment Score */}
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] text-[#717182] font-medium uppercase tracking-wider">Соответствие цели</span>
                        <span className="text-lg font-mono font-medium text-blue-400">{cpkData.alignment}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-1000"
                            style={{ width: `${cpkData.alignment}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-[#717182] mt-2 flex items-center gap-1">
                        <GitMerge className="w-3 h-3" />
                        Родительский: {cpkData.parentCpk}
                    </p>
                </div>

                {/* Conflicts Section */}
                <div>
                    <h4 className="text-[10px] font-medium text-[#717182] uppercase tracking-widest mb-3">Структурные Конфликты</h4>
                    <div className="space-y-2">
                        {cpkData.conflicts.map((conf, i) => (
                            <div key={i} className="flex gap-3 p-2 bg-red-500/5 border border-red-500/10 rounded-lg">
                                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[11px] font-medium text-red-200">{conf.type} Конфликт</p>
                                    <p className="text-[10px] text-red-400/60 leading-tight">{conf.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hypothesis Tracking */}
                <div>
                    <h4 className="text-[10px] font-medium text-[#717182] uppercase tracking-widest mb-3">Валидация Гипотез</h4>
                    <div className="space-y-2">
                        {cpkData.hypothesis.map((h) => (
                            <div key={h.id} className="flex items-center justify-between p-2 bg-gray-800/40 rounded-lg border border-gray-700/50">
                                <span className="text-[11px] text-gray-300">{h.title}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-tighter ${h.state === 'testing' ? 'bg-amber-500/20 text-amber-500' : 'bg-green-500/20 text-green-500'
                                    }`}>
                                    {h.state === 'testing' ? 'ТЕСТ' : 'ПРИНЯТО'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
