import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase().replace(/_/g, ' ');

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'approved':
    case 'published':
    case 'resolved':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'pending':
    case 'suggested':
    case 'draft':
    case 'in_progress':
    case 'under_review':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'overdue':
    case 'critical':
    case 'high':
    case 'suspended':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'referred':
    case 'reassigned':
      colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
    case 'new':
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'inactive':
    case 'closed':
      colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
      break;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center rounded-full border capitalize ${sizeClasses} ${colorClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {normalized}
    </span>
  );
};
