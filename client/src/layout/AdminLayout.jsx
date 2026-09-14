import { useState } from 'react';
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
    { path: '/admin/rooms', icon: BedDouble, label: 'Manage Rooms' },
    { path: '/admin/bookings', icon: CalendarDays, label: 'Reservations' },
    { path: '/admin/housekeeping', icon: Sparkles, label: 'Housekeeping' },
    { path: '/admin/users', icon: Users, label: 'Staff & Guests' },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="app-shell min-h-screen flex bg-background">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-primary text-white px-4 h-16 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <BedDouble className="text-accent" size={22} />
          <span className="font-semibold text-sm uppercase tracking-widest">LuxuryStay</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-white/70 hover:text-white rounded-lg cursor-pointer"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary text-white flex flex-col justify-between transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 bg-accent/15 rounded text-accent">
                <Shield size={22} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white uppercase tracking-widest font-serif">
                  Staff Portal
                </h2>
                <p className="text-[10px] text-accent tracking-wider">LuxuryStay Hospitality</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white"
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded text-sm transition-all ${
                    active
                      ? 'bg-accent text-white font-semibold'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to website</span>
          </Link>

          <div className="px-4 py-3 bg-white/5 rounded">
            <p className="text-[11px] text-white/50 uppercase tracking-wider">Signed in as</p>
            <p className="text-sm font-semibold text-white truncate">
              {user?.firstName || user?.username} {user?.lastName || ''}
            </p>
            <p className="text-[11px] text-accent mt-0.5 truncate">{user?.email}</p>
            <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{user?.role}</p>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-danger hover:bg-danger/10 rounded transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 min-w-0 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
