import React, { useState } from 'react';
import { Shield, KeyRound, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface LoginPageProps {
  onSuccessLogin?: () => void;
  onBackToLanding?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccessLogin, onBackToLanding }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@university.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [showForgotNotice, setShowForgotNotice] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts: { role: UserRole; name: string; email: string; label: string }[] = [
    { role: 'admin', name: 'Prof. Sundaram (DSW)', email: 'admin@university.edu', label: 'Super Admin' },
    { role: 'coordinator', name: 'Dr. Sunita Raman (CSE)', email: 'coordinator@university.edu', label: 'Coordinator' },
    { role: 'mentor', name: 'Aarav Sharma (7th Sem)', email: 'mentor@university.edu', label: 'Senior Mentor' },
    { role: 'junior', name: 'Aditi Deshpande (1st Sem)', email: 'junior@university.edu', label: 'Junior Student' }
  ];

  const handleSelectAccount = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setSelectedRole(acc.role);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your university email address.');
      return;
    }
    const success = login(email, selectedRole);
    if (success && onSuccessLogin) {
      onSuccessLogin();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-teal-100 selection:text-teal-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Icon */}
        <div 
          onClick={onBackToLanding}
          className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-teal-700/20 cursor-pointer hover:scale-105 transition-transform"
        >
          <span className="font-serif font-black text-2xl">Ā</span>
        </div>
        
        <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
          ĀNANDA
        </h2>
        <p className="text-sm font-semibold text-teal-800">
          Senior–Junior Guidance Connect
        </p>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          BELONG • LEARN • CARE • GROW
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-200">
          {error && (
            <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Persona Switcher */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Demo Persona (1-Click)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map(acc => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleSelectAccount(acc)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedRole === acc.role
                      ? 'border-teal-600 bg-teal-50/70 ring-1 ring-teal-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-xs font-bold text-slate-900">{acc.label}</span>
                  <span className="block text-[11px] text-slate-500 truncate">{acc.name}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                University Email
              </label>
              <div className="mt-1.5 relative rounded-xl shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="student@university.edu"
                  className="block w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotNotice(!showForgotNotice)}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                >
                  Forgot password?
                </button>
              </div>
              <div className="mt-1.5 relative rounded-xl shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <KeyRound className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            {showForgotNotice && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                Institutional pilot uses single-sign-on test passwords. Simply click <strong>Login</strong> with any of the selected demo roles.
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-md shadow-teal-700/20 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all"
              >
                <span>Login as {demoAccounts.find(a => a.role === selectedRole)?.label}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {onBackToLanding && (
            <div className="mt-6 text-center">
              <button
                onClick={onBackToLanding}
                className="text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                ← Back to ĀNANDA Overview
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
