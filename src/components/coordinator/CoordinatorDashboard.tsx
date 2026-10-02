import React from 'react';
import { 
  Users, UserCheck, Calendar, Clock, Flag, 
  CheckSquare, ArrowUpRight, AlertTriangle 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { computeAnalytics, AttentionItem } from '../../services/analyticsService';
import { AttentionRequired } from '../common/AttentionRequired';

interface CoordinatorDashboardProps {
  onNavigateTab: (tab: string) => void;
  onSelectItemAlert: (item: AttentionItem) => void;
}

export const CoordinatorDashboard: React.FC<CoordinatorDashboardProps> = ({ 
  onNavigateTab, 
  onSelectItemAlert 
}) => {
  const { 
    users, matches, interactions, actionItems, 
    monthlyPulses, escalations, successStories, 
    juniorProfiles, programSettings 
  } = useData();
  const { currentUser } = useAuth();

  const dept = currentUser?.department || 'Computer Science & Engineering';

  // Scope data to coordinator's department
  const deptUsers = users.filter(u => u.department === dept || u.role === 'admin');
  const deptMentors = deptUsers.filter(u => u.role === 'mentor');
  const deptJuniors = deptUsers.filter(u => u.role === 'junior');

  const deptMatches = matches.filter(m => {
    const j = users.find(u => u.id === m.junior_id);
    return j?.department === dept;
  });

  const deptInteractions = interactions.filter(i => {
    const j = users.find(u => u.id === i.junior_id);
    return j?.department === dept;
  });

  const deptActions = actionItems.filter(a => {
    const j = users.find(u => u.id === a.junior_id);
    return j?.department === dept;
  });

  const deptPulses = monthlyPulses.filter(p => {
    const j = users.find(u => u.id === p.junior_id);
    return j?.department === dept;
  });

  const deptEscalations = escalations.filter(e => {
    const j = users.find(u => u.id === e.junior_id);
    return j?.department === dept;
  });

  const analytics = computeAnalytics(
    deptUsers, deptMatches, deptInteractions, deptActions, 
    deptPulses, deptEscalations, successStories, 
    juniorProfiles, programSettings
  );

  const { kpis, attentionList, inactiveMatches } = analytics;

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Department Coordinator</h1>
            <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase">
              {dept}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Program health, inactive group alerts, and student support monitoring for {dept}
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('reports')}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 shadow-md shadow-teal-700/20"
        >
          <span>Department Report</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Attention Required alert */}
      <AttentionRequired
        items={attentionList}
        onSelectItem={onSelectItemAlert}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block">Department Mentors</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{deptMentors.length}</span>
          <span className="text-[11px] text-slate-500">{deptMatches.filter(m => m.status === 'active').length} actively paired</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block">Junior Cohort</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{deptJuniors.length}</span>
          <span className="text-[11px] text-teal-600 font-semibold">{kpis.juniorsWithGoal} with goals set</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block">Action Completion</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{kpis.actionCompletionRate}%</span>
          <span className="text-[11px] text-slate-500">{kpis.actionsCompleted} / {kpis.actionsAssigned} completed</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block">Department Escalations</span>
          <span className="text-2xl font-black text-rose-600 mt-1 block">{kpis.openEscalationsCount}</span>
          <span className="text-[11px] text-slate-500">{kpis.resolvedEscalationsCount} resolved cases</span>
        </div>
      </div>

      {/* Inactive Groups Needing Attention Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Groups Needing Coordinator Follow-Up ({inactiveMatches.length})
            </h3>
            <p className="text-xs text-slate-500">
              Groups with no recorded interaction beyond the {programSettings.interaction_threshold_days}-day threshold
            </p>
          </div>
        </div>

        {inactiveMatches.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            All department mentor-junior groups have active interactions within the configured threshold!
          </div>
        ) : (
          <div className="space-y-2.5">
            {inactiveMatches.map(({ match, daysSinceLast }) => {
              const mentor = users.find(u => u.id === match.mentor_id);
              const junior = users.find(u => u.id === match.junior_id);

              return (
                <div key={match.id} className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      !
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {mentor?.name} (Senior) ↔ {junior?.name} (1st Sem)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {junior?.program} • Last interaction: {daysSinceLast} days ago
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      Needs Attention
                    </span>
                    <button
                      onClick={() => onNavigateTab('interactions')}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl"
                    >
                      Inspect Logs
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
