import React, { useState } from 'react';
import { 
  Award, Plus, CheckCircle2, Sparkles, 
  Check, X, ThumbsUp, BookmarkCheck 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StoryCategory, StoryStatus, SuccessStory } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';

export const SuccessStoriesView: React.FC = () => {
  const { successStories, users, submitSuccessStory, updateStoryStatus } = useData();
  const { currentUser, role } = useAuth();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StoryCategory>('academic_improvement');
  const [description, setDescription] = useState('');
  const [beforeState, setBeforeState] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [outcome, setOutcome] = useState('');
  const [studentId, setStudentId] = useState(role === 'junior' ? currentUser?.id || '' : '');
  const [mentorId, setMentorId] = useState(role === 'mentor' ? currentUser?.id || '' : '');

  const juniors = users.filter(u => u.role === 'junior');
  const mentors = users.filter(u => u.role === 'mentor');

  // Filter visible stories:
  // Public/Student sees: Published stories only
  // Admin/Coordinator sees: All stories (including Draft, Submitted)
  const visibleStories = successStories.filter(s => {
    if (role === 'admin' || role === 'coordinator') return true;
    if (role === 'mentor' && s.mentor_id === currentUser?.id) return true;
    if (role === 'junior' && s.student_id === currentUser?.id) return true;
    return s.status === 'published';
  }).filter(s => {
    if (filterCategory !== 'all' && s.category !== filterCategory) return false;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !studentId) return;

    submitSuccessStory({
      student_id: studentId,
      mentor_id: mentorId || undefined,
      title,
      description,
      before_state: beforeState,
      action_taken: actionTaken,
      outcome,
      category,
      status: role === 'admin' ? 'published' : 'submitted'
    });

    setIsSubmitModalOpen(false);
    setTitle('');
    setDescription('');
    setBeforeState('');
    setActionTaken('');
    setOutcome('');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-teal-700" />
            <h2 className="text-xl font-bold text-slate-900">Success Stories & Impact</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real institutional journeys showing how senior guidance helped first-semester students take their next step
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-teal-700/20"
        >
          <Plus className="w-4 h-4" />
          <span>Share Guidance Story</span>
        </button>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2 pb-2">
        {[
          { id: 'all', label: 'All Stories' },
          { id: 'academic_improvement', label: 'Academic Improvement' },
          { id: 'skill_developed', label: 'Skill Developed' },
          { id: 'communication_improvement', label: 'Communication' },
          { id: 'project_completed', label: 'Projects' },
          { id: 'opportunity_pursued', label: 'Clubs & Opportunities' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterCategory === cat.id
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visibleStories.map(story => {
          const student = users.find(u => u.id === story.student_id);
          const mentor = users.find(u => u.id === story.mentor_id);

          return (
            <div
              key={story.id}
              className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {story.category.replace(/_/g, ' ')}
                  </span>
                  <StatusBadge status={story.status} size="sm" />
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
                  {story.title}
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed font-normal">
                  {story.description}
                </p>

                {/* Before / Action / Outcome Grid */}
                <div className="space-y-2 text-xs">
                  {story.before_state && (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Before:</span>
                      <p className="text-slate-700 text-xs mt-0.5">{story.before_state}</p>
                    </div>
                  )}

                  {story.action_taken && (
                    <div className="p-2.5 bg-teal-50/50 rounded-xl border border-teal-100">
                      <span className="text-[10px] font-bold text-teal-800 uppercase block">Guidance Action:</span>
                      <p className="text-slate-800 text-xs mt-0.5">{story.action_taken}</p>
                    </div>
                  )}

                  {story.outcome && (
                    <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase block">Outcome:</span>
                      <p className="text-emerald-950 font-medium text-xs mt-0.5">{story.outcome}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer with Student / Mentor Details & Admin Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800">{student?.name}</span>
                  <span className="text-slate-400"> (Guided by {mentor?.name || 'Senior'})</span>
                </div>

                {role === 'admin' && story.status !== 'published' && (
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => updateStoryStatus(story.id, 'published')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center space-x-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Approve & Publish</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Story Submission Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Share Mentoring Success Story"
        subtitle="Document a real turning point or breakthrough in junior student guidance"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Overcoming Fear of C Programming Syntax"
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Junior Student</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
              >
                <option value="">-- Select Student --</option>
                {juniors.map(j => (
                  <option key={j.id} value={j.id}>{j.name} ({j.program})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StoryCategory)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
              >
                <option value="academic_improvement">Academic Improvement</option>
                <option value="skill_developed">Skill Developed</option>
                <option value="communication_improvement">Communication</option>
                <option value="project_completed">Project Completed</option>
                <option value="opportunity_pursued">Opportunity Pursued</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Overview Description</label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of the guidance story..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Before Situation</label>
              <textarea
                rows={2}
                value={beforeState}
                onChange={(e) => setBeforeState(e.target.value)}
                placeholder="What was the student struggling with?"
                className="w-full p-2 text-xs rounded-lg border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Action Taken</label>
              <textarea
                rows={2}
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                placeholder="What specific guidance did the mentor give?"
                className="w-full p-2 text-xs rounded-lg border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Outcome</label>
              <textarea
                rows={2}
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                placeholder="What tangible result was achieved?"
                className="w-full p-2 text-xs rounded-lg border border-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs"
            >
              Submit Story
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
