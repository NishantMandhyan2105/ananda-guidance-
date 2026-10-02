import React from 'react';
import { 
  LayoutDashboard, Users, UserCheck, Calendar, 
  Clock, Flag, Award, FileText, Settings, 
  History, CheckSquare, HeartHandshake, Compass, 
  HelpCircle, MessageSquareText, ShieldAlert, Sparkles 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onSelectTab, 
  isOpen = false, 
  onClose 
}) => {
  const { role } = useAuth();

  interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }

  const adminNav: NavItem[] = [
    { id: 'dashboard', label: 'Institutional Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'matching', label: 'Matching Center', icon: <UserCheck className="w-4 h-4" />, badge: 'AI Suggest' },
    { id: 'users', label: 'Mentors & Juniors', icon: <Users className="w-4 h-4" /> },
    { id: 'interactions', label: 'Interactions & Groups', icon: <Calendar className="w-4 h-4" /> },
    { id: 'pilot', label: '90-Day Pilot Tracker', icon: <Clock className="w-4 h-4" /> },
    { id: 'escalations', label: 'Safety & Support', icon: <Flag className="w-4 h-4" /> },
    { id: 'stories', label: 'Success Stories', icon: <Award className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports & Export', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Program Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit Trail', icon: <History className="w-4 h-4" /> }
  ];

  const coordinatorNav: NavItem[] = [
    { id: 'dashboard', label: 'Department Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'users', label: 'Department Cohort', icon: <Users className="w-4 h-4" /> },
    { id: 'interactions', label: 'Interactions & Inactive Groups', icon: <Calendar className="w-4 h-4" /> },
    { id: 'escalations', label: 'Support & Escalations', icon: <Flag className="w-4 h-4" /> },
    { id: 'stories', label: 'Success Stories', icon: <Award className="w-4 h-4" /> },
    { id: 'reports', label: 'Department Reports', icon: <FileText className="w-4 h-4" /> }
  ];

  const mentorNav: NavItem[] = [
    { id: 'dashboard', label: 'My Juniors & Overview', icon: <Compass className="w-4 h-4" /> },
    { id: 'record', label: 'Record Interaction', icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'interactions', label: 'Mentoring History', icon: <Calendar className="w-4 h-4" /> },
    { id: 'escalations', label: 'Raise Concern', icon: <Flag className="w-4 h-4" /> },
    { id: 'stories', label: 'Guidance Stories', icon: <Award className="w-4 h-4" /> }
  ];

  const juniorNav: NavItem[] = [
    { id: 'dashboard', label: 'My Guidance Dashboard', icon: <Compass className="w-4 h-4" /> },
    { id: 'actions', label: 'My Next Actions', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'pulse', label: 'Monthly Junior Pulse', icon: <MessageSquareText className="w-4 h-4" />, badge: '5-Q' },
    { id: 'request_guidance', label: 'Request Guidance', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'escalations', label: 'Support & Safety', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'stories', label: 'Campus Stories', icon: <Sparkles className="w-4 h-4" /> }
  ];

  let currentNav: NavItem[] = adminNav;
  if (role === 'coordinator') currentNav = coordinatorNav;
  else if (role === 'mentor') currentNav = mentorNav;
  else if (role === 'junior') currentNav = juniorNav;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-slate-200 bg-white flex flex-col justify-between p-4 transition-transform duration-200 ease-in-out no-print
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-4">
          <div className="px-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {role === 'admin' ? 'Institutional Administration' :
               role === 'coordinator' ? 'Departmental Coordination' :
               role === 'mentor' ? 'Senior Guidance Portal' : 'Student Learning Hub'}
            </p>
          </div>

          <nav className="space-y-1">
            {currentNav.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-sm shadow-teal-700/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-teal-800 text-teal-100' : 'bg-teal-50 text-teal-700 border border-teal-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Philosophy Card in Footer */}
        <div className="rounded-2xl border border-teal-100 bg-gradient-to-b from-teal-50/60 to-emerald-50/30 p-3.5 text-left">
          <p className="text-[11px] font-bold text-teal-900 uppercase tracking-wider flex items-center space-x-1.5 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
            <span>Core Principle</span>
          </p>
          <blockquote className="text-xs text-slate-700 italic leading-relaxed">
            &ldquo;Do not impress your junior with how much you know. Help your junior understand what to do next.&rdquo;
          </blockquote>
          <div className="mt-2 text-[10px] text-teal-700/70 font-semibold">
            Institutional Pilot 2026
          </div>
        </div>
      </aside>
    </>
  );
};
