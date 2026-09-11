import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  Users,
  LogOut,
  X,
  Shield,
  ArrowLeft,
  Sparkles,
  CheckCircle,
} from './common/icons';

const SideBar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/check-in-out', icon: CheckCircle, label: 'Front Desk / Check-In' },
    { path: '/admin/rooms', icon: BedDouble, label: 'Manage Suites' },
    { path: '/admin/bookings', icon: CalendarDays, label: 'Reservations' },
    { path: '/admin/housekeeping', icon: Sparkles, label: 'Housekeeping' },
    { path: '/admin/users', icon: Users, label: 'Staff & Guests' },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between transform transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div>
        {/* Brand header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Shield size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Staff Portal
              </h2>
              <p className="text-[10px] text-amber-400 font-medium">LuxuryStay Hospitality</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  active
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <item.icon size={18} className={active ? 'text-white' : 'text-slate-400'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Exit */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Exit to Guest Site</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
