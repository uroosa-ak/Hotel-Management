import React from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, ArrowLeft } from '../../components/common/icons';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-slate-50 py-16 px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-100">
        <div className="inline-flex p-4 bg-amber-500/10 text-amber-600 rounded-3xl">
          <BedDouble size={48} />
        </div>
        <h1 className="text-6xl font-bold text-slate-900 font-serif">404</h1>
        <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          The sanctuary or suite page you are seeking does not exist or may have been relocated.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="btn-accent inline-flex items-center gap-2 text-xs font-semibold px-6 py-3"
          >
            <ArrowLeft size={16} />
            <span>Return to LuxuryStay Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
