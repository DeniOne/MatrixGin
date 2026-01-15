import React from 'react';

interface ImpactSummary {
    totalBlocking: number;
    totalWarning: number;
    totalInfo: number;
    canCommit: boolean;
}

interface BulkImpactPreviewProps {
    summary: ImpactSummary;
    details: any[];
}

export const BulkImpactPreview: React.FC<BulkImpactPreviewProps> = ({ summary, details }) => {
    return (
        <div className="space-y-4">
            {/* Summary Box */}
            <div className={`p-4 rounded border ${summary.canCommit ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <h4 className={`text-lg font-bold ${summary.canCommit ? 'text-green-800' : 'text-red-800'}`}>
                    {summary.canCommit ? 'Operation Allowed' : 'Operation Blocked'}
                </h4>
                <div className="flex gap-4 mt-2 text-sm">
                    <span className="font-semibold text-red-600">Blocking: {summary.totalBlocking}</span>
                    <span className="font-semibold text-yellow-600">Warnings: {summary.totalWarning}</span>
                    <span className="text-blue-600">Info: {summary.totalInfo}</span>
                </div>
            </div>

            {/* Blocking Details */}
            {summary.totalBlocking > 0 && (
                <div className="mt-4">
                    <h5 className="font-bold text-red-700 mb-2">Blocking Issues (ALL-OR-NOTHING: Fix these to proceed)</h5>
                    <ul className="list-disc pl-5 space-y-1">
                        {details.filter(d => d.blocking > 0).map((d) => (
                            <li key={d.urn} className="text-sm text-red-600">
                                <strong>{d.urn}</strong>: {d.report.impacts.find((i: any) => i.level === 'BLOCKING')?.description || 'Validation Failed'}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
