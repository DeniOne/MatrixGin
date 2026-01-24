import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';

const CultureCompliancePage: React.FC = () => {
    const policies = [
        { id: '1', title: 'Кодекс этики', status: 'read', date: '15.11.2024' },
        { id: '2', title: 'Антикоррупционная политика', status: 'pending', date: null },
        { id: '3', title: 'Политика конфиденциальности', status: 'read', date: '10.10.2024' }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-8">Этика и Комплаенс</h1>
            <div className="space-y-4">
                {policies.map(policy => (
                    <div key={policy.id} className="bg-white p-6 rounded-xl border flex items-center justify-between">
                        <div className="flex items-center">
                            <FileText className="w-6 h-6 text-indigo-600 mr-4" />
                            <div>
                                <h3 className="font-medium text-gray-900">{policy.title}</h3>
                                {policy.status === 'read' && (
                                    <p className="text-xs text-green-600 flex items-center mt-1">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Ознакомлены {policy.date}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 text-[#030213] rounded-lg text-sm font-medium hover:bg-indigo-700">
                            Открыть
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CultureCompliancePage;
