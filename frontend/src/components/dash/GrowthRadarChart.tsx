import React from 'react';

interface GrowthPulse {
    axis: string;
    value: number;
    fullMark: number;
}

interface GrowthRadarChartProps {
    data: GrowthPulse[];
    size?: number;
}

/**
 * Custom SVG Radar Chart for MatrixGin Growth Matrix.
 * 
 * DESIGN PRINCIPLES:
 * - Human-centric / Non-evaluative
 * - Glassmorphism aesthetics
 * - No red/green zones
 */
const GrowthRadarChart: React.FC<GrowthRadarChartProps> = ({ data = [], size = 300 }) => {
    const center = size / 2;
    const radius = (size / 2) * 0.8;

    if (!Array.isArray(data) || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-6 border border-black/10 shadow-sm h-full min-h-[300px]">
                <span className="text-[#717182] animate-pulse">Инициализация Матрицы...</span>
            </div>
        );
    }

    const axesCount = data.length;

    // Calculate hexagon/polygon points for background rings
    const getPoints = (currentRadius: number) => {
        return Array.from({ length: axesCount }).map((_, i) => {
            const angle = (Math.PI * 2 * i) / axesCount - Math.PI / 2;
            return `${center + currentRadius * Math.cos(angle)},${center + currentRadius * Math.sin(angle)}`;
        }).join(' ');
    };

    // Calculate individual points for the actual value polygon
    const valuePoints = data.map((d, i) => {
        const angle = (Math.PI * 2 * i) / axesCount - Math.PI / 2;
        const valRadius = ((d?.value || 0) / (d?.fullMark || 100)) * radius;
        return `${center + valRadius * Math.cos(angle)},${center + valRadius * Math.sin(angle)}`;
    }).join(' ');

    return (
        <div className="flex flex-col items-center bg-white rounded-2xl p-6 border border-black/10 shadow-sm h-full">
            <h3 className="text-lg font-medium text-[#030213] mb-4">Матрица Роста</h3>

            <svg width={size} height={size} className="overflow-visible">
                {/* Background Rings */}
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((step) => (
                    <polygon
                        key={step}
                        points={getPoints(radius * step)}
                        fill="none"
                        stroke="rgba(0, 0, 0, 0.05)"
                        strokeWidth="1"
                    />
                ))}

                {/* Axes */}
                {data.map((d, i) => {
                    const angle = (Math.PI * 2 * i) / axesCount - Math.PI / 2;
                    const x2 = center + radius * Math.cos(angle);
                    const y2 = center + radius * Math.sin(angle);
                    return (
                        <g key={d.axis}>
                            <line
                                x1={center}
                                y1={center}
                                x2={x2}
                                y2={y2}
                                stroke="rgba(0, 0, 0, 0.1)"
                                strokeDasharray="2 4"
                            />
                            <text
                                x={center + (radius + 25) * Math.cos(angle)}
                                y={center + (radius + 20) * Math.sin(angle)}
                                textAnchor="middle"
                                fontSize="11"
                                fill="#717182"
                                className="font-medium"
                            >
                                {d.axis}
                            </text>
                        </g>
                    );
                })}

                {/* Value Polygon */}
                <polygon
                    points={valuePoints}
                    fill="rgba(79, 70, 229, 0.1)"
                    stroke="#4f46e5"
                    strokeWidth="2"
                    className="transition-all duration-1000 ease-out"
                />

                {/* Value Nodes */}
                {data.map((d, i) => {
                    const angle = (Math.PI * 2 * i) / axesCount - Math.PI / 2;
                    const valRadius = (d.value / d.fullMark) * radius;
                    return (
                        <circle
                            key={i}
                            cx={center + valRadius * Math.cos(angle)}
                            cy={center + valRadius * Math.sin(angle)}
                            r="4"
                            fill="#4f46e5"
                            className="transition-all duration-1000 ease-out"
                        />
                    );
                })}
            </svg>

            <div className="mt-4 text-xs text-[#717182] font-medium italic">
                * Масштаб ваших возможностей
            </div>
        </div>
    );
};

export default GrowthRadarChart;
