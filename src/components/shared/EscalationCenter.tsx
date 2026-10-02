import React, { useState } from 'react';
import { 
  ShieldAlert, AlertTriangle, CheckCircle, Flag, 
  HelpCircle, PhoneCall, Plus, ArrowRight, MessageSquare 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { EscalationCategory, EscalationSeverity, EscalationStatus, Escalation } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';

export const EscalationCenter: React.FC = () => {
  const { escalations, users, raiseEscalation, updateEscalation } = useData();
  const { currentUser, role } = useAuth();

  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null);

  // Form state
  const [category, setCategory] = useState<EscalationCategory>('academic');
  const [severity, setSeverity] = useState<EscalationSeverity>('medium');
  const [description, setDescription] = useState('');
  const [targetJuniorId, setTargetJuniorId] = useState(role === 'junior' ? currentUser?.id || '' : '');

  // Triage state
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [statusUpdate, setStatusUpdate] = useState<EscalationStatus>('under_review');
  const [assigneeId, setAssigneeId] = useState('');

  // Filter state
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const coordinators = users.filter(u => u.role === 'coordinator' || u.role === 'admin');
  const juniors = users.filter(u => u.role === 'junior');

  // Filter escalations based on role permissions
  // Mentors only see what they raised or their own juniors' non-harassment issues
  // Juniors only see what they raised
  // Admin/Coordinator see all
  const visibleEscalations = escalations.filter(e => {
    if (role === 'admin' || role === 'coordinator') return true;
    if (role === 'junior') return e.junior_id === currentUser?.id || e.raised_by === currentUser?.id;
    if (role === 'mentor') return e.raised_by === currentUser?.id;
    return false;
  }).filter(e => {
    if (filterCategory !== 'all' && e.category !== filterCategory) return false;
    if (filterSeverity !== 'all' && e.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && e.status !== filterStatus) return false;
    return true;
  });

  const handleRaiseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !currentUser) return;

    raiseEscalation({
      raised_by: currentUser.id,
      junior_id: targetJuniorId || currentUser.id,
      category,
      severity,
      description
    });

    setIsRaiseModalOpen(false);
    setDescription('');
  };

  const handleTriageSubmit = () => {
    if (!selectedEscalation) return;

    // Check business rule: Mentors cannot resolve serious cases
    const isSerious = ['wellbeing', 'harassment', 'safety', 'personal'].includes(selectedEscalation.category);
    if (role === 'mentor' && isSerious && (statusUpdate === 'resolved' || statusUpdate === 'closed')) {
      alert('Business Rule: Mentors must not independently resolve wellbeing, harassment, safety, or personal cases. These must be referred to university authorities.');
      return;
    }

    updateEscalation(selectedEscalation.id, {
      status: statusUpdate,
      resolution: resolutionNotes || selectedEscalation.resolution,
      assigned_to: assigneeId || selectedEscalation.assigned_to
    });

    setSelectedEscalation(null);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <h2 className="text-xl font-bold text-slate-900">Support & Safety Center</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Confidential escalation triage for academic distress, student wellbeing, and safety concerns
          </p>
        </div>

        <button
          onClick={() => setIsRaiseModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-rose-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Raise Concern / Escalation</span>
        </button>
      </div>

      {/* Institutional Safety Banner (Section 19 Business Rule) */}
      <div className="rounded-2xl border-2 border-rose-300 bg-gradient-to-r from-rose-50 via-rose-50/70 to-amber-50/50 p-5 shadow-xs text-left">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-950">
              Immediate Institutional Safety & Emergency Support
            </h3>
            <p className="text-xs text-rose-900/90 mt-1 leading-relaxed">
              &ldquo;If this concern involves safety, wellbeing, harassment or a serious personal matter, 
              please use the university’s designated support system.&rdquo;
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-rose-800 font-semibold">
              <span className="bg-white/80 border border-rose-200 px-2.5 py-1 rounded-lg">
                Counseling Centre: +91 11 2659 1000
              </span>
              <span className="bg-white/80 border border-rose-200 px-2.5 py-1 rounded-lg">
                Internal Complaints Committee (ICC): icc@university.edu
              </span>
              <span className="bg-white/80 border border-rose-200 px-2.5 py-1 rounded-lg">
                Campus Security Control: Ext. 5555
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full p-2 text-xs rounded-xl border border-slate-200"
          >
            <option value="all">All Statuses ({visibleEscalations.length})</option>
            <option value="new">New</option>
            <option value="under_review">Under Review</option>
            <option value="referred">Referred to Counseling/ICC</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full p-2 text-xs rounded-xl border border-slate-200"
          >
            <option value="all">All Categories</option>
            <option value="academic">Academic</option>
            <option value="wellbeing">Wellbeing</option>
            <option value="harassment">Harassment</option>
            <option value="safety">Safety</option>
            <option value="personal">Personal</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="w-full p-2 text-xs rounded-xl border border-slate-200"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical (Immediate)</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Escalation Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {visibleEscalations.map(esc => {
          const raisedUser = users.find(u => u.id === esc.raised_by);
          const junior = users.find(u => u.id === esc.junior_id);
          const assignee = users.find(u => u.id === esc.assigned_to);

          const isCritical = esc.severity === 'critical' || esc.severity === 'high';

          return (
            <div
              key={esc.id}
              className={`rounded-2xl border p-5 bg-white shadow-xs transition-shadow hover:shadow-md ${
                isCritical ? 'border-rose-300 ring-1 ring-rose-300/30' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center space-x-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    esc.severity === 'critical' ? 'bg-rose-600 animate-ping' :
                    esc.severity === 'high' ? 'bg-rose-500' :
                    esc.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-400'
                  }`} />
                  <h3 className="text-sm font-bold text-slate-900 capitalize">
                    {esc.category} Concern
                  </h3>
                  <StatusBadge status={esc.status} size="sm" />
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    isCritical ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {esc.severity}
                  </span>
                </div>

                <div className="text-xs text-slate-400">
                  Logged {new Date(esc.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="mt-3.5 space-y-2">
                <p className="text-xs text-slate-700 leading-relaxed font-normal bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {esc.description}
                </p>

                <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500 gap-2">
                  <div className="flex items-center space-x-4">
                    <span>
                      <strong>Raised By:</strong> {raisedUser?.name} ({raisedUser?.role})
                    </span>
                    <span>
                      <strong>Student:</strong> {junior?.name} ({junior?.program})
                    </span>
                    <span>
                      <strong>Assigned Coordinator:</strong> {assignee?.name || 'Unassigned'}
                    </span>
                  </div>

                  {(role === 'admin' || role === 'coordinator') && (
                    <button
                      onClick={() => {
                        setSelectedEscalation(esc);
                        setStatusUpdate(esc.status);
                        setResolutionNotes(esc.resolution || '');
                        setAssigneeId(esc.assigned_to || '');
                      }}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900 hover:underline"
                    >
                      Update Case & Triage →
                    </button>
                  )}
                </div>

                {esc.resolution && (
                  <div className="mt-2 text-xs bg-emerald-50 text-emerald-900 p-2.5 rounded-xl border border-emerald-200">
                    <span className="font-bold">Resolution / Referral Notes:</span> {esc.resolution}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {visibleEscalations.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <CheckCircle className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No active escalations match your filters.</p>
          </div>
        )}
      </div>

      {/* Raise Escalation Modal */}
      <Modal
        isOpen={isRaiseModalOpen}
        onClose={() => setIsRaiseModalOpen(false)}
        title="Raise Student Support Concern"
        subtitle="Confidential submission to University DSW & Faculty Coordination"
      >
        <form onSubmit={handleRaiseSubmit} className="space-y-4">
          {role !== 'junior' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Select Junior Student Concerned
              </label>
              <select
                value={targetJuniorId}
                onChange={(e) => setTargetJuniorId(e.target.value)}
                required
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
              >
                <option value="">-- Choose Junior Student --</option>
                {juniors.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.name} ({j.student_id} - {j.program})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EscalationCategory)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
              >
                <option value="academic">Academic Distress</option>
                <option value="wellbeing">Wellbeing & Mental Health</option>
                <option value="safety">Physical / Campus Safety</option>
                <option value="harassment">Harassment / Grievance</option>
                <option value="personal">Personal / Family Emergency</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as EscalationSeverity)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
              >
                <option value="low">Low (Routine guidance request)</option>
                <option value="medium">Medium (Needs coordinator check)</option>
                <option value="high">High (Significant distress)</option>
                <option value="critical">Critical (Immediate safety risk)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Description of Concern
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the situation objectively and what immediate institutional support may be required..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
            />
          </div>

          <div className="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs border border-rose-200">
            Emergency note: If the student is in immediate physical danger, contact Campus Emergency directly at +91 11 2659 1000.
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsRaiseModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
            >
              Submit Escalation
            </button>
          </div>
        </form>
      </Modal>

      {/* Coordinator Triage Modal */}
      {selectedEscalation && (
        <Modal
          isOpen={!!selectedEscalation}
          onClose={() => setSelectedEscalation(null)}
          title="Triage & Manage Escalation"
          subtitle={`Case ID: ${selectedEscalation.id} • ${selectedEscalation.category.toUpperCase()}`}
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-200">
              <span className="font-bold block mb-1">Reported Issue:</span>
              {selectedEscalation.description}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value as EscalationStatus)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
                >
                  <option value="new">New</option>
                  <option value="under_review">Under Review</option>
                  <option value="referred">Referred (Counseling / ICC)</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assign To</label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
                >
                  <option value="">-- Choose Coordinator --</option>
                  {coordinators.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.department})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Resolution & Referral Action Notes
              </label>
              <textarea
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Log actions taken, referrals made to counseling center, or remedial exam arrangements..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedEscalation(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTriageSubmit}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs"
              >
                Save Triage Updates
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
