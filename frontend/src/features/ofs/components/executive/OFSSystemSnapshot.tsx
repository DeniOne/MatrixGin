import React from 'react';
import { ShieldCheck, Zap, Activity, Brain } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router-dom';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type Status = 'green' | 'yellow' | 'red' | 'gray';

interface IndicatorProps {
    title: string;
    description: string;
    status: Status;
    icon: React.ElementType;
}

function Indicator({ title, description, status, icon: Icon }: IndicatorProps) {
    const navigate = useNavigate();

    const statusColors = {
        green: 'text-green-400 bg-green-500/10 border-green-500/20 hover:bg-green-500/20 cursor-pointer',
        yellow: 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 cursor-pointer',
        red: 'text-red-400 bg-red-500/10 border-red-500/20 hover:bg-red-500/20 cursor-pointer',
        gray: 'text-gray-400 bg-gray-500/10 border-gray-500/20 cursor-not-allowed opacity-70',
    };

    const handleClick = () => {
        if (status !== 'gray') {
            navigate('/ofs/graph');
        }
    };

    return (
        <div
            onClick={handleClick}
            className={cn(
                "p-3 rounded-xl border backdrop-blur-md transition-all group relative",
                statusColors[status]
            )}
        >
            <div className="flex items-center gap-3 mb-1.5">
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{title}</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full transition-all duration-1000",
                                status === 'green' ? 'bg-green-500' :
                                    status === 'yellow' ? 'bg-amber-500' :
                                        status === 'red' ? 'bg-red-500' : 'bg-gray-500'
                            )}
                            style={{
                                width: status === 'green' ? '92%' :
                                    status === 'yellow' ? '65%' :
                                        status === 'red' ? '38%' : '0%'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Tooltip on hover */}
            <div className="absolute left-0 -bottom-2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                <div className="bg-gray-900 border border-gray-800 p-2 rounded-lg shadow-2xl w-48">
                    <p className="text-[9px] text-gray-400 leading-relaxed">
                        {status === 'gray' ? 'Недостаточно данных для анализа' : description}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function OFSSystemSnapshot() {
    return (
        <div className="grid grid-cols-2 gap-3">
            <Indicator
                title="Соответствие ЦКП"
                description="Уровень соответствия текущих результатов подразделений целевым показателям Концепта Конечного Продукта."
                status="yellow"
                icon={ShieldCheck}
            />
            <Indicator
                title="Устойчивость структуры"
                description="Показатель стабильности иерархических связей и отсутствия критических разрывов в управлении."
                status="green"
                icon={Activity}
            />
            <Indicator
                title="Функциональное покрытие"
                description="Полнота покрытия необходимых бизнес-функций текущими подразделениями. Красный сигнализирует о критических пропусках функций."
                status="red"
                icon={Zap}
            />
            <Indicator
                title="Интеллектуальный капитал"
                description="Уровень методологического обеспечения и концентрация экспертного капитала (Мастера/Эксперты) в узлах системы."
                status="gray"
                icon={Brain}
            />
        </div>
    );
}
