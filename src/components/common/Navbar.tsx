import React, { useState } from 'react';
import { 
  Bell, CheckCircle2, RotateCcw, Shield, GraduationCap, 
  BookOpen, Users, LogOut, ChevronDown, Menu, X, ExternalLink 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useData } from '../../context/DataContext';
import { GlobalSearch } from './GlobalSearch';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onNavigateLanding?: () => void;
  onSelectUserFromSearch?: (userId: string, role: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onToggleSidebar, 
  onNavigateLanding,
  onSelectUserFromSearch 
}) => {
  const { currentUser, role, switchRole, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { resetAllData } = useData();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
    admin: { 
      label: 'Super Admin', 
      icon: <Shield className="w-3.5 h-3.5 text-indigo-600" />,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200' 
    },
    coordinator: { 
      label: 'Coordinator', 
      icon: <Users className="w-3.5 h-3.5 text-blue-600" />,
      color: 'bg-blue-50 text-blue-700 border-blue-200' 
    },
    mentor: { 
      label: 'Senior Mentor', 
      icon: <GraduationCap className="w-3.5 h-3.5 text-teal-600" />,
      color: 'bg-teal-50 text-teal-700 border-teal-200' 
    },
    junior: { 
      label: 'Junior Student', 
      icon: <BookOpen className="w-3.5 h-3.5 text-emerald-600" />,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200' 
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 no-print">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center space-x-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div 
            onClick={onNavigateLanding}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <span className="font-serif font-black text-lg">Ā</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  ĀNANDA
                </span>
                <span className="hidden sm:inline-block text-[11px] font-medium text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.2 rounded">
                  PILOT
                </span>
              </div>
              <p className="text-[10px] text-slate-500 tracking-wider font-semibold uppercase hidden md:block">
                BELONG • LEARN • CARE • GROW
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Center */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <GlobalSearch onSelectUser={onSelectUserFromSearch} />
        </div>

        {/* Right Section: Role Switcher, Reset, Notifications, User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold shadow-xs transition-all ${roleLabels[role].color} hover:shadow-sm`}
              title="Switch demo role perspective"
            >
              {roleLabels[role].icon}
              <span className="hidden sm:inline">{roleLabels[role].label}</span>
              <span className="sm:hidden capitalize">{role}</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Switch Persona</p>
                  <p className="text-xs text-slate-500">Test platform as different users</p>
                </div>
                <div className="mt-1 space-y-1">
                  {(['admin', 'coordinator', 'mentor', 'junior'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors ${
                        role === r ? 'bg-slate-100 font-bold text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {roleLabels[r].icon}
                        <span>{roleLabels[r].label}</span>
                      </div>
                      {role === r && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => setShowConfirmReset(true)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="Reset system to initial seed data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-medium text-teal-600 hover:text-teal-700"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`p-3.5 text-left transition-colors cursor-pointer ${
                          notif.read ? 'bg-white opacity-70' : 'bg-teal-50/30'
                        } hover:bg-slate-50`}
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1.5 block">
                          {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar & Logout */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs overflow-hidden">
              {currentUser?.avatar_url ? (
                <img src={currentUser.avatar_url} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <span>{currentUser?.name?.charAt(0) || 'U'}</span>
              )}
            </div>
            <div className="hidden xl:block text-left text-xs">
              <p className="font-semibold text-slate-900 leading-tight truncate max-w-[120px]">{currentUser?.name}</p>
              <p className="text-[10px] text-slate-400 capitalize">{role}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-left">
            <h3 className="text-base font-bold text-slate-900 mb-2">Reset Demo Data?</h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              This will restore all mentors, juniors, matches, interactions, goals, and escalations back to the original clean pilot seed state.
            </p>
            <div className="flex justify-end space-x-2.5">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
