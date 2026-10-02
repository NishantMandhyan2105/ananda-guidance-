import React, { useState } from 'react';
import { 
  Users, UserPlus, Filter, Search, Shield, 
  GraduationCap, BookOpen, ExternalLink, Mail, Phone 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { User, UserRole, MentorProfile, JuniorProfile } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';

export const UserManagement: React.FC = () => {
  const { 
    users, mentorProfiles, juniorProfiles, 
    matches, addUser 
  } = useData();

  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(null);

  // Form state for creating user
  const [formRole, setFormRole] = useState<'mentor' | 'junior'>('junior');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formStudentId, setFormStudentId] = useState('');
  const [formDept, setFormDept] = useState('Computer Science & Engineering');
  const [formProgram, setFormProgram] = useState('B.Tech CSE');
  const [formSemester, setFormSemester] = useState(1);
  const [formGoal, setFormGoal] = useState('');
  const [formGuidanceAreas, setFormGuidanceAreas] = useState('Programming, Academics');
  const [formSkills, setFormSkills] = useState('C++, Python, Git');
  const [formAvailability, setFormAvailability] = useState('2-4 hours/month');

  const departments = Array.from(new Set(users.map(u => u.department))).filter(Boolean);

  const filteredUsers = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (deptFilter !== 'all' && u.department !== deptFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchId = u.student_id?.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchEmail) return false;
    }
    return true;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    if (formRole === 'mentor') {
      addUser({
        name: formName,
        email: formEmail,
        role: 'mentor',
        student_id: formStudentId || `2023-${formDept.substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        department: formDept,
        program: formProgram,
        semester: formSemester || 7,
        status: 'active'
      }, {
        skills: formSkills.split(',').map(s => s.trim()),
        guidance_areas: formGuidanceAreas.split(',').map(s => s.trim()),
        availability: formAvailability,
        bio: `Senior student in ${formProgram} ready to guide first-semester students.`
      } as Partial<MentorProfile>);
    } else {
      addUser({
        name: formName,
        email: formEmail,
        role: 'junior',
        student_id: formStudentId || `2026-${formDept.substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        department: formDept,
        program: formProgram,
        semester: 1,
        status: 'active'
      }, {
        guidance_areas: formGuidanceAreas.split(',').map(s => s.trim()),
        current_goal: formGoal || 'Establish consistent study habits and build coding fundamentals.',
        preferred_topics: formGuidanceAreas.split(',').map(s => s.trim())
      } as Partial<JuniorProfile>);
    }

    setIsAddModalOpen(false);
    setFormName('');
    setFormEmail('');
    setFormStudentId('');
    setFormGoal('');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-teal-700" />
            <h2 className="text-xl font-bold text-slate-900">Student & Mentor Directory</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete institutional roster of senior mentors, junior students, and coordinators
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-teal-700/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Student / Mentor</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="all">All Roles (Total: {users.length})</option>
            <option value="mentor">Senior Mentors</option>
            <option value="junior">Junior Students</option>
            <option value="coordinator">Coordinators</option>
            <option value="admin">Administrators</option>
          </select>
        </div>

        <div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="text-right text-xs text-slate-500 flex items-center justify-end font-medium">
          Showing {filteredUsers.length} of {users.length} members
        </div>
      </div>

      {/* Table of Users */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3">Student / Member</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Program & Department</th>
                <th className="px-6 py-3">Semester</th>
                <th className="px-6 py-3">Matching Status</th>
                <th className="px-6 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(user => {
                const isMentor = user.role === 'mentor';
                const isJunior = user.role === 'junior';
                const activeMatch = matches.find(m => (m.mentor_id === user.id || m.junior_id === user.id) && m.status === 'active');

                return (
                  <tr key={user.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          isMentor ? 'bg-indigo-100 text-indigo-700' : isJunior ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user.name}</div>
                          <div className="text-slate-400 text-[11px]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isMentor ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        isJunior ? 'bg-teal-50 text-teal-800 border border-teal-200' :
                        'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-medium text-slate-600">
                      {user.student_id}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-slate-800">{user.program}</div>
                      <div className="text-[11px] text-slate-400">{user.department}</div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {user.semester > 0 ? `Sem ${user.semester}` : 'Faculty'}
                    </td>
                    <td className="px-6 py-3.5">
                      {isMentor || isJunior ? (
                        activeMatch ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-700 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Matched</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-amber-700 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            <span>Unmatched</span>
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400">Staff</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedUserDetail(user)}
                        className="text-teal-700 hover:text-teal-900 font-semibold"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Student or Senior Mentor"
        subtitle="Enrolls the student into the 90-day guidance program database"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setFormRole('junior'); setFormSemester(1); }}
              className={`p-2.5 rounded-xl border text-xs font-bold ${
                formRole === 'junior' ? 'bg-teal-50 border-teal-600 text-teal-800' : 'border-slate-200'
              }`}
            >
              Junior (1st Semester)
            </button>
            <button
              type="button"
              onClick={() => { setFormRole('mentor'); setFormSemester(7); }}
              className={`p-2.5 rounded-xl border text-xs font-bold ${
                formRole === 'mentor' ? 'bg-indigo-50 border-indigo-600 text-indigo-800' : 'border-slate-200'
              }`}
            >
              Senior Mentor (5th/7th Sem)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Tanmay Sharma"
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">University Email</label>
              <input
                type="email"
                required
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="e.g. tanmay.sharma@university.edu"
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
              <select
                value={formDept}
                onChange={(e) => setFormDept(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Program</label>
              <input
                type="text"
                value={formProgram}
                onChange={(e) => setFormProgram(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          {formRole === 'junior' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Goal</label>
              <textarea
                value={formGoal}
                onChange={(e) => setFormGoal(e.target.value)}
                placeholder="What does the student want to accomplish this semester?"
                rows={2}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Skills & Technologies (comma separated)</label>
              <input
                type="text"
                value={formSkills}
                onChange={(e) => setFormSkills(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Guidance Areas (comma separated)
            </label>
            <input
              type="text"
              value={formGuidanceAreas}
              onChange={(e) => setFormGuidanceAreas(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>

      {/* Profile Detail View Modal */}
      {selectedUserDetail && (
        <Modal
          isOpen={!!selectedUserDetail}
          onClose={() => setSelectedUserDetail(null)}
          title={selectedUserDetail.name}
          subtitle={`${selectedUserDetail.role.toUpperCase()} • ${selectedUserDetail.student_id}`}
        >
          <div className="space-y-4 text-left">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
                <span className="font-semibold text-slate-800">{selectedUserDetail.department}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Program & Semester</span>
                <span className="font-semibold text-slate-800">{selectedUserDetail.program} (Sem {selectedUserDetail.semester})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                <span className="font-semibold text-slate-800">{selectedUserDetail.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone</span>
                <span className="font-semibold text-slate-800">{selectedUserDetail.phone || 'Not listed'}</span>
              </div>
            </div>

            {selectedUserDetail.role === 'junior' && (() => {
              const prof = juniorProfiles.find(p => p.user_id === selectedUserDetail.id);
              const activeMatch = matches.find(m => m.junior_id === selectedUserDetail.id && m.status === 'active');
              const mentor = activeMatch ? users.find(u => u.id === activeMatch.mentor_id) : null;

              return (
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase block mb-1">Assigned Mentor:</span>
                    {mentor ? (
                      <p className="text-xs font-semibold text-indigo-700 bg-indigo-50 p-2.5 rounded-xl border border-indigo-100">
                        {mentor.name} ({mentor.program}) • Match Score: {activeMatch?.match_score}%
                      </p>
                    ) : (
                      <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                        Not matched yet.
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase block mb-1">Current Goal:</span>
                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      {prof?.current_goal || 'None set'}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase block mb-1">Requested Guidance Topics:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {prof?.guidance_areas.map((g, i) => (
                        <span key={i} className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-lg">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {selectedUserDetail.role === 'mentor' && (() => {
              const prof = mentorProfiles.find(p => p.user_id === selectedUserDetail.id);
              const assigned = matches.filter(m => m.mentor_id === selectedUserDetail.id && m.status === 'active');

              return (
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase block mb-1">Currently Guiding ({assigned.length} Juniors):</span>
                    {assigned.length > 0 ? (
                      <div className="space-y-1">
                        {assigned.map(m => {
                          const j = users.find(u => u.id === m.junior_id);
                          return (
                            <div key={m.id} className="text-xs p-2 bg-teal-50 text-teal-900 rounded-lg border border-teal-100 flex justify-between">
                              <span className="font-semibold">{j?.name}</span>
                              <span className="text-teal-700">{j?.program}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">No active students assigned yet.</p>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase block mb-1">Skills & Technologies:</span>
                    <div className="flex flex-wrap gap-1">
                      {prof?.skills.map((s, i) => (
                        <span key={i} className="text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase block mb-1">Senior Mentor Bio:</span>
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                      {prof?.bio || 'No bio provided'}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </Modal>
      )}
    </div>
  );
};
