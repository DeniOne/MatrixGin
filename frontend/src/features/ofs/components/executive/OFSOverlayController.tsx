import { Layers, CheckCircle2, AlertTriangle } from 'lucide-react';

export type OverlayType = 'Structure' | 'Functions' | 'CPK' | 'IntellectualCapital';

interface OFSOverlayControllerProps {
    activeLayers: OverlayType[];
    onToggleLayer: (layer: OverlayType) => void;
}

export default function OFSOverlayController({ activeLayers, onToggleLayer }: OFSOverlayControllerProps) {
    const LAYERS: { id: OverlayType; label: string; icon: any }[] = [
        { id: 'Structure', label: 'Структура', icon: Layers },
        { id: 'Functions', label: 'Функции', icon: CheckCircle2 },
        { id: 'CPK', label: 'Анализ ЦКП', icon: AlertTriangle },
        { id: 'IntellectualCapital', label: 'Интеллект', icon: AlertTriangle },
    ];

    return (
        <div className="absolute left-6 top-6 bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-2 rounded-2xl flex flex-col gap-1 shadow-2xl z-20">
            <div className="px-3 py-2 border-b border-gray-800 mb-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Аналитические слои</span>
            </div>
            {LAYERS.map((layer) => (
                <button
                    key={layer.id}
                    onClick={() => onToggleLayer(layer.id)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${activeLayers.includes(layer.id)
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                        }`}
                >
                    <layer.icon className="w-3.5 h-3.5" />
                    {layer.label}
                </button>
            ))}
        </div>
    );
}
