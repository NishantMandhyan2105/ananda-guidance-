import React, { useState } from 'react';
import { 
  Calendar, Clock, CheckSquare, Search, 
  Filter, UserCheck, MessageSquare, ArrowRight 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/StatusBadge';

export const InteractionHistory: React.FC = () => {
  const { interactions, users, actionItems } = useData();
  const { currentUser, role } = useAuth();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Role scoping:
  // Mentors only see their own interactions
  // Juniors only see their own interactions
  // Admins & Coordinators see all
  const visibleInteractions = interactions.filter(i => {
    if (role === 'mentor') return i.mentor_id === currentUser?.id;
    if (role === 'junior') return i.junior_id === currentUser?.id;
    return true;
  }).filter(i => {
    if (typeFilter !== 'all' && i.interaction_type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const m = users.find(u => u.id === i.mentor_id);
      const j = users.find(u => u.id === i.junior_id);
      const matchMentor = m?.name.toLowerCase().includes(q);
      const matchJunior = j?.name.toLowerCase().includes(q);
      const matchTopic = i.topics.some(t => t.toLowerCase().includes(q));
      const matchSummary = i.discussion_summary.toLowerCase().includes(q);
      if (!matchMentor && !matchJunior && !matchTopic && !matchSummary) return false;
    }
    return true;
  }).sort((a, b) => new Date(b.interaction_date).getTime() - new Date(a.interaction_date).getTime());

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-teal-700" />
            <h2 className="text-xl font-bold text-slate-900">Mentoring Interactions Log</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chronological documentation of guidance discussions, learning takeaways, and 1–2 agreed action items
          </p>
        </div>

        <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
          {visibleInteractions.length} Sessions Recorded
        </span>
      </div>

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student, mentor, or topic discussed..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="all">All Modes</option>
            <option value="in_person">In Person</option>
            <option value="online">Online</option>
            <option value="phone">Phone</option>
            <option value="group">Group</option>
          </select>
        </div>
      </div>

      {/* Interaction Cards */}
      <div className="space-y-4">
        {visibleInteractions.map(interaction => {
          const mentor = users.find(u => u.id === interaction.mentor_id);
          const junior = users.find(u => u.id === interaction.junior_id);
          const linkedActions = actionItems.filter(a => a.interaction_id === interaction.id);

          return (
            <div
              key={interaction.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {mentor?.name} (Senior) ↔ {junior?.name} (Junior)
                    </h3>
                    <p className="text-xs text-slate-500">
                      {interaction.interaction_date} • {interaction.duration} mins • <span className="capitalize">{interaction.interaction_type.replace('_', ' ')}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {interaction.topics.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Discussion Summary & Learning Outcome */}
              <div className="mt-3.5 space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Discussion Summary:
                  </span>
                  <p className="text-slate-700 leading-relaxed font-normal">
                    {interaction.discussion_summary}
                  </p>
                </div>

                <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 text-xs">
                  <span className="text-[10px] uppercase font-bold text-teal-800 block mb-1">
                    Key Learning Outcome:
                  </span>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {interaction.learning_outcome}
                  </p>
                </div>

                {/* Agreed Action Items (Max 2!) */}
                {linkedActions.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Agreed Next Actions ({linkedActions.length}/2):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {linkedActions.map(action => (
                        <div key={action.id} className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs flex justify-between items-center">
                          <div>
                            <p className="font-medium text-slate-900 line-clamp-1">{action.description}</p>
                            <span className="text-[10px] text-slate-400">Due: {action.due_date}</span>
                          </div>
                          <StatusBadge status={action.status} size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next Date */}
                {interaction.next_interaction_date && (
                  <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
                    <span>Planned Next Session:</span>
                    <span className="font-bold text-teal-700">{interaction.next_interaction_date}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {visibleInteractions.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <Calendar className="w-10 h-10 mx-auto text-teal-600 mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-700">No interaction records match your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
