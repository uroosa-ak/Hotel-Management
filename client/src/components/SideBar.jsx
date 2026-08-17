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
} from './common/icons';

const SideBar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/rooms', icon: BedDouble, label: 'Manage Rooms' },
    { path: '/admin/bookings', icon: CalendarDays, label: 'Bookings' },
    { path: '/admin/users', icon: Users, label: 'User Directory' },
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
                Admin Portal
              </h2>
              <p className="text-[10px] text-amber-400 font-medium">Grand Hotel Systems</p>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Public Website</span>
        </Link>

        <div className="px-4 py-3 bg-slate-800/60 rounded-xl">
          <p className="text-xs text-slate-400">Logged in as:</p>
          <p className="text-sm font-semibold text-white truncate">
            {user?.firstName} {user?.lastName || 'Administrator'}
          </p>
          <p className="text-[11px] text-amber-400 font-mono mt-0.5">{user?.email}</p>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          <span>Log Out Admin</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
