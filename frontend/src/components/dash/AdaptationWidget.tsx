import React from 'react';
import { User, Calendar, MessageSquare, ShieldCheck } from 'lucide-react';

interface AdaptationData {
    mentor: {
        id: string;
        name: string;
        avatar?: string;
        role: string;
    } | null;
    nextMeeting: {
        id: string;
        scheduledAt: string;
        managerName: string;
    } | null;
}

interface AdaptationWidgetProps {
    data: AdaptationData;
}

const AdaptationWidget: React.FC<AdaptationWidgetProps> = ({ data }) => {
    return (
        <div className="bg-gray-900/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white/80">Адаптация</h3>
                <ShieldCheck className="text-emerald-400 w-5 h-5" />
            </div>

            <div className="space-y-6">
                {/* Mentor Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                        <User className="w-3 h-3" />
                        Наставник
                    </div>

                    {data.mentor ? (
                        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                                {data.mentor.avatar ? (
                                    <img src={data.mentor.avatar} alt={data.mentor.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    data.mentor.name.charAt(0)
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-white font-medium">{data.mentor.name}</span>
                                <span className="text-xs text-gray-400">{data.mentor.role}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/5 p-4 rounded-xl border border-dashed border-white/10 text-center">
                            <span className="text-xs text-gray-500 italic">Наставник скоро будет назначен</span>
                        </div>
                    )}
                </div>

                {/* 1-on-1 Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                        <MessageSquare className="w-3 h-3" />
                        Встреча 1-на-1
                    </div>

                    {data.nextMeeting ? (
                        <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-indigo-400 mt-0.5" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-indigo-400 font-bold uppercase mb-1">Запланировано</span>
                                    <span className="text-sm text-white font-medium">
                                        {new Date(data.nextMeeting.scheduledAt).toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                    <span className="text-xs text-gray-400 mt-1">
                                        с {data.nextMeeting.managerName}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/5 p-4 rounded-xl border border-dashed border-white/10 text-center">
                            <span className="text-xs text-gray-500 italic">Встречи пока не запланированы</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdaptationWidget;
