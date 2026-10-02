import React from 'react';
import { 
  ArrowRight, ShieldCheck, CheckCircle2, Sparkles, 
  Target, Heart, Compass, Users2, ArrowUpRight 
} from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onExploreDemo }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-teal-100 selection:text-teal-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <span className="font-serif font-black text-xl">Ā</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-slate-900">ĀNANDA</span>
                <span className="text-[10px] font-semibold tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full uppercase">
                  Institutional Pilot
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Senior–Junior Guidance Connect</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onExploreDemo}
              className="text-xs font-semibold text-slate-700 hover:text-teal-700 px-3 py-2 rounded-xl transition-colors hidden sm:block"
            >
              Explore Live Demo
            </button>
            <button
              onClick={onLoginClick}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-700/20 hover:bg-teal-800 transition-all"
            >
              <span>University Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold tracking-wider uppercase mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
              <span>BELONG • LEARN • CARE • GROW</span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              ĀNANDA
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-teal-800 mt-2">
              Senior–Junior Guidance Connect
            </p>

            {/* Core Description */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              &ldquo;Connecting first-semester students with experienced seniors for realistic, 
              experience-based and actionable guidance.&rdquo;
            </p>

            {/* Clarification callout */}
            <div className="mt-4 text-xs font-medium text-slate-500 max-w-lg mx-auto bg-slate-100/80 py-2 px-4 rounded-xl border border-slate-200">
              This is <strong>not</strong> an LMS, placement portal, or social network. It is a structured 
              university progress-monitoring and senior guidance platform.
            </div>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onLoginClick}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm shadow-lg shadow-teal-700/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>Enter University Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onExploreDemo}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-xs flex items-center justify-center space-x-2 transition-all"
              >
                <span>Explore Live Platform</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Quote Banner */}
            <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-slate-900 text-white text-left shadow-xl max-w-3xl mx-auto border border-navy-700/50">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0 text-teal-300">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold tracking-widest text-teal-400 mb-1">
                    The ĀNANDA Philosophy
                  </p>
                  <p className="text-lg sm:text-xl font-medium italic text-slate-100 leading-snug">
                    &ldquo;Do not impress your junior with how much you know. Help your junior understand what to do next.&rdquo;
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Every interaction results in 1 or 2 realistic next actions, building fundamentals before chasing trends.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How It Works</h2>
              <p className="text-sm font-semibold text-teal-700 tracking-wider uppercase mt-1">
                CONNECT → GUIDE → ACT → REFLECT → GROW
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { step: '1', title: 'Connect', desc: 'Seniors & juniors paired through multi-factor academic & interest matching.' },
                { step: '2', title: 'Guide', desc: 'Honest senior conversations on what worked, what failed, and study routines.' },
                { step: '3', title: 'Act', desc: 'Every check-in leaves maximum two concrete, achievable next action items.' },
                { step: '4', title: 'Reflect', desc: '5-question monthly pulse captures confidence, clarity, and feedback.' },
                { step: '5', title: 'Grow', desc: 'Overcoming initial college anxiety to build lasting technical & personal confidence.' }
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <span className="w-7 h-7 rounded-lg bg-teal-700 text-white font-bold text-xs flex items-center justify-center mb-3">
                      {item.step}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Principles Section */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Principles</h2>
              <p className="text-sm text-slate-500 mt-1">Guardrails that protect junior student wellbeing and genuine learning</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Experience Over Theory',
                  desc: 'Seniors share real experiences of their 1st semester: what worked, what failed, and what they would do differently.'
                },
                {
                  title: 'Fundamentals Before Trends',
                  desc: 'Mastering C syntax, calculus, and lab safety comes before jumping into complex frameworks or artificial hype.'
                },
                {
                  title: 'Action Over Overload',
                  desc: 'No laundry lists of 10 tutorials. Every mentoring conversation limits next steps to 1 or 2 clear actions.'
                },
                {
                  title: 'Guidance Without Guarantees',
                  desc: 'A senior mentor is a guide, not a recruiter, placement officer, or motivational speaker.'
                },
                {
                  title: 'Escalate When Support is Needed',
                  desc: 'Wellbeing, harassment, safety, or academic crisis are immediately referred to designated university counseling.'
                },
                {
                  title: 'Institutional Improvement',
                  desc: 'Analytics are used to discover inactive groups and help students, never to pit mentors against one another.'
                }
              ].map((p, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-start">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center mb-3.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{p.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">ĀNANDA Guidance Connect</span>
            <span>•</span>
            <span>University Pilot Platform</span>
          </div>
          <div>
            Dean of Student Welfare (DSW) & Academic Coordination Cell
          </div>
        </div>
      </footer>
    </div>
  );
};
