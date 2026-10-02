import React from 'react';
import { AlertTriangle, Clock, Target, Flag, MessageSquareWarning, ArrowRight } from 'lucide-react';
import { AttentionItem } from '../../services/analyticsService';

interface AttentionRequiredProps {
  items: AttentionItem[];
  onSelectItem: (item: AttentionItem) => void;
}

export const AttentionRequired: React.FC<AttentionRequiredProps> = ({ items, onSelectItem }) => {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-emerald-800 flex items-center space-x-3">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
        <p className="text-sm font-medium">All systems normal: No pending escalations, inactive groups, or overdue actions.</p>
      </div>
    );
  }

  const getIcon = (type: AttentionItem['type']) => {
    switch (type) {
      case 'escalation':
        return <Flag className="w-4 h-4 text-rose-600" />;
      case 'inactive_group':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'overdue_action':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'low_feedback':
        return <MessageSquareWarning className="w-4 h-4 text-purple-600" />;
      case 'no_goal':
      default:
        return <Target className="w-4 h-4 text-blue-600" />;
    }
  };

  const getBorderColor = (severity: AttentionItem['severity']) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'border-l-rose-500 bg-rose-50/40 hover:bg-rose-50/80';
      case 'medium':
        return 'border-l-amber-500 bg-amber-50/40 hover:bg-amber-50/80';
      case 'low':
      default:
        return 'border-l-blue-400 bg-slate-50/70 hover:bg-slate-100/70';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center space-x-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight">Attention Required</h3>
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
            {items.length}
          </span>
        </div>
        <span className="text-xs text-slate-400">Click any item to take direct action</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.slice(0, 6).map(item => (
          <button
            key={item.id}
            onClick={() => onSelectItem(item)}
            className={`text-left p-3 rounded-xl border border-slate-200 border-l-4 transition-all duration-150 flex flex-col justify-between group ${getBorderColor(item.severity)}`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-1.5">
                  {getIcon(item.type)}
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[210px]">{item.title}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>
            <div className="mt-2 text-[10px] uppercase font-semibold text-slate-400">
              Severity: {item.severity}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
