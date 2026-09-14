import React from 'react';

const PageHeader = ({ title, subtitle, action = null, badge = null, image = null }) => {
  if (image) {
    return (
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 mb-10">
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50" />
        <div className="relative px-6 py-14 sm:py-20 text-center">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-serif">{title}</h1>
            {badge && <span>{badge}</span>}
          </div>
          {subtitle && (
            <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
          {action && <div className="flex items-center justify-center gap-3 mt-6">{action}</div>}
        </div>
      </div>
    );
  }

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
