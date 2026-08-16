import React from 'react';

const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase() || '';

  const styles = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    checked_in: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    checked_out: 'bg-slate-100 text-slate-700 border-slate-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    unpaid: 'bg-amber-50 text-amber-700 border-amber-200',
    available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    unavailable: 'bg-rose-50 text-rose-700 border-rose-200',
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200',
    admin: 'bg-purple-50 text-purple-700 border-purple-200',
    user: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  const label = normalizedStatus
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        styles[normalizedStatus] || 'bg-slate-100 text-slate-700 border-slate-200'
      }`}
    >
      {label || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
