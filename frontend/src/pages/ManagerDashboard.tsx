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

    if (isTeamLoading || isKaizenLoading) return <div className="p-8 text-white/50">Loading manager hub...</div>;

    const handleKaizen = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        let comment = 'Approved for implementation.';
        if (status === 'REJECTED') {
            comment = window.prompt('Please provide a mandatory rejection comment:') || '';
            if (!comment) return;
        }
        await reviewKaizen({ id, status, comment });
    };

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Manager Hub</h1>
                <p className="text-white/50 mt-1">Nurturing your team's psychological safety and growth rhythm.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Column: Team Overview */}
                <div className="md:col-span-8 space-y-8">
                    {/* Team Pulse Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-20">
                                <Smile className="w-12 h-12" />
                            </div>
                            <div className="flex items-center gap-3 mb-4 text-white/70">
                                <Smile className="w-5 h-5 text-amber-400" />
                                <span className="font-medium text-amber-200">Team Happiness Pulse</span>
                            </div>
                            <div className="text-4xl font-bold text-white">
                                {teamStatus?.teamHappiness.average || '—'}
                                <span className="text-sm text-white/30 font-normal ml-2">/ 10</span>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                                <p className="text-xs text-white/40">
                                    Based on {teamStatus?.teamHappiness.sessionCount} sessions.
                                </p>
                                <span className="text-[10px] font-bold text-amber-400/60 uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded">
                                    {teamStatus?.teamHappiness.label}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                            <div className="flex items-center gap-3 mb-4 text-white/70">
                                <Calendar className="w-5 h-5 text-blue-400" />
                                <span className="font-medium text-blue-200">Rhythm Velocity</span>
                            </div>
                            <div className="text-4xl font-bold text-white">
                                {teamStatus?.teamHappiness.sessionCount}
                                <span className="text-sm text-white/30 font-normal ml-2">sessions / month</span>
                            </div>
                            <p className="text-xs text-white/40 mt-3 italic">
                                Target: Active listening once per month per mentee.
                            </p>
                        </div>
                    </div>

                    {/* Kaizen Feed Section */}
                    <div className="bg-white/5 border border-emerald-500/20 rounded-2xl overflow-hidden backdrop-blur-md">
                        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-emerald-500/10">
                            <div className="flex items-center gap-2 font-semibold text-white">
                                <Lightbulb className="w-5 h-5 text-emerald-400" />
                                <span>Kaizen Feed (Continuous Improvement)</span>
                            </div>
                            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full border border-emerald-500/30">
                                {kaizenFeed?.length || 0} New Ideas
                            </span>
                        </div>
                        <div className="divide-y divide-white/10">
                            {kaizenFeed?.map((item) => (
                                <div key={item.id} className="p-6 space-y-4 hover:bg-white/5 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/50">
                                                {item.author.first_name[0]}{item.author.last_name[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-white">{item.author.first_name} {item.author.last_name}</div>
                                                <div className="text-[10px] text-white/30 truncate max-w-[150px] uppercase tracking-tighter">{item.author.erp_role.name}</div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-white/20 uppercase">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="text-sm text-white/70 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                                        "{item.text}"
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleKaizen(item.id, 'APPROVED')}
                                            className="flex-1 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-lg text-xs font-bold text-emerald-200 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-3 h-3" /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleKaizen(item.id, 'REJECTED')}
                                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-xs font-bold text-red-300 transition-all flex items-center justify-center gap-2"
                                        >
                                            <XCircle className="w-3 h-3" /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {kaizenFeed?.length === 0 && (
                                <div className="p-12 text-center text-white/20 text-sm italic">
                                    No new improvement suggestions at the moment.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions & Schedule */}
                <div className="md:col-span-4 space-y-6">
                    {/* Pending Meetings */}
                    <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-indigo-300 font-semibold mb-6">
                            <Calendar className="w-5 h-5" />
                            <span>Approaching 1-on-1s</span>
                        </div>
                        <div className="space-y-4">
                            {teamStatus?.pendingMeetings.map((meeting) => (
                                <div key={meeting.id} className="bg-white/5 rounded-xl p-3 border border-white/10">
                                    <div className="text-sm font-medium text-white">{meeting.employeeName}</div>
                                    <div className="text-xs text-white/50 mt-1 flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(meeting.scheduledAt).toLocaleDateString()} at {new Date(meeting.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <button className="w-full mt-3 py-2 bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/30 rounded-lg text-xs font-medium text-indigo-200 transition-all flex items-center justify-center gap-2">
                                        <MessageSquare className="w-3 h-3" />
                                        Log Meeting Details
                                    </button>
                                </div>
                            ))}
                            {teamStatus?.pendingMeetings.length === 0 && (
                                <div className="text-center py-6 text-white/30 text-sm italic">
                                    All rhythms sync'd. No pending meetings.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Guidance Alert */}
                    <div className="bg-amber-400/10 border border-amber-400/20 rounded-2xl p-5">
                        <h4 className="text-amber-300 font-bold text-sm mb-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Managerial Canon
                        </h4>
                        <p className="text-xs text-amber-200/60 leading-relaxed">
                            Remember: 1-on-1s are for the employee. Use this time to unblock their progress and listen, not just to status check. Emotional tone is a soft signal – address drops early with care.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
