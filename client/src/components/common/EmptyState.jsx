import React from 'react';
import { Package } from './icons';

const EmptyState = ({
  icon: Icon = Package,
  title = 'No items found',
  message = 'There is no data to display at the moment.',
  action = null,
}) => {
  return (
    <div className="text-center py-12 px-4 bg-white rounded-xl border border-slate-100 my-4">
      <div className="inline-flex p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
        <Icon size={36} />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">{message}</p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
};

export default EmptyState;
