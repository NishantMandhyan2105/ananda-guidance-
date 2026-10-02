import React, { useState } from 'react';
import { 
  UserCheck, CheckCircle2, XCircle, ArrowRightLeft, 
  Sparkles, AlertCircle, Info, RefreshCw, SlidersHorizontal, 
  User, Check, ShieldCheck 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { generateSuggestedMatches, calculateMatchScore } from '../../services/matchingEngine';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';

export const MatchingCenter: React.FC = () => {
  const { 
    users, mentorProfiles, juniorProfiles, matches, 
    programSettings, approveMatch, rejectMatch, 
    createMatch, reassignMatch, updateSettings 
  } = useData();

  const [activeTab, setActiveTab] = useState<'suggested' | 'unmatched_juniors' | 'unmatched_mentors' | 'active_matches'>('suggested');
  const [showWeightSettings, setShowWeightSettings] = useState(false);
  const [manualMatchModalOpen, setManualMatchModalOpen] = useState(false);
  const [selectedJuniorId, setSelectedJuniorId] = useState<string>('');
  const [selectedMentorId, setSelectedMentorId] = useState<string>('');

  // Reassignment state
  const [reassignMatchId, setReassignMatchId] = useState<string | null>(null);
  const [newReassignMentorId, setNewReassignMentorId] = useState<string>('');

  const mentors = users.filter(u => u.role === 'mentor' && u.status === 'active');
  const juniors = users.filter(u => u.role === 'junior' && u.status === 'active');

  const activeMatchedJuniorIds = new Set(
    matches.filter(m => m.status === 'active').map(m => m.junior_id)
  );

  const unmatchedJuniors = juniors.filter(j => !activeMatchedJuniorIds.has(j.id));

  // Count active matches per mentor
  const mentorMatchCounts: Record<string, number> = {};
  matches.filter(m => m.status === 'active').forEach(m => {
    mentorMatchCounts[m.mentor_id] = (mentorMatchCounts[m.mentor_id] || 0) + 1;
  });

  const unmatchedMentors = mentors.filter(m => (mentorMatchCounts[m.id] || 0) < programSettings.max_juniors_per_mentor);

  // Suggested matches from database or dynamically computed
  const databaseSuggested = matches.filter(m => m.status === 'suggested');

  // Compute dynamic suggestions for all unmatched juniors
  const dynamicSuggestions = generateSuggestedMatches(
    unmatchedMentors.map(m => ({ user: m, profile: mentorProfiles.find(p => p.user_id === m.id) })),
    unmatchedJuniors.map(j => ({ user: j, profile: juniorProfiles.find(p => p.user_id === j.id) })),
    programSettings.matching_weights,
    programSettings.max_juniors_per_mentor,
    mentorMatchCounts
  );

  const handleManualPair = () => {
    if (!selectedJuniorId || !selectedMentorId) return;
    const jUser = users.find(u => u.id === selectedJuniorId);
    const mUser = users.find(u => u.id === selectedMentorId);
    const jProf = juniorProfiles.find(p => p.user_id === selectedJuniorId);
    const mProf = mentorProfiles.find(p => p.user_id === selectedMentorId);

    if (jUser && mUser) {
      const { score, reasons } = calculateMatchScore(mUser, mProf, jUser, jProf, programSettings.matching_weights);
      createMatch(mUser.id, jUser.id, score, ['Manual administrator override', ...reasons]);
      setManualMatchModalOpen(false);
      setSelectedJuniorId('');
      setSelectedMentorId('');
    }
  };

  const handleReassignSubmit = () => {
    if (!reassignMatchId || !newReassignMentorId) return;
    reassignMatch(reassignMatchId, newReassignMentorId);
    setReassignMatchId(null);
    setNewReassignMentorId('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-teal-700" />
            <h2 className="text-xl font-bold text-slate-900">Matching Center</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pair senior mentors with first-semester students using transparent, multi-factor compatibility
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowWeightSettings(!showWeightSettings)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Algorithm Weights</span>
          </button>

          <button
            onClick={() => setManualMatchModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 shadow-md shadow-teal-700/20"
          >
            <span>Manual Override Pair</span>
          </button>
        </div>
      </div>

      {/* Mandatory Safety / Recommendation Notice */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900 flex items-start space-x-3">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Algorithmic Guidance Policy:</span> Compatibility scores are recommendations 
          based on academic program, interests, and guidance areas. Compatibility is <strong>never guaranteed to be perfect</strong>. 
          Administrators retain full manual override and reassignment authority.
        </div>
      </div>

      {/* Configurable Weights Drawer */}
      {showWeightSettings && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-left animate-in fade-in">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Configurable Matching Weights</h3>
              <p className="text-xs text-slate-500">Fine-tune the importance of different factors in the recommendation engine</p>
            </div>
            <button
              onClick={() => updateSettings({
                matching_weights: { program: 0.25, interest: 0.25, guidance: 0.20, skill: 0.15, availability: 0.10, experience: 0.05 }
              })}
              className="text-xs text-teal-700 font-semibold hover:underline"
            >
              Reset Defaults
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { key: 'program', label: 'Academic Program', val: programSettings.matching_weights.program },
              { key: 'interest', label: 'Interests', val: programSettings.matching_weights.interest },
              { key: 'guidance', label: 'Guidance Areas', val: programSettings.matching_weights.guidance },
              { key: 'skill', label: 'Tech / Skills', val: programSettings.matching_weights.skill },
              { key: 'availability', label: 'Availability', val: programSettings.matching_weights.availability },
              { key: 'experience', label: 'Senior Experience', val: programSettings.matching_weights.experience }
            ].map(w => (
              <div key={w.key} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-xs font-semibold text-slate-700 truncate">{w.label}</span>
                <span className="text-lg font-bold text-teal-800">{Math.round(w.val * 100)}%</span>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  value={w.val}
                  onChange={(e) => {
                    const newVal = parseFloat(e.target.value);
                    updateSettings({
                      matching_weights: {
                        ...programSettings.matching_weights,
                        [w.key]: newVal
                      }
                    });
                  }}
                  className="w-full mt-2 accent-teal-600 h-1"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        {[
          { id: 'suggested', label: 'Suggested Matches', count: databaseSuggested.length + dynamicSuggestions.length },
          { id: 'unmatched_juniors', label: 'Unmatched Juniors', count: unmatchedJuniors.length },
          { id: 'unmatched_mentors', label: 'Available Mentors', count: unmatchedMentors.length },
          { id: 'active_matches', label: 'Active Matches', count: matches.filter(m => m.status === 'active').length }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === t.id
                ? 'border-teal-700 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>{t.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === t.id ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* TAB 1: Suggested Matches */}
      {activeTab === 'suggested' && (
        <div className="space-y-4">
          {/* Stored Suggested Matches from DB */}
          {databaseSuggested.map(match => {
            const mUser = users.find(u => u.id === match.mentor_id);
            const jUser = users.find(u => u.id === match.junior_id);
            const mProf = mentorProfiles.find(p => p.user_id === match.mentor_id);
            const jProf = juniorProfiles.find(p => p.user_id === match.junior_id);

            return (
              <div key={match.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs text-left hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                  {/* Pair Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                    {/* Mentor Box */}
                    <div className="p-3.5 bg-indigo-50/40 rounded-xl border border-indigo-100/60">
                      <div className="flex items-center space-x-2 text-xs font-bold text-indigo-900 mb-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                        <span>Senior Mentor</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{mUser?.name}</p>
                      <p className="text-xs text-slate-500">{mUser?.program} • Sem {mUser?.semester}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {mProf?.interests.slice(0, 3).map((int, i) => (
                          <span key={i} className="text-[10px] bg-white border border-indigo-200 text-indigo-700 px-1.5 py-0.5 rounded">
                            {int}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Junior Box */}
                    <div className="p-3.5 bg-teal-50/40 rounded-xl border border-teal-100/60">
                      <div className="flex items-center space-x-2 text-xs font-bold text-teal-900 mb-1">
                        <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                        <span>Junior Student</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{jUser?.name}</p>
                      <p className="text-xs text-slate-500">{jUser?.program} • Sem 1</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {jProf?.guidance_areas.slice(0, 3).map((g, i) => (
                          <span key={i} className="text-[10px] bg-white border border-teal-200 text-teal-800 px-1.5 py-0.5 rounded">
                            Wants: {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Badge & Actions */}
                  <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-center lg:items-end gap-3 min-w-[180px]">
                    <div className="text-left lg:text-right">
                      <div className="text-2xl font-black text-teal-800 leading-tight">
                        {match.match_score}%
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Compatibility Score
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => approveMatch(match.id)}
                        className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Match</span>
                      </button>
                      <button
                        onClick={() => rejectMatch(match.id)}
                        className="p-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs"
                        title="Dismiss recommendation"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Match Reasons */}
                <div className="mt-3.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Match Reasons:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {match.match_reason.map((reason, rIdx) => (
                      <span key={rIdx} className="text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{reason}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Dynamically Computed Suggestions for remaining unmatched */}
          {dynamicSuggestions.map((rec, idx) => (
            <div key={idx} className="rounded-2xl border border-dashed border-teal-300 bg-teal-50/20 p-5 shadow-xs text-left">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-teal-100 gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase block mb-1">Recommended Mentor</span>
                    <p className="text-sm font-bold text-slate-900">{rec.mentor.name}</p>
                    <p className="text-xs text-slate-500">{rec.mentor.program} • {rec.mentor.department}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-teal-700 uppercase block mb-1">Unmatched Junior</span>
                    <p className="text-sm font-bold text-slate-900">{rec.junior.name}</p>
                    <p className="text-xs text-slate-500">{rec.junior.program} • {rec.junior.department}</p>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-center lg:items-end gap-3 min-w-[180px]">
                  <div className="text-left lg:text-right">
                    <div className="text-2xl font-black text-teal-800 leading-tight">
                      {rec.matchScore}%
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Recommended
                    </span>
                  </div>

                  <button
                    onClick={() => createMatch(rec.mentor.id, rec.junior.id, rec.matchScore, rec.matchReasons)}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center space-x-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Match</span>
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {rec.matchReasons.map((r, rIdx) => (
                    <span key={rIdx} className="text-xs text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-lg flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0" />
                      <span>{r}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {databaseSuggested.length === 0 && dynamicSuggestions.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
              <p className="text-sm font-semibold text-slate-700">All available students are currently matched!</p>
              <p className="text-xs mt-1">Check Unmatched Juniors or Available Mentors tabs to inspect capacity.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Unmatched Juniors */}
      {activeTab === 'unmatched_juniors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unmatchedJuniors.map(junior => {
            const prof = juniorProfiles.find(p => p.user_id === junior.id);
            return (
              <div key={junior.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">{junior.student_id}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                      Unmatched
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{junior.name}</h3>
                  <p className="text-xs text-slate-500">{junior.program} • {junior.department}</p>
                  
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Goal:</span>
                    <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-2">
                      {prof?.current_goal || 'No goal set yet'}
                    </p>
                  </div>

                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Desired Guidance:</span>
                    <div className="flex flex-wrap gap-1">
                      {prof?.guidance_areas.map((g, i) => (
                        <span key={i} className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200 px-1.5 py-0.5 rounded">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedJuniorId(junior.id);
                      setManualMatchModalOpen(true);
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 font-semibold text-xs text-slate-700 rounded-xl transition-colors"
                  >
                    Match with a Mentor
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: Available Mentors */}
      {activeTab === 'unmatched_mentors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unmatchedMentors.map(mentor => {
            const prof = mentorProfiles.find(p => p.user_id === mentor.id);
            const activeCount = mentorMatchCounts[mentor.id] || 0;
            return (
              <div key={mentor.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">{mentor.student_id}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-medium">
                      {activeCount} / {programSettings.max_juniors_per_mentor} Juniors
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{mentor.name}</h3>
                  <p className="text-xs text-slate-500">{mentor.program} • Sem {mentor.semester}</p>
                  
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {prof?.skills.slice(0, 4).map((s, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Availability:</span>
                    <p className="text-xs text-slate-600">{prof?.availability || '2-4 hours/month'}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedMentorId(mentor.id);
                      setManualMatchModalOpen(true);
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 font-semibold text-xs text-slate-700 rounded-xl transition-colors"
                  >
                    Assign Junior
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: Active Matches (With Reassignment capability) */}
      {activeTab === 'active_matches' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3">Mentor</th>
                  <th className="px-6 py-3">Junior Student</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Compatibility</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matches.filter(m => m.status === 'active' || m.status === 'reassigned').map(match => {
                  const mentor = users.find(u => u.id === match.mentor_id);
                  const junior = users.find(u => u.id === match.junior_id);

                  return (
                    <tr key={match.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{mentor?.name}</div>
                        <div className="text-[11px] text-slate-400">{mentor?.student_id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{junior?.name}</div>
                        <div className="text-[11px] text-slate-400">{junior?.student_id}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {junior?.department}
                      </td>
                      <td className="px-6 py-4 font-bold text-teal-700">
                        {match.match_score}%
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={match.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setReassignMatchId(match.id);
                          }}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          Reassign Mentor
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Override Match Modal */}
      <Modal
        isOpen={manualMatchModalOpen}
        onClose={() => setManualMatchModalOpen(false)}
        title="Manual Match Pair Override"
        subtitle="Administratively pair any junior student with an available senior mentor"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Select Junior Student
            </label>
            <select
              value={selectedJuniorId}
              onChange={(e) => setSelectedJuniorId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
            >
              <option value="">-- Choose Junior Student --</option>
              {juniors.map(j => (
                <option key={j.id} value={j.id}>
                  {j.name} ({j.student_id} - {j.program})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Select Senior Mentor
            </label>
            <select
              value={selectedMentorId}
              onChange={(e) => setSelectedMentorId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
            >
              <option value="">-- Choose Senior Mentor --</option>
              {mentors.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.student_id} - {m.program}) [Current: {mentorMatchCounts[m.id] || 0} Juniors]
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200">
            A match score and compatibility explanation will be computed and recorded in the audit trail under your administrative account.
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setManualMatchModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              disabled={!selectedJuniorId || !selectedMentorId}
              onClick={handleManualPair}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-xl shadow-xs"
            >
              Confirm Match
            </button>
          </div>
        </div>
      </Modal>

      {/* Reassign Modal */}
      <Modal
        isOpen={!!reassignMatchId}
        onClose={() => setReassignMatchId(null)}
        title="Reassign Senior Mentor"
        subtitle="Transfer the junior student to another mentor. Previous records will be preserved."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Select New Senior Mentor
            </label>
            <select
              value={newReassignMentorId}
              onChange={(e) => setNewReassignMentorId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
            >
              <option value="">-- Choose Available Mentor --</option>
              {unmatchedMentors.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.student_id} - {m.program})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setReassignMatchId(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              disabled={!newReassignMentorId}
              onClick={handleReassignSubmit}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-xs"
            >
              Confirm Reassignment
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
