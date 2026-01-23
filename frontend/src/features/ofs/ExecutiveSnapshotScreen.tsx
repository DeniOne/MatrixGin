import React, { useEffect, useState } from 'react';
import { ExecutiveSnapshotDTO } from './types';
import { SignalBlock } from './components/SignalBlock';

// MOCK DATA SERVICE (Until Backend Integration)
const fetchSnapshot = async (): Promise<ExecutiveSnapshotDTO> => {
    // Simulator: randomly return different states or fail
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                meta: {
                    timestamp: new Date().toISOString(),
                    mode: 'LIVE',
                    data_quality: 'COMPLETE',
                    // Try changing to 'INSUFFICIENT' to test fail-safe
                    // data_quality: 'INSUFFICIENT' 
                },
                indicators: {
                    structural_stability: {
                        level: 'GREEN',
                        summary: 'System structure is coherent and fully connected. No ghost units detected.'
                    },
                    functional_coverage: {
                        level: 'YELLOW',
                        summary: 'Tension detected: 3 Organizational Units lack defined functions.'
                    },
                    cpk_alignment: {
                        level: 'RED',
                        summary: 'Critical gap: 12 Core functions lack defined outputs (CPK). Ownership ambiguous.'
                    },
                    intellectual_support: {
                        level: 'GREEN',
                        summary: 'High coverage of methodologies. All critical positions supported.'
                    }
                }
            });
        }, 800);
    });
};

export const ExecutiveSnapshotScreen: React.FC = () => {
    const [snapshot, setSnapshot] = useState<ExecutiveSnapshotDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSnapshot().then(data => {
            setSnapshot(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="p-8 text-gray-500">System Analysis in progress...</div>;
    }

    if (!snapshot) return null;

    const isScenario = snapshot.meta.mode === 'SCENARIO';
    const isInsufficient = snapshot.meta.data_quality === 'INSUFFICIENT';

    return (
        <div className="bg-gray-50 min-h-screen p-8 font-sans">
            {/* HEADER */}
            <header className="mb-8 flex justify-between items-end border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-3xl font-light text-gray-800 tracking-tight">System Registry</h1>
                    <p className="text-sm text-gray-500 mt-1">Executive Strategic Panel</p>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-400 uppercase">Last Updated</div>
                    <div className="text-sm font-mono text-gray-600">
                        {new Date(snapshot.meta.timestamp).toLocaleTimeString()}
                    </div>
                </div>
            </header>

            {/* SCENARIO BANNER */}
            {isScenario && (
                <div className="mb-6 bg-slate-800 text-white px-4 py-3 rounded-md shadow-lg flex justify-between items-center">
                    <span className="font-bold tracking-wide">SCENARIO PREVIEW MODE</span>
                    <span className="text-xs opacity-75">Changes are in-memory only. Not saved to Registry.</span>
                </div>
            )}

            {/* FAIL-SAFE BANNER */}
            {isInsufficient && (
                <div className="mb-6 bg-gray-200 text-gray-600 px-4 py-3 rounded-md flex justify-between items-center">
                    <span className="font-bold">DATA UNAVAILABLE</span>
                    <span className="text-sm">Registry Read Adapter is unreachable.</span>
                </div>
            )}

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">

                <SignalBlock
                    title="Structural Stability"
                    data={isInsufficient ? { level: 'GRAY', summary: 'Данные недоступны' } : snapshot.indicators.structural_stability}
                />

                <SignalBlock
                    title="Functional Coverage"
                    data={isInsufficient ? { level: 'GRAY', summary: 'Данные недоступны' } : snapshot.indicators.functional_coverage}
                />

                <SignalBlock
                    title="Соответствие ЦПК"
                    data={isInsufficient ? { level: 'GRAY', summary: 'Данные недоступны' } : snapshot.indicators.cpk_alignment}
                />

                <SignalBlock
                    title="Intellectual Support"
                    data={isInsufficient ? { level: 'GRAY', summary: 'Данные недоступны' } : snapshot.indicators.intellectual_support}
                />

            </div>

            {/* FOOTER */}
            <footer className="mt-12 text-center text-xs text-gray-400">
                MatrixGin v2.x • OFS Module 04 • Confidential Executive Access
            </footer>
        </div>
    );
};
