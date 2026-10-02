import React, { useState } from 'react';
import { Settings, Save, RotateCcw, Sliders, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const SettingsView: React.FC = () => {
  const { programSettings, updateSettings } = useData();

  const [programName, setProgramName] = useState(programSettings.program_name);
  const [tagline, setTagline] = useState(programSettings.tagline);
  const [startDate, setStartDate] = useState(programSettings.pilot_start_date);
  const [endDate, setEndDate] = useState(programSettings.pilot_end_date);
  const [thresholdDays, setThresholdDays] = useState(programSettings.interaction_threshold_days);
  const [maxJuniors, setMaxJuniors] = useState(programSettings.max_juniors_per_mentor);

  const [weights, setWeights] = useState(programSettings.matching_weights);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      program_name: programName,
      tagline: tagline,
      pilot_start_date: startDate,
      pilot_end_date: endDate,
      interaction_threshold_days: Number(thresholdDays),
      max_juniors_per_mentor: Number(maxJuniors),
      matching_weights: weights
    });
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Settings className="w-6 h-6 text-teal-700" />
            <h2 className="text-xl font-bold text-slate-900">Program Settings & Thresholds</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure institutional parameters, inactive group thresholds, and algorithmic matching weights
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Program Info */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Program Identity</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Program Name
              </label>
              <input
                type="text"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Program Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* 90-Day Pilot Configuration */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Pilot Dates & Operational Thresholds</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Pilot Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Pilot End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Inactive Alert (Days)
              </label>
              <input
                type="number"
                min="7"
                max="60"
                value={thresholdDays}
                onChange={(e) => setThresholdDays(Number(e.target.value))}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
              />
              <span className="text-[10px] text-slate-400">Default: 21 days</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Max Juniors Per Mentor
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={maxJuniors}
                onChange={(e) => setMaxJuniors(Number(e.target.value))}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
              />
              <span className="text-[10px] text-slate-400">Default: 3 or 4</span>
            </div>
          </div>
        </div>

        {/* Algorithm Weights */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Matching Engine Factor Weights</h3>
            <span className="text-xs text-teal-700 font-medium">Sum should equal 100%</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { key: 'program', label: 'Program Match', val: weights.program },
              { key: 'interest', label: 'Interests', val: weights.interest },
              { key: 'guidance', label: 'Guidance Area', val: weights.guidance },
              { key: 'skill', label: 'Tech / Skills', val: weights.skill },
              { key: 'availability', label: 'Availability', val: weights.availability },
              { key: 'experience', label: 'Experience', val: weights.experience }
            ].map(item => (
              <div key={item.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="block text-xs font-semibold text-slate-700">{item.label}</span>
                <span className="text-base font-bold text-teal-800">{Math.round(item.val * 100)}%</span>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  value={item.val}
                  onChange={(e) => {
                    setWeights({
                      ...weights,
                      [item.key]: parseFloat(e.target.value)
                    });
                  }}
                  className="w-full mt-2 accent-teal-600 h-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            className="flex items-center space-x-1.5 px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-teal-700/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Program Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
