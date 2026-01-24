import React from 'react';
import {
    Smile,
    Calendar,
    TrendingUp,
    CheckCircle,
    XCircle,
    MessageSquare,
    Lightbulb
} from 'lucide-react';
import {
    useGetTeamStatusQuery,
    useGetKaizenFeedQuery,
    useReviewKaizenMutation
} from '../features/gamification/growthApi';

const ManagerDashboard: React.FC = () => {
    const { data: teamStatus, isLoading: isTeamLoading } = useGetTeamStatusQuery();
    const { data: kaizenFeed, isLoading: isKaizenLoading } = useGetKaizenFeedQuery({ status: 'NEW' });
    const [reviewKaizen] = useReviewKaizenMutation();

    if (isTeamLoading || isKaizenLoading) return <div className="p-8 text-[#030213]/50">Загрузка кабинета руководителя...</div>;

    const handleKaizen = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        let comment = 'Approved for implementation.';
        if (status === 'REJECTED') {
            comment = window.prompt('Укажите обязательный комментарий отказа:') || '';
            if (!comment) return;
        }
        await reviewKaizen({ id, status, comment });
    };

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-medium text-[#030213] tracking-tight">Кабинет руководителя</h1>
                <p className="text-[#717182] mt-1">Развитие психологической безопасности и ритма роста вашей команды.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Column: Team Overview */}
                <div className="md:col-span-8 space-y-8">
                    {/* Team Pulse Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white border border-black/10 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 p-2 opacity-5">
                                <Smile className="w-12 h-12 text-[#030213]" />
                            </div>
                            <div className="flex items-center gap-3 mb-4 text-[#717182]">
                                <Smile className="w-5 h-5 text-amber-500" />
                                <span className="font-medium text-[#717182]">Пульс Счастья Команды</span>
                            </div>
                            <div className="text-4xl font-medium text-[#030213]">
                                {teamStatus?.teamHappiness.average || '—'}
                                <span className="text-sm text-[#717182] font-normal ml-2">/ 10</span>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                                <p className="text-xs text-[#717182]">
                                    На основе {teamStatus?.teamHappiness.sessionCount} сессий.
                                </p>
                                <span className="text-[10px] font-medium text-amber-600 uppercase tracking-widest bg-amber-100 px-2 py-0.5 rounded">
                                    {teamStatus?.teamHappiness.label}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4 text-[#717182]">
                                <Calendar className="w-5 h-5 text-blue-500" />
                                <span className="font-medium text-blue-600">Скорость Ритма</span>
                            </div>
                            <div className="text-4xl font-medium text-[#030213]">
                                {teamStatus?.teamHappiness.sessionCount}
                                <span className="text-sm text-[#717182] font-normal ml-2">сессий / месяц</span>
                            </div>
                            <p className="text-xs text-[#717182] mt-3 italic">
                                Цель: Активное слушание раз в месяц.
                            </p>
                        </div>
                    </div>

                    {/* Kaizen Feed Section */}
                    <div className="bg-white border border-black/10 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between bg-[#F8FAFC]">
                            <div className="flex items-center gap-2 font-medium text-[#030213]">
                                <Lightbulb className="w-5 h-5 text-emerald-500" />
                                <span>Лента Кайдзен (Непрерывное Улучшение)</span>
                            </div>
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full border border-emerald-200">
                                {kaizenFeed?.length || 0} Новых идей
                            </span>
                        </div>
                        <div className="divide-y divide-black/5">
                            {kaizenFeed?.map((item) => (
                                <div key={item.id} className="p-6 space-y-4 hover:bg-[#F8FAFC] transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-[#717182] border border-gray-200">
                                                {item.author.first_name[0]}{item.author.last_name[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-[#030213]">{item.author.first_name} {item.author.last_name}</div>
                                                <div className="text-[10px] text-[#717182] truncate max-w-[150px] uppercase tracking-tighter">{item.author.erp_role.name}</div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-[#717182] uppercase">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="text-sm text-[#030213] leading-relaxed bg-[#F3F3F5] p-3 rounded-lg border border-black/5">
                                        "{item.text}"
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleKaizen(item.id, 'APPROVED')}
                                            className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-3 h-3" /> Одобрить
                                        </button>
                                        <button
                                            onClick={() => handleKaizen(item.id, 'REJECTED')}
                                            className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-medium text-red-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <XCircle className="w-3 h-3" /> Отклонить
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {kaizenFeed?.length === 0 && (
                                <div className="p-12 text-center text-[#717182] text-sm italic">
                                    Нет предложений по улучшению.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions & Schedule */}
                <div className="md:col-span-4 space-y-6">
                    {/* Pending Meetings */}
                    <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-indigo-600 font-medium mb-6">
                            <Calendar className="w-5 h-5" />
                            <span>Предстоящие 1 на 1</span>
                        </div>
                        <div className="space-y-4">
                            {teamStatus?.pendingMeetings.map((meeting) => (
                                <div key={meeting.id} className="bg-[#F8FAFC] rounded-xl p-3 border border-black/5">
                                    <div className="text-sm font-medium text-[#030213]">{meeting.employeeName}</div>
                                    <div className="text-xs text-[#717182] mt-1 flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(meeting.scheduledAt).toLocaleDateString()} в {new Date(meeting.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <button className="w-full mt-3 py-2 bg-white hover:bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-medium text-indigo-600 transition-all flex items-center justify-center gap-2 shadow-sm">
                                        <MessageSquare className="w-3 h-3" />
                                        Записать детали встречи
                                    </button>
                                </div>
                            ))}
                            {teamStatus?.pendingMeetings.length === 0 && (
                                <div className="text-center py-6 text-[#717182] text-sm italic">
                                    Все ритмы синхронизированы. Нет предстоящих встреч.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Guidance Alert */}
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                        <h4 className="text-amber-800 font-medium text-sm mb-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Менеджерский Канон
                        </h4>
                        <p className="text-xs text-amber-700/80 leading-relaxed">
                            Помните: 1 на 1 — для сотрудника. Используйте это время, чтобы устранить препятствия и выслушать, а не просто для проверки статуса. Эмоциональный фон — это мягкий сигнал: реагируйте на спады вовремя и с заботой.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
