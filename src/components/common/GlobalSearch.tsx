import React, { useState, useRef, useEffect } from 'react';
import { Search, User as UserIcon, BookOpen, Layers, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface GlobalSearchProps {
  onSelectUser?: (userId: string, role: string) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onSelectUser }) => {
  const { users, mentorProfiles, juniorProfiles, matches } = useData();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const trimmed = query.trim().toLowerCase();

  const matchingUsers = trimmed.length > 1 ? users.filter(u => {
    const nameMatch = u.name.toLowerCase().includes(trimmed);
    const idMatch = u.student_id?.toLowerCase().includes(trimmed);
    const deptMatch = u.department.toLowerCase().includes(trimmed);
    const progMatch = u.program.toLowerCase().includes(trimmed);

    // Also check profiles for interests / skills
    let profileMatch = false;
    if (u.role === 'mentor') {
      const p = mentorProfiles.find(mp => mp.user_id === u.id);
      if (p) {
        profileMatch = (p.skills || []).some(s => s.toLowerCase().includes(trimmed)) ||
                       (p.interests || []).some(i => i.toLowerCase().includes(trimmed)) ||
                       (p.guidance_areas || []).some(g => g.toLowerCase().includes(trimmed));
      }
    } else if (u.role === 'junior') {
      const p = juniorProfiles.find(jp => jp.user_id === u.id);
      if (p) {
        profileMatch = (p.guidance_areas || []).some(g => g.toLowerCase().includes(trimmed)) ||
                       (p.interests || []).some(i => i.toLowerCase().includes(trimmed)) ||
                       (p.current_goal || '').toLowerCase().includes(trimmed);
      }
    }

    return nameMatch || idMatch || deptMatch || progMatch || profileMatch;
  }).slice(0, 8) : [];

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search students, mentors, ID, department, interest..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && query.trim().length > 1 && (
        <div className="absolute left-0 right-0 mt-2 z-50 rounded-xl border border-slate-200 bg-white shadow-xl max-h-96 overflow-y-auto">
          <div className="p-2 border-b border-slate-100 bg-slate-50/80 text-xs font-medium text-slate-500 flex justify-between items-center">
            <span>Search Results ({matchingUsers.length})</span>
            <span className="text-[11px] text-slate-400">Esc to close</span>
          </div>

          {matchingUsers.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No students, mentors, or topics match &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="p-1 space-y-1">
              {matchingUsers.map(user => {
                const isMentor = user.role === 'mentor';
                const isJunior = user.role === 'junior';
                const matchCount = isMentor 
                  ? matches.filter(m => m.mentor_id === user.id && m.status === 'active').length
                  : matches.filter(m => m.junior_id === user.id && m.status === 'active').length;

                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      if (onSelectUser) onSelectUser(user.id, user.role);
                      setIsOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isMentor ? 'bg-indigo-100 text-indigo-700' : isJunior ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-slate-900 group-hover:text-teal-600 transition-colors">
                            {user.name}
                          </span>
                          <span className="text-xs text-slate-400">({user.student_id})</span>
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            isMentor ? 'bg-indigo-50 text-indigo-600' : 'bg-teal-50 text-teal-600'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate max-w-xs">
                          {user.program} • {user.department}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      {isMentor ? `${matchCount} Junior(s)` : matchCount > 0 ? 'Matched' : 'Unmatched'}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
