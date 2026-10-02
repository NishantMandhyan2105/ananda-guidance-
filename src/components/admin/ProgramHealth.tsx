import React from 'react';
import { ProgramHealthMetrics } from '../../types';
import { Activity, CheckCircle, TrendingUp } from 'lucide-react';

interface ProgramHealthProps {
  metrics: ProgramHealthMetrics;
}

export const ProgramHealth: React.FC<ProgramHealthProps> = ({ metrics }) => {
  const indicators = [
    { label: 'Mentor Participation', value: metrics.mentor_participation, target: '80%' },
    { label: 'Junior Participation', value: metrics.junior_participation, target: '75%' },
    { label: 'Matching Completion', value: metrics.matching_completion, target: '90%' },
    { label: 'Interaction Completion', value: metrics.interaction_completion, target: '85%' },
    { label: 'Goal Setting Rate', value: metrics.goal_setting_rate, target: '90%' },
    { label: 'Action Completion', value: metrics.action_completion_rate, target: '70%' },
    { label: 'Feedback Response', value: metrics.feedback_response_rate, target: '80%' },
    { label: 'Escalation Resolution', value: metrics.escalation_resolution_rate, target: '95%' }
  ];

  const getBarColor = (val: number) => {
    if (val >= 80) return 'bg-emerald-500';
    if (val >= 60) return 'bg-teal-500';
    if (val >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-teal-700" />
            <h3 className="text-base font-bold text-slate-900">Program Health & Vitality</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Key operational health indicators across senior mentors and junior cohorts
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Health</span>
            <span className="text-xl font-black text-teal-800">{metrics.overall_health_score}%</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
            {metrics.overall_health_score >= 75 ? 'GOOD' : metrics.overall_health_score >= 55 ? 'MOD' : 'ATTN'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {indicators.map((item, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-slate-700 truncate">{item.label}</span>
              <span className="font-bold text-slate-900">{item.value}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(item.value)}`}
                style={{ width: `${Math.min(100, Math.max(0, item.value))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Target: {item.target}</span>
              <span>{item.value >= 70 ? 'On Track' : 'Needs Push'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
