import React, { useState } from 'react';
import { 
  Compass, Calendar, CheckSquare, Clock, 
  HeartHandshake, Plus, ArrowRight, User as UserIcon, 
  Sparkles, CheckCircle2 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { RecordInteractionModal } from './RecordInteractionModal';
import { StatusBadge } from '../common/StatusBadge';

interface MentorDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({ onNavigateTab }) => {
  const { users, matches, interactions, actionItems, juniorProfiles } = useData();
  const { currentUser } = useAuth();

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedJuniorForRecord, setSelectedJuniorForRecord] = useState<string | undefined>(undefined);

  // My assigned junior matches
  const myMatches = matches.filter(
    m => m.mentor_id === currentUser?.id && m.status === 'active'
  );

  const myJuniors = myMatches.map(m => {
    const user = users.find(u => u.id === m.junior_id);
    const profile = juniorProfiles.find(p => p.user_id === m.junior_id);
    const juniorInteractions = interactions
      .filter(i => i.mentor_id === currentUser?.id && i.junior_id === m.junior_id)
      .sort((a, b) => new Date(b.interaction_date).getTime() - new Date(a.interaction_date).getTime());
    
    const lastInteraction = juniorInteractions[0];
    const nextDate = lastInteraction?.next_interaction_date;

    const juniorActions = actionItems.filter(a => a.junior_id === m.junior_id);
    const pendingActions = juniorActions.filter(a => a.status === 'pending' || a.status === 'in_progress');
    const overdueActions = juniorActions.filter(a => a.status === 'overdue');

    return {
      match: m,
      user,
      profile,
      interactionsCount: juniorInteractions.length,
      lastInteraction,
      nextDate,
      pendingActionsCount: pendingActions.length,
      overdueActionsCount: overdueActions.length,
      totalActionsCount: juniorActions.length
    };
  });

  const totalActionsForMyJuniors = actionItems.filter(a => 
    myMatches.some(m => m.junior_id === a.junior_id)
  );

  const pendingActionsCount = totalActionsForMyJuniors.filter(
    a => a.status === 'pending' || a.status === 'in_progress'
  ).length;

  const completedActionsCount = totalActionsForMyJuniors.filter(
    a => a.status === 'completed'
  ).length;

  // Upcoming interactions scheduled
  const upcomingCount = myJuniors.filter(j => j.nextDate && new Date(j.nextDate) >= new Date()).length;

  return (
    <div className="space-y-6 text-left">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Welcome, {currentUser?.name}
            </h1>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full uppercase">
              Senior Mentor
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Senior–Junior Guidance Hub • &ldquo;Help your junior understand what to do next.&rdquo;
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedJuniorForRecord(undefined);
            setIsRecordModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-teal-700/20"
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Record Interaction</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block">My Juniors</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{myJuniors.length}</span>
          <span className="text-[11px] text-slate-500">First-semester mentees</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block">Upcoming Check-ins</span>
          <span className="text-2xl font-black text-indigo-700 mt-1 block">{upcomingCount}</span>
          <span className="text-[11px] text-slate-500">Scheduled next sessions</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block">Pending Actions</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{pendingActionsCount}</span>
          <span className="text-[11px] text-slate-500">In-progress student tasks</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block">Completed Actions</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{completedActionsCount}</span>
          <span className="text-[11px] text-slate-500">Milestones achieved</span>
        </div>
      </div>

      {/* My Juniors Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">My Assigned Juniors</h2>
          <span className="text-xs text-slate-400">{myJuniors.length} active guidance relationship(s)</span>
        </div>

        {myJuniors.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <Compass className="w-10 h-10 mx-auto text-teal-600 mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-700">No junior students assigned yet.</p>
            <p className="text-xs mt-1">The university coordinator will pair you with first-semester students shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myJuniors.map(({ user, profile, interactionsCount, lastInteraction, nextDate, pendingActionsCount, overdueActionsCount }) => {
              if (!user) return null;

              return (
                <div key={user.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow text-left flex flex-col justify-between">
                  <div>
                    {/* Top Identity Row */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{user.name}</h3>
                          <p className="text-xs text-slate-500">{user.program} • Sem 1</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">{user.student_id}</span>
                    </div>

                    {/* Current Goal Box */}
                    <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Current Mentoring Goal:
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        &ldquo;{profile?.current_goal || 'Goal to be defined during first session.'}&rdquo;
                      </p>
                    </div>

                    {/* Progress details */}
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div className="p-2.5 bg-slate-50/50 rounded-lg">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Last Interaction</span>
                        <span className="font-semibold text-slate-800">
                          {lastInteraction ? lastInteraction.interaction_date : 'None yet'}
                        </span>
                      </div>
                      <div className="p-2.5 bg-slate-50/50 rounded-lg">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Next Session</span>
                        <span className="font-semibold text-teal-700">
                          {nextDate || 'Not scheduled'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Action Status:</span>
                      <div className="flex items-center space-x-2">
                        {overdueActionsCount > 0 && (
                          <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                            {overdueActionsCount} Overdue
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          {pendingActionsCount} Pending
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{interactionsCount} past session(s)</span>
                    <button
                      onClick={() => {
                        setSelectedJuniorForRecord(user.id);
                        setIsRecordModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center space-x-1"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Record Interaction</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Record Interaction Modal */}
      <RecordInteractionModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        preselectedJuniorId={selectedJuniorForRecord}
      />
    </div>
  );
};
