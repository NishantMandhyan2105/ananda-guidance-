import React from 'react';
import { 
  Users, UserCheck, Calendar, CheckSquare, 
  Star, Flag, Award, Sparkles, TrendingUp, 
  ArrowUpRight, AlertCircle, BarChart3 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, Legend, 
  LineChart, Line 
} from 'recharts';
import { useData } from '../../context/DataContext';
import { computeAnalytics, AttentionItem } from '../../services/analyticsService';
import { ProgramHealth } from './ProgramHealth';
import { AttentionRequired } from '../common/AttentionRequired';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
  onSelectItemAlert: (item: AttentionItem) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onNavigateTab, 
  onSelectItemAlert 
}) => {
  const { 
    users, matches, interactions, actionItems, 
    monthlyPulses, escalations, successStories, 
    juniorProfiles, programSettings 
  } = useData();

  const analytics = computeAnalytics(
    users, matches, interactions, actionItems, 
    monthlyPulses, escalations, successStories, 
    juniorProfiles, programSettings
  );

  const { kpis, healthMetrics, attentionList, charts } = analytics;

  return (
    <div className="space-y-6 text-left">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">ĀNANDA Dashboard</h1>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full uppercase">
              Super Admin
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            90-Day Senior–Junior Guidance Program • Institutional Progress Monitor
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigateTab('pilot')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs"
          >
            <span>90-Day Pilot Tracker</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button
            onClick={() => onNavigateTab('matching')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-md shadow-teal-700/20"
          >
            <span>Matching Center</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-teal-200" />
          </button>
        </div>
      </div>

      {/* Attention Required Alert Widget */}
      <AttentionRequired
        items={attentionList}
        onSelectItem={onSelectItemAlert}
      />

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Participation */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Mentors</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.totalMentors}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Seniors registered</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Juniors</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.totalJuniors}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">1st semester cohort</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Active Groups</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.activeMatches}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
            {kpis.inactiveGroupsCount > 0 ? `${kpis.inactiveGroupsCount} need review` : 'All active'}
          </p>
        </div>

        {/* Engagement */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Interactions</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.interactionsCompleted}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">{kpis.interactionCompletionRate}% completion</p>
        </div>

        {/* Progress */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Actions Done</span>
            <CheckSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.actionsCompleted}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">{kpis.actionCompletionRate}% rate ({kpis.overdueActionsCount} overdue)</p>
        </div>

        {/* Experience */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Avg Usefulness</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.avgUsefulness} <span className="text-xs font-semibold text-slate-400">/ 5.0</span></div>
          <p className="text-[11px] text-slate-400 mt-0.5">Goal clarity: {kpis.avgGoalClarity}/5</p>
        </div>
      </div>

      {/* Program Health Component */}
      <ProgramHealth metrics={healthMetrics} />

      {/* Recharts Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interaction Activity Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Interaction Velocity</h3>
              <p className="text-xs text-slate-500">Monthly mentoring sessions completed vs scheduled</p>
            </div>
            <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">
              {kpis.interactionsCompleted} Total
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.interactionsByMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="completed" fill="#0d9488" name="Completed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="missed" fill="#f43f5e" name="Missed / Needs Reschedule" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Junior Feedback Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Junior Feedback & Clarity</h3>
              <p className="text-xs text-slate-500">Usefulness (1-5) and next step clarity distribution</p>
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              {kpis.totalPulses} Pulses
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.usefulnessDist} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="rating" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" name="Usefulness Ratings" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Comparison */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Departmental Cohort Breakdown</h3>
              <p className="text-xs text-slate-500">Mentors, juniors, active matches, and action completion rates</p>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              View Full Report →
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.departmentStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="juniors" fill="#0284c7" name="Junior Students" radius={[4, 4, 0, 0]} />
                <Bar dataKey="matches" fill="#0d9488" name="Active Matches" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actionsCompleted" fill="#10b981" name="Actions Completed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
