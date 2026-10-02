import React, { useState } from 'react';
import { 
  HeartHandshake, Plus, Trash2, Calendar, 
  Clock, CheckCircle, Info, Sparkles 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { InteractionType, User } from '../../types';
import { Modal } from '../common/Modal';

interface RecordInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedJuniorId?: string;
}

export const RecordInteractionModal: React.FC<RecordInteractionModalProps> = ({
  isOpen,
  onClose,
  preselectedJuniorId
}) => {
  const { users, matches, recordInteraction } = useData();
  const { currentUser } = useAuth();

  // Find juniors assigned to this mentor
  const assignedJuniorMatches = matches.filter(
    m => m.mentor_id === currentUser?.id && m.status === 'active'
  );

  const assignedJuniors = assignedJuniorMatches
    .map(m => users.find(u => u.id === m.junior_id))
    .filter(Boolean) as User[];

  // Form states
  const [juniorId, setJuniorId] = useState(preselectedJuniorId || (assignedJuniors[0]?.id || ''));
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState(30);
  const [interactionType, setInteractionType] = useState<InteractionType>('in_person');
  const [topics, setTopics] = useState('Coursework, Problem Solving');
  const [discussionSummary, setDiscussionSummary] = useState('');
  const [learningOutcome, setLearningOutcome] = useState('');
  const [nextDate, setNextDate] = useState('');

  // Business Rule: Maximum 2 action items!
  const [actions, setActions] = useState<{ description: string; due_date: string }[]>([
    { description: '', due_date: '' }
  ]);

  const addActionRow = () => {
    if (actions.length >= 2) return;
    setActions([...actions, { description: '', due_date: '' }]);
  };

  const removeActionRow = (idx: number) => {
    setActions(actions.filter((_, i) => i !== idx));
  };

  const updateAction = (idx: number, field: 'description' | 'due_date', val: string) => {
    const updated = [...actions];
    updated[idx][field] = val;
    setActions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !juniorId || !discussionSummary || !learningOutcome) return;

    // Filter valid actions that have description and due date
    const validActions = actions.filter(a => a.description.trim() && a.due_date);

    const success = recordInteraction({
      mentor_id: currentUser.id,
      junior_id: juniorId,
      interaction_date: date,
      duration: Number(duration),
      interaction_type: interactionType,
      topics: topics.split(',').map(t => t.trim()),
      discussion_summary: discussionSummary,
      learning_outcome: learningOutcome,
      next_interaction_date: nextDate || undefined
    }, validActions);

    if (success) {
      onClose();
      // Reset form
      setDiscussionSummary('');
      setLearningOutcome('');
      setActions([{ description: '', due_date: '' }]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Mentoring Interaction"
      subtitle="Help your junior understand what to do next with 1 or 2 realistic action items"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Core Reminder Banner */}
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-start space-x-2">
          <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <span>
            <strong>Mentoring Philosophy:</strong> Focus on what the junior should do next. 
            Do not overload with broad technologies or excessive homework. Maximum <strong>2 action items</strong> permitted.
          </span>
        </div>

        {/* Junior Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Junior Student
          </label>
          <select
            value={juniorId}
            onChange={(e) => setJuniorId(e.target.value)}
            required
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
          >
            <option value="">-- Select Your Assigned Junior --</option>
            {assignedJuniors.map(j => (
              <option key={j.id} value={j.id}>
                {j.name} ({j.student_id} - {j.program})
              </option>
            ))}
          </select>
        </div>

        {/* Date, Duration, Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Duration (Minutes)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
            >
              <option value={15}>15 mins</option>
              <option value={30}>30 mins</option>
              <option value={45}>45 mins</option>
              <option value={60}>60 mins</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Interaction Type
            </label>
            <select
              value={interactionType}
              onChange={(e) => setInteractionType(e.target.value as InteractionType)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
            >
              <option value="in_person">In Person (Campus)</option>
              <option value="online">Online / Video Call</option>
              <option value="phone">Phone Call</option>
              <option value="group">Group Discussion</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Topics Discussed (comma separated)
          </label>
          <input
            type="text"
            required
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            placeholder="e.g. C Programming, Mid-Term Exam Prep, Time Management"
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Discussion Summary
          </label>
          <textarea
            required
            rows={3}
            value={discussionSummary}
            onChange={(e) => setDiscussionSummary(e.target.value)}
            placeholder="Summarize key points discussed, doubts cleared, and honest advice shared..."
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            What Did the Junior Learn? (Key Learning Outcome)
          </label>
          <textarea
            required
            rows={2}
            value={learningOutcome}
            onChange={(e) => setLearningOutcome(e.target.value)}
            placeholder="Specific takeaway or conceptual clarity gained by the student..."
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
          />
        </div>

        {/* Agreed Next Actions (Strict Max 2 Rules!) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase">
                Agreed Next Actions ({actions.length}/2)
              </span>
              <p className="text-[11px] text-slate-400">Strictly limited to 1–2 achievable tasks</p>
            </div>
            {actions.length < 2 && (
              <button
                type="button"
                onClick={addActionRow}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add 2nd Action</span>
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {actions.map((act, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600">Action Item #{idx + 1}</span>
                  {actions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeActionRow(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Practice 3 pointer problems on paper"
                      value={act.description}
                      onChange={(e) => updateAction(idx, 'description', e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      required
                      value={act.due_date}
                      onChange={(e) => updateAction(idx, 'due_date', e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Interaction Date */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Planned Next Interaction Date (Optional)
          </label>
          <input
            type="date"
            value={nextDate}
            onChange={(e) => setNextDate(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-md shadow-teal-700/20"
          >
            Save Interaction
          </button>
        </div>
      </form>
    </Modal>
  );
};
