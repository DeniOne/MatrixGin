import React, { useMemo } from 'react';

interface StartGrowthWeb3DProps {
    quality: number;
    speed: number;
    sales: number;
    team: number;
}

/**
 * Canon Matrix Growth Chart (Geist Design System)
 * High-contrast, thin lines, premium Geist typography.
 */
export const StartGrowthWeb3D: React.FC<StartGrowthWeb3DProps> = ({ quality, speed, sales, team }) => {
    const size = 400;
    const center = size / 2;
    const radius = 130;

    const data = useMemo(() => [
        { label: 'Качество', value: quality, angle: -Math.PI / 2 },
        { label: 'Скорость', value: speed, angle: 0 },
        { label: 'Продажи', value: sales, angle: Math.PI / 2 },
        { label: 'Команда', value: team, angle: Math.PI },
    ], [quality, speed, sales, team]);

    const points = useMemo(() => {
        return data.map(d => {
            const r = (d.value / 100) * radius;
            return `${center + r * Math.cos(d.angle)},${center + r * Math.sin(d.angle)}`;
        }).join(' ');
    }, [data, center, radius]);

    const averagePulse = Math.round((quality + speed + sales + team) / 4);

    return (
        <div className="w-full h-full bg-white/80 backdrop-blur-md rounded-3xl border border-black/10 flex flex-col items-center justify-center p-8 relative min-h-[460px] shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-10" />

            {/* Header with Canon Typography */}
            <div className="absolute top-8 left-8 flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                    <span className="text-[10px] font-medium text-indigo-600 uppercase tracking-[0.3em]">
                        Matrix Pulse
                    </span>
                </div>
                <h3 className="text-xl font-medium text-[#030213] tracking-tight">Growth Dynamics</h3>
            </div>

            <svg
                viewBox={`0 0 ${size} ${size}`}
                className="w-full h-full relative z-0 overflow-visible max-w-[340px] drop-shadow-2xl"
            >
                <defs>
                    <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
                    </linearGradient>
                </defs>

                {/* Grid Rings (Thin & Subtle) */}
                {[0.2, 0.4, 0.6, 0.8, 1].map((step, i) => {
                    const ringPoints = data.map(d => {
                        const r = radius * step;
                        return `${center + r * Math.cos(d.angle)},${center + r * Math.sin(d.angle)}`;
                    }).join(' ');
                    return (
                        <polygon
                            key={i}
                            points={ringPoints}
                            fill="none"
                            stroke="rgba(0,0,0,0.04)"
                            strokeWidth="0.5"
                        />
                    );
                })}

                {/* Axial Lines */}
                {data.map((d, i) => (
                    <line
                        key={i}
                        x1={center}
                        y1={center}
                        x2={center + radius * Math.cos(d.angle)}
                        y2={center + radius * Math.sin(d.angle)}
                        stroke="rgba(0,0,0,0.06)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                    />
                ))}

                {/* Growth Area with Glassy Gradient */}
                <polygon
                    points={points}
                    fill="url(#growthGradient)"
                    stroke="#4F46E5"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    className="transition-all duration-1000 ease-in-out"
                />

                {/* Data Nodes & Premium Labels */}
                {data.map((d, i) => {
                    const r = (d.value / 100) * radius;
                    const x = center + r * Math.cos(d.angle);
                    const y = center + r * Math.sin(d.angle);

                    const labelR = radius + 35;
                    const lx = center + labelR * Math.cos(d.angle);
                    const ly = center + labelR * Math.sin(d.angle);

                    return (
                        <g key={i}>
                            <circle
                                cx={x}
                                cy={y}
                                r="3.5"
                                fill="white"
                                stroke="#4F46E5"
                                strokeWidth="2"
                                className="transition-all duration-1000 shadow-sm"
                            />
                            <text
                                x={lx}
                                y={ly - 4}
                                textAnchor="middle"
                                className="fill-[#030213] text-[11px] font-medium uppercase tracking-wider select-none font-geist"
                            >
                                {d.label}
                            </text>
                            <text
                                x={lx}
                                y={ly + 10}
                                textAnchor="middle"
                                className="fill-[#717182] text-[10px] font-medium select-none"
                            >
                                {d.value}%
                            </text>
                        </g>
                    );
                })}

                {/* Central Core */}
                <circle cx={center} cy={center} r="4" fill="#030213" className="shadow-lg" />
            </svg>

            {/* Power Index HUD (Geist Style) */}
            <div className="absolute bottom-8 right-8 flex flex-col items-end">
                <span className="text-[10px] font-medium text-[#717182] uppercase tracking-[0.2em] mb-0.5">
                    Sync Pulse
                </span>
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-medium text-[#030213] tracking-tighter leading-none">
                        {averagePulse}
                    </span>
                    <span className="text-sm font-medium text-indigo-600">%</span>
                </div>
            </div>

            {/* Mini Legend / Status Pill */}
            <div className="absolute bottom-8 left-8">
                <div className="flex items-center gap-3 bg-[#F3F3F5] px-4 py-2 rounded-xl border border-black/5">
                    <div className="flex -space-x-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-indigo-600' : 'bg-black/10'}`} />
                        ))}
                    </div>
                    <span className="text-[10px] font-medium text-[#717182] uppercase tracking-wide">
                        Optimal Flow
                    </span>
                </div>
            </div>
        </div>
    );
};
