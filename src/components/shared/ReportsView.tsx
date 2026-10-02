import React, { useState } from 'react';
import { 
  FileText, Download, Printer, Filter, 
  BarChart, CheckCircle2, TrendingUp 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { computeAnalytics } from '../../services/analyticsService';
import { 
  exportProgramReportCSV, exportDepartmentReportCSV, 
  exportMentorActivityReportCSV, exportJuniorProgressCSV 
} from '../../services/exportService';

export const ReportsView: React.FC = () => {
  const { 
    users, matches, interactions, actionItems, 
    monthlyPulses, escalations, successStories, 
    juniorProfiles, programSettings 
  } = useData();

  const [reportType, setReportType] = useState<'program' | 'department' | 'mentor' | 'junior'>('program');
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const analytics = computeAnalytics(
    users, matches, interactions, actionItems, 
    monthlyPulses, escalations, successStories, 
    juniorProfiles, programSettings
  );

  const { kpis, charts } = analytics;
  const mentors = users.filter(u => u.role === 'mentor');
  const juniors = users.filter(u => u.role === 'junior');
  const departments = Array.from(new Set(users.map(u => u.department))).filter(Boolean);

  const handleExportCSV = () => {
    switch (reportType) {
      case 'program':
        exportProgramReportCSV(kpis, programSettings.program_name);
        break;
      case 'department':
        exportDepartmentReportCSV(charts.departmentStats);
        break;
      case 'mentor':
        exportMentorActivityReportCSV(mentors, matches, interactions, users);
        break;
      case 'junior':
        exportJuniorProgressCSV(juniors, matches, actionItems, monthlyPulses, users);
        break;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4 no-print">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-teal-700" />
            <h2 className="text-xl font-bold text-slate-900">Institutional Reporting Center</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official evaluation summaries, progress audits, and CSV exports for the 90-day pilot
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-teal-700/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector (Hidden on Print) */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 no-print">
        {[
          { id: 'program', label: 'Program Executive Report' },
          { id: 'department', label: 'Departmental Breakdown' },
          { id: 'mentor', label: 'Mentor Activity Report' },
          { id: 'junior', label: 'Junior Progress Dossier' }
        ].map(r => (
          <button
            key={r.id}
            onClick={() => setReportType(r.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              reportType === r.id
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* REPORT CONTENT (Optimized for both screen & print) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Printable Letterhead */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-black text-slate-900">
                ĀNANDA: Senior–Junior Guidance Connect
              </h1>
              <p className="text-xs font-semibold text-teal-800 uppercase tracking-widest mt-0.5">
                BELONG • LEARN • CARE • GROW
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Institutional Pilot Evaluation Report • Dean of Student Welfare & Academic Council
              </p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p>Generated: {new Date().toLocaleDateString()}</p>
              <p className="font-semibold text-slate-600">Pilot Phase: Month 2 (Active)</p>
            </div>
          </div>
        </div>

        {/* 1. Program Executive Report */}
        {reportType === 'program' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Executive Overview & Program Health
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Mentors</span>
                <span className="text-xl font-black text-slate-900">{kpis.totalMentors}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Juniors</span>
                <span className="text-xl font-black text-slate-900">{kpis.totalJuniors}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Groups</span>
                <span className="text-xl font-black text-slate-900">{kpis.activeMatches}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Interactions</span>
                <span className="text-xl font-black text-slate-900">{kpis.interactionsCompleted}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Students With Goals</span>
                <span className="text-xl font-black text-teal-800">{kpis.juniorsWithGoal} / {kpis.totalJuniors}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Action Completion</span>
                <span className="text-xl font-black text-emerald-700">{kpis.actionCompletionRate}%</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Usefulness (1-5)</span>
                <span className="text-xl font-black text-amber-600">{kpis.avgUsefulness} / 5.0</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Goal Clarity</span>
                <span className="text-xl font-black text-indigo-700">{kpis.avgGoalClarity} / 5.0</span>
              </div>
            </div>

            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 text-xs text-slate-700 leading-relaxed">
              <strong>Evaluation Summary:</strong> The ĀNANDA pilot has achieved high engagement across first-semester 
              students with an average guidance usefulness rating of {kpis.avgUsefulness}/5. 
              {kpis.inactiveGroupsCount > 0 ? `Currently, ${kpis.inactiveGroupsCount} group(s) have been flagged for coordinator follow-up due to inactivity beyond ${programSettings.interaction_threshold_days} days.` : 'All paired mentor groups have maintained active contact.'}
            </div>
          </div>
        )}

        {/* 2. Department Report */}
        {reportType === 'department' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Academic Unit & Departmental Performance
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Department</th>
                    <th className="py-2.5 px-4">Mentors</th>
                    <th className="py-2.5 px-4">Juniors</th>
                    <th className="py-2.5 px-4">Active Pairs</th>
                    <th className="py-2.5 px-4">Actions Done</th>
                    <th className="py-2.5 px-4">Completion Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {charts.departmentStats.map((d, i) => (
                    <tr key={i}>
                      <td className="py-3 px-4 font-bold text-slate-900">{d.department}</td>
                      <td className="py-3 px-4">{d.mentors}</td>
                      <td className="py-3 px-4">{d.juniors}</td>
                      <td className="py-3 px-4">{d.matches}</td>
                      <td className="py-3 px-4">{d.actionsCompleted}</td>
                      <td className="py-3 px-4 font-bold text-teal-700">{d.completionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Mentor Activity Report */}
        {reportType === 'mentor' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Senior Mentor Activity Audit
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Mentor Name</th>
                    <th className="py-2.5 px-4">ID</th>
                    <th className="py-2.5 px-4">Program</th>
                    <th className="py-2.5 px-4">Assigned Juniors</th>
                    <th className="py-2.5 px-4">Interactions Logged</th>
                    <th className="py-2.5 px-4">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mentors.map(m => {
                    const assigned = matches.filter(match => match.mentor_id === m.id && match.status === 'active');
                    const mInteractions = interactions
                      .filter(i => i.mentor_id === m.id)
                      .sort((a, b) => new Date(b.interaction_date).getTime() - new Date(a.interaction_date).getTime());
                    
                    return (
                      <tr key={m.id}>
                        <td className="py-3 px-4 font-bold text-slate-900">{m.name}</td>
                        <td className="py-3 px-4 text-slate-500">{m.student_id}</td>
                        <td className="py-3 px-4">{m.program}</td>
                        <td className="py-3 px-4 font-semibold text-teal-800">{assigned.length} Junior(s)</td>
                        <td className="py-3 px-4">{mInteractions.length}</td>
                        <td className="py-3 px-4 text-slate-500">
                          {mInteractions[0] ? mInteractions[0].interaction_date : 'None'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. Junior Progress Dossier */}
        {reportType === 'junior' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              4. Junior Cohort Progress Dossier
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Student</th>
                    <th className="py-2.5 px-4">ID</th>
                    <th className="py-2.5 px-4">Program</th>
                    <th className="py-2.5 px-4">Assigned Mentor</th>
                    <th className="py-2.5 px-4">Actions Completed</th>
                    <th className="py-2.5 px-4">Latest Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {juniors.map(j => {
                    const activeMatch = matches.find(m => m.junior_id === j.id && m.status === 'active');
                    const mentor = activeMatch ? users.find(u => u.id === activeMatch.mentor_id) : null;
                    const jActions = actionItems.filter(a => a.junior_id === j.id);
                    const completed = jActions.filter(a => a.status === 'completed').length;
                    const pulse = monthlyPulses.find(p => p.junior_id === j.id);

                    return (
                      <tr key={j.id}>
                        <td className="py-3 px-4 font-bold text-slate-900">{j.name}</td>
                        <td className="py-3 px-4 text-slate-500">{j.student_id}</td>
                        <td className="py-3 px-4">{j.program}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {mentor ? mentor.name : <span className="text-amber-600">Unmatched</span>}
                        </td>
                        <td className="py-3 px-4">
                          {completed} / {jActions.length}
                        </td>
                        <td className="py-3 px-4 font-semibold text-teal-800">
                          {pulse ? `${pulse.usefulness_rating} / 5` : 'Pending'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
