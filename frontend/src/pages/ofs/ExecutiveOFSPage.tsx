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
        <div className="min-h-screen bg-[#F3F3F5] text-[#030213] font-sans selection:bg-blue-500/30">
            {/* Persistent Header */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-black/10">
                <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                            <Network className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-medium tracking-tight text-[#030213]">
                                OFS — Организационно-функциональная система
                            </h1>
                            <p className="text-xs text-[#717182] font-medium uppercase tracking-[0.2em] mt-0.5">
                                Панель управления: Структура, ЦКП и Интеллектуальный капитал
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Mode Switcher */}
                        <div className="flex bg-[#F3F3F5] rounded-full p-1 border border-black/5 shadow-inner">
                            <button
                                onClick={() => setMode('As Is')}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${mode === 'As Is'
                                    ? 'bg-blue-600 text-[#030213] shadow-lg shadow-blue-600/20'
                                    : 'text-[#717182] hover:text-[#030213]'
                                    }`}
                            >
                                ТЕКУЩЕЕ (AS IS)
                            </button>
                            <button
                                onClick={() => setMode('Scenario')}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${mode === 'Scenario'
                                    ? 'bg-amber-600 text-[#030213] shadow-lg shadow-amber-600/20'
                                    : 'text-[#717182] hover:text-[#030213]'
                                    }`}
                            >
                                СЦЕНАРИЙ
                            </button>
                        </div>

                        <div className="h-6 w-px bg-white/10" />

                        <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-[#F3F3F5] rounded-lg transition-colors border border-transparent hover:border-black/5">
                                <History className="w-5 h-5 text-[#717182]" />
                            </button>
                            <button className="p-2 hover:bg-[#F3F3F5] rounded-lg transition-colors border border-transparent hover:border-black/5">
                                <Settings className="w-5 h-5 text-[#717182]" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-6 py-8 flex flex-col gap-8">
                {/* System Snapshot */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <LayoutDashboard className="w-4 h-4 text-[#717182]" />
                        <h2 className="text-xs font-medium text-[#717182] uppercase tracking-widest">Контекст здоровья системы</h2>
                    </div>
                    <OFSSystemSnapshot />
                </section>

                {/* Main Interaction Area */}
                <section className="flex-1 min-h-[700px] bg-white rounded-2xl border border-black/10 shadow-sm relative overflow-hidden flex flex-col">
                    {/* Relationship Map */}
                    <div className="flex-1 overflow-hidden" onClick={() => setSelectedNode(null)}>
                        <OFSMap onSelectNode={(id: string, name: string) => setSelectedNode({ id, name })} selectedNodeId={selectedNode?.id} />
                    </div>

                    {/* Scenario Mode Banner */}
                    {mode === 'Scenario' && (
                        <>
                            <div className="absolute top-0 inset-x-0 bg-amber-50 border-b border-amber-200 py-2 px-6 flex items-center justify-between pointer-events-none z-10">
                                <div className="flex items-center gap-2">
                                    <Info className="w-4 h-4 text-amber-600" />
                                    <span className="text-xs font-medium text-amber-700 uppercase tracking-widest">Экспериментальное стратегическое пространство</span>
                                </div>
                                <span className="text-[10px] text-amber-700/60 italic leading-none">Сценарий показывает последствия гипотез, а не прогнозы.</span>
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
