import React from 'react';

const PageHeader = ({ title, subtitle, action = null, badge = null }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
          {badge && <span>{badge}</span>}
        </div>
        {subtitle && <p className="text-sm sm:text-base text-slate-500 mt-1.5 leading-relaxed">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
};

export default PageHeader;
