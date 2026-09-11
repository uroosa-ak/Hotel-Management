import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  Users,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Shield,
  Sparkles,
  CheckCircle,
} from '../components/common/icons';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen flex bg-slate-100 font-sans">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 text-white px-4 h-16 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <BedDouble className="text-amber-400" size={22} />
          <span className="font-bold text-sm uppercase tracking-wider">LuxuryStay Management</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg cursor-pointer"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
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
              onClick={() => setSidebarOpen(false)}
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
                  onClick={() => setSidebarOpen(false)}
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

      {/* Backdrop overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Admin Content Area */}
      <main className="flex-1 min-w-0 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
