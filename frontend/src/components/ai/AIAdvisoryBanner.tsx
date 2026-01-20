import React from 'react';
import { ShieldAlert } from 'lucide-react';

const AIAdvisoryBanner: React.FC = () => {
    return (
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 flex items-start gap-4 mb-8">
            <div className="bg-indigo-500/20 p-2 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex-1">
                <h3 className="text-sm font-bold text-indigo-100 flex items-center gap-2">
                    AI Advisory Layer
                    <span className="text-[10px] bg-indigo-500/30 px-1.5 py-0.5 rounded text-indigo-300 uppercase font-black tracking-widest">Read-Only</span>
                </h3>
                <p className="text-xs text-indigo-300/80 mt-1 leading-relaxed">
                    Этот раздел содержит рекомендации, сгенерированные AI MatrixGin.
                    AI выступает исключительно в роли <strong>советника</strong>.
                    Все решения и финальные действия выполняются человеком.
                    <a href="#" className="underline ml-1 hover:text-indigo-200 transition-colors">AI Constitution & Ethics</a>
                </p>
            </div>
        </div>
    );
};

export default AIAdvisoryBanner;
