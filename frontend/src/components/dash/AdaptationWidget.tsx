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
        <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-sm h-full hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-[#030213]">Адаптация</h3>
                <ShieldCheck className="text-emerald-500 w-5 h-5" />
            </div>

            <div className="space-y-6">
                {/* Mentor Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#717182] font-medium uppercase tracking-wider">
                        <User className="w-3 h-3" />
                        Наставник
                    </div>

                    {data.mentor ? (
                        <div className="flex items-center gap-4 bg-[#F8FAFC] p-3 rounded-xl border border-black/5 hover:border-indigo-200 transition-colors cursor-pointer group">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium group-hover:scale-105 transition-transform">
                                {data.mentor.avatar ? (
                                    <img src={data.mentor.avatar} alt={data.mentor.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    data.mentor.name.charAt(0)
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-[#030213] font-medium group-hover:text-indigo-600 transition-colors">{data.mentor.name}</span>
                                <span className="text-xs text-[#717182]">{data.mentor.role}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#F8FAFC] p-4 rounded-xl border border-dashed border-black/10 text-center">
                            <span className="text-xs text-[#717182] italic">Наставник скоро будет назначен</span>
                        </div>
                    )}
                </div>

                {/* 1-on-1 Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#717182] font-medium uppercase tracking-wider">
                        <MessageSquare className="w-3 h-3" />
                        Встреча 1-на-1
                    </div>

                    {data.nextMeeting ? (
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-indigo-600 mt-0.5" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-indigo-600 font-medium uppercase mb-1">Запланировано</span>
                                    <span className="text-sm text-[#030213] font-medium">
                                        {new Date(data.nextMeeting.scheduledAt).toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                    <span className="text-xs text-[#717182] mt-1">
                                        с {data.nextMeeting.managerName}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#F8FAFC] p-4 rounded-xl border border-dashed border-black/10 text-center">
                            <span className="text-xs text-[#717182] italic">Встречи пока не запланированы</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdaptationWidget;
