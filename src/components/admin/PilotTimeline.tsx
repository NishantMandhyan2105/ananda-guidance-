import React from 'react';
import { Calendar, CheckCircle2, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { ProgramSettings } from '../../types';

interface PilotTimelineProps {
  settings: ProgramSettings;
}

export const PilotTimeline: React.FC<PilotTimelineProps> = ({ settings }) => {
  // Calculate elapsed days
  const start = new Date(settings.pilot_start_date || '2026-08-01');
  const now = new Date();
  const elapsedDays = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const totalDays = 90;
  const progressPercent = Math.min(100, Math.round((elapsedDays / totalDays) * 100));

  // Determine current phase based on elapsed days:
  // Phase 1: 0 - 14 days
  // Phase 2: 15 - 28 days
  // Phase 3: 29 - 60 days
  // Phase 4: 61 - 90 days
  // Phase 5: > 90 days
  let currentPhaseIndex = 2; // currently around Day 59 in late September!
  if (elapsedDays <= 14) currentPhaseIndex = 0;
  else if (elapsedDays <= 28) currentPhaseIndex = 1;
  else if (elapsedDays <= 60) currentPhaseIndex = 2;
  else if (elapsedDays <= 90) currentPhaseIndex = 3;
  else currentPhaseIndex = 4;

  const phases = [
    {
      num: 1,
      title: 'Phase 1: Registration & Baselines',
      weeks: 'Weeks 1–2 (Days 1–14)',
      summary: 'Register senior mentors and first-semester juniors.',
      deliverables: [
        'Capture interests, skills, achievements and guidance areas',
        'Establish initial student goals and expectations',
        'Complete baseline cohort demographic profiles'
      ]
    },
    {
      num: 2,
      title: 'Phase 2: Matching & First Connect',
      weeks: 'Weeks 3–4 (Days 15–28)',
      summary: 'Create mentor-junior matches and complete kickoff interactions.',
      deliverables: [
        'Run weighted compatibility matching algorithm',
        'Administrator approval of matched pairs',
        'Conduct 1st in-person mentoring orientation session',
        'Agree on initial 1–2 fundamental action items'
      ]
    },
    {
      num: 3,
      title: 'Phase 3: Action Tracking & Pulse 1',
      weeks: 'Month 2 (Days 29–60)',
      summary: 'Monitor action item progress, second check-in, and monthly pulse.',
      deliverables: [
        'Track completion of agreed action items',
        'Identify inactive groups exceeding threshold days',
        'Collect first 5-Question Monthly Junior Pulse',
        'Conduct 2nd mentoring check-in for mid-term review'
      ]
    },
    {
      num: 4,
      title: 'Phase 4: Impact & Success Stories',
      weeks: 'Month 3 (Days 61–90)',
      summary: 'Measure clarity, confidence, action rates, and capture stories.',
      deliverables: [
        'Evaluate goal clarity & guidance usefulness metrics',
        'Review and publish verified student success stories',
        'Address lingering escalations and academic referrals',
        'Execute final 3rd interaction and semester prep'
      ]
    },
    {
      num: 5,
      title: 'Phase 5: Institutional Review & Scale',
      weeks: 'Post 90 Days',
      summary: 'Review pilot analytics, refine matching logic, and scale.',
      deliverables: [
        'Generate Dean of Student Welfare executive report',
        'Calculate net student retention & academic impact',
        'Refine matching weights based on outcome feedback',
        'Plan university-wide expansion for next academic cycle'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-teal-700" />
              <h2 className="text-xl font-bold text-slate-900">90-Day Institutional Pilot Timeline</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Structured rollout phases for ĀNANDA Senior–Junior Guidance Connect
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pilot Progress</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg font-black text-teal-800">Day {elapsedDays}</span>
                <span className="text-xs text-slate-400 font-medium">/ 90</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Phase</span>
              <span className="text-xs font-bold text-teal-900 bg-teal-100/70 px-2 py-0.5 rounded-full inline-block mt-0.5">
                Phase {currentPhaseIndex + 1}
              </span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>Pilot Start: {settings.pilot_start_date}</span>
            <span className="font-semibold text-slate-700">{progressPercent}% Completed</span>
            <span>Pilot End: {settings.pilot_end_date}</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-teal-600 to-emerald-500 rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phase Cards Timeline */}
      <div className="grid grid-cols-1 gap-4">
        {phases.map((phase, idx) => {
          const isCurrent = idx === currentPhaseIndex;
          const isPassed = idx < currentPhaseIndex;

          return (
            <div
              key={phase.num}
              className={`rounded-2xl border p-5 transition-all text-left ${
                isCurrent
                  ? 'border-teal-500 bg-teal-50/20 ring-2 ring-teal-500/20 shadow-md'
                  : isPassed
                  ? 'border-emerald-200 bg-white shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isPassed
                      ? 'bg-emerald-100 text-emerald-800'
                      : isCurrent
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : phase.num}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{phase.title}</h3>
                    <span className="text-xs text-slate-500">{phase.weeks}</span>
                  </div>
                </div>

                <div>
                  {isCurrent && (
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold animate-pulse">
                      <Clock className="w-3 h-3" />
                      <span>ACTIVE PHASE</span>
                    </span>
                  )}
                  {isPassed && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      <span>Completed</span>
                    </span>
                  )}
                  {!isCurrent && !isPassed && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                      <span>Upcoming</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3.5">
                <p className="text-xs text-slate-700 font-medium mb-3">
                  {phase.summary}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {phase.deliverables.map((item, dIdx) => (
                    <div key={dIdx} className="flex items-start space-x-2 text-xs text-slate-600 bg-white/70 p-2.5 rounded-xl border border-slate-100">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        isCurrent ? 'bg-teal-600' : isPassed ? 'bg-emerald-500' : 'bg-slate-300'
                      }`} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
