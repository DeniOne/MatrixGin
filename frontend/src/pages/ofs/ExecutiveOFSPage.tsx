import { useState } from 'react';
import { LayoutDashboard, Network, Settings, Info, History } from 'lucide-react';
import OFSSystemSnapshot from '../../features/ofs/components/executive/OFSSystemSnapshot';
import OFSMap from '../../features/ofs/components/executive/OFSMap';
import OFSOverlayController, { OverlayType } from '../../features/ofs/components/executive/OFSOverlayController';
import CPKOverlay from '../../features/ofs/components/executive/CPKOverlay';
import FunctionsOverlay from '../../features/ofs/components/executive/FunctionsOverlay';
import StatusQualificationOverlay from '../../features/ofs/components/executive/StatusQualificationOverlay';
import ScenarioMode from '../../features/ofs/components/executive/ScenarioMode';

type Mode = 'As Is' | 'Scenario';

export default function ExecutiveOFSPage() {
    const [mode, setMode] = useState<Mode>('As Is');
    const [activeLayers, setActiveLayers] = useState<OverlayType[]>(['Structure']);
    const [selectedNode, setSelectedNode] = useState<{ id: string; name: string } | null>(null);

    const toggleLayer = (layer: OverlayType) => {
        setActiveLayers(prev =>
            prev.includes(layer)
                ? prev.filter(l => l !== layer)
                : [...prev, layer]
        );
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30">
            {/* Persistent Header */}
            <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
                <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-600/20">
                            <Network className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                OFS — Организационно-функциональная система
                            </h1>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-[0.2em] mt-0.5">
                                Панель управления: Структура, ЦКП и Интеллектуальный капитал
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Mode Switcher */}
                        <div className="flex bg-gray-900 rounded-full p-1 border border-gray-800 shadow-inner">
                            <button
                                onClick={() => setMode('As Is')}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === 'As Is'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                ТЕКУЩЕЕ (AS IS)
                            </button>
                            <button
                                onClick={() => setMode('Scenario')}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === 'Scenario'
                                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                                    : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                СЦЕНАРИЙ
                            </button>
                        </div>

                        <div className="h-6 w-px bg-gray-800" />

                        <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-700">
                                <History className="w-5 h-5 text-gray-400" />
                            </button>
                            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-700">
                                <Settings className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-6 py-8 flex flex-col gap-8">
                {/* System Snapshot */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <LayoutDashboard className="w-4 h-4 text-gray-400" />
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Контекст здоровья системы</h2>
                    </div>
                    <OFSSystemSnapshot />
                </section>

                {/* Main Interaction Area */}
                <section className="flex-1 min-h-[700px] bg-gray-900/30 rounded-2xl border border-gray-800 relative overflow-hidden flex flex-col">
                    {/* Relationship Map */}
                    <div className="flex-1 overflow-hidden" onClick={() => setSelectedNode(null)}>
                        <OFSMap onSelectNode={(id: string, name: string) => setSelectedNode({ id, name })} selectedNodeId={selectedNode?.id} />
                    </div>

                    {/* Scenario Mode Banner */}
                    {mode === 'Scenario' && (
                        <>
                            <div className="absolute top-0 inset-x-0 bg-amber-600/10 border-b border-amber-600/20 py-2 px-6 flex items-center justify-between pointer-events-none z-10">
                                <div className="flex items-center gap-2">
                                    <Info className="w-4 h-4 text-amber-500" />
                                    <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Экспериментальное стратегическое пространство</span>
                                </div>
                                <span className="text-[10px] text-amber-500/60 italic leading-none">Сценарий показывает последствия гипотез, а не прогнозы.</span>
                            </div>
                            <ScenarioMode type="Staffing" />
                        </>
                    )}

                    {/* Analytical Overlays */}
                    {activeLayers.includes('CPK') && selectedNode && (
                        <CPKOverlay nodeId={selectedNode.id} nodeName={selectedNode.name} />
                    )}

                    {activeLayers.includes('Functions') && (
                        <FunctionsOverlay />
                    )}

                    {activeLayers.includes('IntellectualCapital') && (
                        <StatusQualificationOverlay />
                    )}

                    {/* Overlay System Controller */}
                    <OFSOverlayController
                        activeLayers={activeLayers}
                        onToggleLayer={toggleLayer}
                    />
                </section>
            </main>
        </div>
    );
}
