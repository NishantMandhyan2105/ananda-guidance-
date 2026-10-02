import React, { useState } from 'react';
import { 
  Compass, CheckSquare, Calendar, Star, 
  HelpCircle, Sparkles, Check, Edit2, ShieldAlert, 
  ArrowRight, HeartHandshake, CheckCircle2 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { MonthlyPulseModal } from './MonthlyPulseModal';
import { RequestGuidanceModal } from './RequestGuidanceModal';
import { Modal } from '../common/Modal';

export const JuniorDashboard: React.FC = () => {
  const { 
    users, matches, interactions, actionItems, 
    monthlyPulses, mentorProfiles, juniorProfiles, 
    updateJuniorProfile, toggleActionStatus 
  } = useData();
  const { currentUser } = useAuth();

  const [isPulseModalOpen, setIsPulseModalOpen] = useState(false);
  const [isGuidanceModalOpen, setIsGuidanceModalOpen] = useState(false);
  const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState(false);

  // My profile and active match
  const myProfile = juniorProfiles.find(p => p.user_id === currentUser?.id);
  const myActiveMatch = matches.find(m => m.junior_id === currentUser?.id && m.status === 'active');
  const myMentor = myActiveMatch ? users.find(u => u.id === myActiveMatch.mentor_id) : null;
  const myMentorProfile = myMentor ? mentorProfiles.find(p => p.user_id === myMentor.id) : null;

  // My interactions with mentor
  const myInteractions = interactions
    .filter(i => i.junior_id === currentUser?.id)
    .sort((a, b) => new Date(b.interaction_date).getTime() - new Date(a.interaction_date).getTime());

  const lastInteraction = myInteractions[0];
  const nextInteractionDate = lastInteraction?.next_interaction_date;

  // My action items
  const myActions = actionItems
    .filter(a => a.junior_id === currentUser?.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const pendingActions = myActions.filter(a => a.status === 'pending' || a.status === 'in_progress');
  const completedActions = myActions.filter(a => a.status === 'completed');
  const actionCompletionRate = myActions.length > 0 
    ? Math.round((completedActions.length / myActions.length) * 100) 
    : 0;

  // Latest Pulse
  const currentMonth = new Date().toISOString().slice(0, 7);
  const myCurrentMonthPulse = monthlyPulses.find(p => p.junior_id === currentUser?.id && p.month === currentMonth);

  // Goal edit state
  const [newGoal, setNewGoal] = useState(myProfile?.current_goal || '');

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newGoal.trim()) return;
    updateJuniorProfile(currentUser.id, { current_goal: newGoal });
    setIsEditGoalModalOpen(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Student Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-navy-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-navy-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] font-bold text-teal-400 uppercase tracking-widest block">
              ĀNANDA • Senior–Junior Guidance
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome, {currentUser?.name}
            </h1>
            <p className="text-base sm:text-lg font-medium text-teal-200 italic">
              &ldquo;Let&rsquo;s figure out your next step.&rdquo;
            </p>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              Your senior mentor is here to share real semester experiences, help you build strong fundamentals, 
              and guide you one step at a time without technology overload.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setIsPulseModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 flex items-center justify-center space-x-1.5 transition-all"
            >
              <Star className="w-4 h-4 fill-slate-950" />
              <span>{myCurrentMonthPulse ? 'View Monthly Pulse' : 'Submit Monthly Pulse'}</span>
            </button>

            <button
              onClick={() => setIsGuidanceModalOpen(true)}
              disabled={!myMentor}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
            >
              <HelpCircle className="w-4 h-4 text-teal-300" />
              <span>Request Guidance</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: My Mentor & Current Goal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: My Senior Mentor (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-teal-700" />
              <h2 className="text-base font-bold text-slate-900">My Senior Mentor</h2>
            </div>
            {myActiveMatch && (
              <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                {myActiveMatch.match_score}% Compatibility Match
              </span>
            )}
          </div>

          {myMentor ? (
            <div className="mt-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    {myMentor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{myMentor.name}</h3>
                    <p className="text-xs text-slate-500">
                      {myMentor.program} • Semester {myMentor.semester} • {myMentor.student_id}
                    </p>
                    <p className="text-xs text-teal-700 font-medium mt-0.5">{myMentor.email}</p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Availability</span>
                  <span className="font-semibold text-slate-700">{myMentorProfile?.availability || '2-4 hrs/mo'}</span>
                </div>
              </div>

              {/* Bio */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
                &ldquo;{myMentorProfile?.bio || 'Senior mentor ready to support your first-semester journey.'}&rdquo;
              </div>

              {/* Skills & Guidance Areas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Senior Skills & Tech:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {myMentorProfile?.skills.map((s, idx) => (
                      <span key={idx} className="text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Guidance Topics:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {myMentorProfile?.guidance_areas.map((g, idx) => (
                      <span key={idx} className="text-[11px] bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-md font-medium">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <Compass className="w-10 h-10 mx-auto text-teal-600 mb-2 opacity-50" />
              <p className="text-sm font-semibold text-slate-700">Senior mentor matching in progress.</p>
              <p className="text-xs mt-1">Your faculty coordinator is reviewing available mentors for your department.</p>
            </div>
          )}
        </div>

        {/* Card 2: My Current Goal */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
              <h2 className="text-base font-bold text-slate-900">My 1st-Sem Goal</h2>
              <button
                onClick={() => {
                  setNewGoal(myProfile?.current_goal || '');
                  setIsEditGoalModalOpen(true);
                }}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center space-x-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 text-xs text-slate-800 leading-relaxed font-medium">
              {myProfile?.current_goal || 'No goal set yet. Click Edit to establish your target.'}
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Session Summary</span>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Next Planned Session:</span>
                <span className="font-bold text-teal-800">
                  {nextInteractionDate ? new Date(nextInteractionDate).toLocaleDateString() : 'To be scheduled'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">
              {myInteractions.length} interaction(s) recorded with mentor
            </span>
          </div>
        </div>
      </div>

      {/* Action Items Checklist */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-teal-700" />
              <h2 className="text-base font-bold text-slate-900">My Next Actions Checklist</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Achievable tasks agreed during mentoring conversations ({completedActions.length}/{myActions.length} completed)
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              {actionCompletionRate}% Progress
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          {myActions.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No action items assigned yet. Your senior mentor will agree on 1–2 next actions during your next check-in.
            </div>
          ) : (
            myActions.map(action => {
              const isCompleted = action.status === 'completed';
              const isOverdue = action.status === 'overdue';

              return (
                <div
                  key={action.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    isCompleted
                      ? 'bg-slate-50 border-slate-200 opacity-75'
                      : isOverdue
                      ? 'bg-rose-50/40 border-rose-200'
                      : 'bg-white border-slate-200 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      type="button"
                      onClick={() => toggleActionStatus(action.id, isCompleted ? 'pending' : 'completed')}
                      className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-teal-500 bg-white'
                      }`}
                      aria-label="Toggle action item completion"
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div>
                      <p className={`text-xs font-semibold ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {action.description}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Due: {action.due_date} {isCompleted && action.completed_at && `• Completed on ${new Date(action.completed_at).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>

                  <div>
                    {isCompleted ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Completed
                      </span>
                    ) : isOverdue ? (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Overdue
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Edit Goal Modal */}
      <Modal
        isOpen={isEditGoalModalOpen}
        onClose={() => setIsEditGoalModalOpen(false)}
        title="Update Your 1st-Semester Goal"
        subtitle="Establish what you want to achieve without pressure or unrealistic expectations"
      >
        <form onSubmit={handleSaveGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              My Goal
            </label>
            <textarea
              required
              rows={3}
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="e.g. Master C programming fundamentals and pass semester 1 with a consistent study schedule..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditGoalModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs"
            >
              Save Goal
            </button>
          </div>
        </form>
      </Modal>

      {/* Monthly Pulse Modal */}
      <MonthlyPulseModal
        isOpen={isPulseModalOpen}
        onClose={() => setIsPulseModalOpen(false)}
      />

      {/* Request Guidance Modal */}
      <RequestGuidanceModal
        isOpen={isGuidanceModalOpen}
        onClose={() => setIsGuidanceModalOpen(false)}
        mentorId={myMentor?.id}
        mentorName={myMentor?.name}
      />
    </div>
  );
};
