import React from 'react';
import {
    useGetTeamStatusQuery
} from '../features/gamification/growthApi';
import {
    Users,
    Calendar,
    TrendingUp,
    Smile,
    ExternalLink,
    ChevronRight,
    MessageSquare
} from 'lucide-react';

const ManagerDashboard: React.FC = () => {
    const { data: teamStatus, isLoading } = useGetTeamStatusQuery();

    if (isLoading) return <div className="p-8 text-white/50">Loading manager hub...</div>;

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
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                            <div className="flex items-center gap-3 mb-4 text-white/70">
                                <Smile className="w-5 h-5 text-amber-400" />
                                <span className="font-medium">Team Happiness Pulse</span>
                            </div>
                            <div className="text-4xl font-bold text-white">
                                {teamStatus?.teamHappinessTrend === 'NO_DATA' ? '—' : teamStatus?.teamHappinessTrend}
                                <span className="text-sm text-white/30 font-normal ml-2">/ 10</span>
                            </div>
                            <p className="text-xs text-white/40 mt-3">
                                Soft signal based on average emotional tone from 1-on-1s.
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                            <div className="flex items-center gap-3 mb-4 text-white/70">
                                <Calendar className="w-5 h-5 text-blue-400" />
                                <span className="font-medium">Rhythm Velocity</span>
                            </div>
                            <div className="text-4xl font-bold text-white">
                                {teamStatus?.sessionCount30d}
                                <span className="text-sm text-white/30 font-normal ml-2">sessions / month</span>
                            </div>
                            <p className="text-xs text-white/40 mt-3">
                                Target: Minimum 1 session per mentee monthly.
                            </p>
                        </div>
                    </div>

                    {/* Mentees List */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2 font-semibold text-white">
                                <Users className="w-5 h-5 text-indigo-400" />
                                <span>Direct Reports & Mentees</span>
                            </div>
                            <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-full">
                                {teamStatus?.mentees.length || 0} People
                            </span>
                        </div>
                        <div className="divide-y divide-white/10">
                            {teamStatus?.mentees.map((mentee) => (
                                <div key={mentee.id} className="p-4 flex items-center justify-between hover:bg-white/10 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 overflow-hidden">
                                            {mentee.avatar ? (
                                                <img src={mentee.avatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <Users className="w-5 h-5 text-indigo-400" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{mentee.first_name} {mentee.last_name}</div>
                                            <div className="text-xs text-white/40">{mentee.role?.name || 'Team Member'}</div>
                                        </div>
                                    </div>
                                    <button className="p-2 text-white/30 group-hover:text-white transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
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
