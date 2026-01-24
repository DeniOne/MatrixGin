import React from 'react';
import { ShieldAlert } from 'lucide-react';

const AIAdvisoryBanner: React.FC = () => {
    return (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 flex items-start gap-4 mb-8 shadow-sm">
            <div className="bg-white p-2 rounded-xl shadow-sm">
                <ShieldAlert className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
                <h3 className="text-sm font-medium text-indigo-900 flex items-center gap-2">
                    Слой AI-советов
                    <span className="text-[10px] bg-indigo-100 px-2 py-0.5 rounded text-indigo-700 uppercase font-medium tracking-widest border border-indigo-200">Только чтение</span>
                </h3>
                <p className="text-xs text-indigo-800/80 mt-1 leading-relaxed">
                    Этот раздел содержит рекомендации, сгенерированные AI MatrixGin.
                    AI выступает исключительно в роли <strong>советника</strong>.
                    Все решения и финальные действия выполняются человеком.
                    <a href="#" className="underline ml-1 hover:text-indigo-950 transition-colors font-medium">AI Constitution & Ethics</a>
                </p>
            </div>
        </div>
    );
};

export default AIAdvisoryBanner;
