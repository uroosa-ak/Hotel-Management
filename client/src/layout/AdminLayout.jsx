import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
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
  ExternalLink,
  Users as GuestIcon,
  CreditCard,
  MessageSquare,
  Tag,
  Percent,
  Package,
  BarChart3,
  Settings,
  ShieldAlert,
  ClipboardList,
  ShieldCheck,
} from '../components/common/icons';
import NotificationBell from '../components/common/NotificationBell';

const DEMO_ROLES = [
  { role: 'admin', label: 'Super Admin', email: 'admin@luxurystay.com', password: 'AdminPassword123!', icon: '👑' },
  { role: 'manager', label: 'Manager', email: 'manager@luxurystay.com', password: 'ManagerPassword123!', icon: '👔' },
  { role: 'receptionist', label: 'Receptionist', email: 'reception@luxurystay.com', password: 'StaffPassword123!', icon: '🛎️' },
  { role: 'housekeeping', label: 'Housekeeping', email: 'housekeeping@luxurystay.com', password: 'HousekeepingPass123!', icon: '🧹' },
];

const ROLE_LABELS = {
  admin: 'Super Admin',
  manager: 'Manager',
  receptionist: 'Receptionist',
  housekeeping: 'Housekeeping',
  guest: 'Guest',
};

const AdminLayout = () => {
  const { logout, login, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);

  const userRole = user?.role || 'admin';

  // Role-based menu filtering
  const allNavItems = [
    {
      path: '/admin',
      icon: LayoutDashboard,
      label: 'Executive Dashboard',
      allowedRoles: ['admin', 'manager', 'receptionist', 'housekeeping'],
    },
    {
      path: '/admin/check-in-out',
      icon: CheckCircle,
      label: 'Front Desk / Check-In',
      allowedRoles: ['admin', 'manager', 'receptionist'],
    },
    {
      path: '/admin/rooms',
      icon: BedDouble,
      label: 'Room Inventory',
      allowedRoles: ['admin', 'manager', 'receptionist', 'housekeeping'],
    },
    {
      path: '/admin/bookings',
      icon: CalendarDays,
      label: 'Reservations',
      allowedRoles: ['admin', 'manager', 'receptionist'],
    },
    {
      path: '/admin/housekeeping',
      icon: Sparkles,
      label: 'Housekeeping & Maintenance',
      allowedRoles: ['admin', 'manager', 'receptionist', 'housekeeping'],
    },
    {
      path: '/admin/guests',
      icon: GuestIcon,
      label: 'Guest Directory (CRM)',
      allowedRoles: ['admin', 'manager', 'receptionist'],
    },
    {
      path: '/admin/payments',
      icon: CreditCard,
      label: 'Billing & Payments',
      allowedRoles: ['admin', 'manager', 'receptionist'],
    },
    {
      path: '/admin/inventory',
      icon: Package,
      label: 'Inventory & Supplies',
      allowedRoles: ['admin', 'manager', 'housekeeping'],
    },
    {
      path: '/admin/feedback',
      icon: MessageSquare,
      label: 'Feedback & Ratings',
      allowedRoles: ['admin', 'manager'],
    },
    {
      path: '/admin/promotions',
      icon: Tag,
      label: 'Promotions',
      allowedRoles: ['admin', 'manager'],
    },
    {
      path: '/admin/taxes',
      icon: Percent,
      label: 'Taxes',
      allowedRoles: ['admin', 'manager'],
    },
    {
      path: '/admin/reports',
      icon: BarChart3,
      label: 'Reports & Analytics',
      allowedRoles: ['admin', 'manager'],
    },
    {
      path: '/admin/users',
      icon: Users,
      label: 'Staff & Guest Directory',
      allowedRoles: ['admin', 'manager'],
    },
    {
      path: '/admin/roles',
      icon: ShieldCheck,
      label: 'Roles & Permissions',
      allowedRoles: ['admin', 'manager'],
    },
    {
      path: '/admin/settings',
      icon: Settings,
      label: 'System Settings',
      allowedRoles: ['admin'],
    },
    {
      path: '/admin/security',
      icon: ShieldAlert,
      label: 'Security Center',
      allowedRoles: ['admin'],
    },
    {
      path: '/admin/audit-logs',
      icon: ClipboardList,
      label: 'Audit Logs',
      allowedRoles: ['admin'],
    },
  ];

  const navItems = allNavItems.filter((item) => item.allowedRoles.includes(userRole));

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleQuickRoleSwitch = async (demo) => {
    if (user?.email === demo.email) return;
    setSwitchingRole(true);
    try {
      await login({ email: demo.email, password: demo.password });
      navigate('/admin');
    } catch (err) {
      console.error('Failed to switch role', err);
    } finally {
      setSwitchingRole(false);
    }
  };

  return (
    <div className="app-shell min-h-screen flex bg-[#f7f6f3]" style={{ fontFamily: "'Jost', sans-serif" }}>
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#161616] text-white px-5 h-16 flex items-center justify-between shadow-lg border-b border-[#c19c77]/20">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#c19c77]/15 rounded text-[#c19c77]">
            <Shield size={18} />
          </div>
          <span className="font-serif font-bold text-sm tracking-widest text-[#d6cbbf] uppercase">
            LuxuryStay <span className="text-[#c19c77] font-sans font-normal text-xs">Portal</span>
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-[#d6cbbf] hover:text-white rounded cursor-pointer"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Luxury Obsidian & Gold Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#141414] text-[#d6cbbf] flex flex-col justify-between border-r border-[#c19c77]/20 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-[#c19c77]/15 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3.5 group">
              <div className="p-2.5 bg-gradient-to-br from-[#c19c77] to-[#8c6f50] rounded-sm text-white shadow-md shadow-[#c19c77]/20 group-hover:scale-105 transition-transform">
                <Shield size={22} />
              </div>
              <div>
                <h2 className="text-base font-serif font-semibold text-[#f4ece4] tracking-wide">
                  LuxuryStay
                </h2>
                <p className="text-[11px] text-[#c19c77] tracking-widest uppercase font-medium">
                  Staff Management
                </p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#a89d91] hover:text-white"
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
          </div>

          {/* Current Role Tag */}
          <div className="px-6 pt-5 pb-3">
            <div className="p-3 bg-[#1c1c1c] border border-[#c19c77]/25 rounded flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#a89d91]">Active View</p>
                <p className="text-sm font-serif font-bold text-[#f4ece4]">{ROLE_LABELS[userRole] || userRole}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#c19c77]/20 text-[#c19c77] border border-[#c19c77]/40">
                Live Session
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            <p className="px-3 pb-1 text-[11px] font-semibold text-[#8c8275] uppercase tracking-widest">
              Navigation
            </p>
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-sm text-sm tracking-wide transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#c19c77] to-[#a9865f] text-white font-medium shadow-md shadow-[#c19c77]/25'
                      : 'text-[#b0a89f] hover:bg-white/5 hover:text-[#f4ece4]'
                  }`}
                >
                  <item.icon size={18} className={active ? 'text-white' : 'text-[#c19c77]'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Account Section */}
        <div className="p-5 border-t border-[#c19c77]/15 space-y-3">
          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2 text-xs font-medium text-[#b0a89f] hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft size={14} />
              <span>Return to Website</span>
            </span>
            <ExternalLink size={12} className="text-[#c19c77]" />
          </Link>

          <div className="p-3 bg-[#1a1a1a] border border-white/5 rounded-sm">
            <p className="text-[10px] text-[#8c8275] uppercase tracking-wider">Logged In Staff</p>
            <p className="text-sm font-medium text-white truncate mt-0.5">
              {user?.firstName || user?.username} {user?.lastName || ''}
            </p>
            <p className="text-[11px] text-[#c19c77] truncate">{user?.email}</p>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#e07a5f] hover:bg-[#e07a5f]/10 border border-[#e07a5f]/20 rounded transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col pt-16 lg:pt-0 overflow-y-auto">
        {/* Luxury Top Header Bar */}
        <header className="bg-white border-b border-[#eae5de] px-6 lg:px-8 py-4 shadow-xs sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#8c8275] font-semibold">
              Hospitality Management Console
            </span>
            <h1 className="text-xl lg:text-2xl font-serif font-bold text-[#1c1c1c] tracking-tight">
              {navItems.find((n) => isActive(n.path))?.label || 'Management Portal'}
            </h1>
          </div>

          <NotificationBell />

          {/* Fast Role Switcher for Demo / Inspection */}
          <div className="flex items-center gap-2 bg-[#f7f6f3] p-1.5 rounded border border-[#eae5de] flex-wrap">
            <span className="text-[11px] font-semibold text-[#736d65] uppercase tracking-wider px-2">
              Role Switcher:
            </span>
            {DEMO_ROLES.map((demo) => {
              const isCurrent = userRole === demo.role;
              return (
                <button
                  key={demo.role}
                  type="button"
                  disabled={switchingRole}
                  onClick={() => handleQuickRoleSwitch(demo)}
                  className={`px-3 py-1 text-xs rounded transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
                    isCurrent
                      ? 'bg-[#c19c77] text-white shadow-xs font-semibold'
                      : 'bg-white text-[#5c5c5c] hover:text-[#1c1c1c] hover:bg-[#ede9e2] border border-[#e2ddd5]'
                  }`}
                  title={`Switch to ${demo.label} (${demo.email})`}
                >
                  <span>{demo.icon}</span>
                  <span>{demo.label}</span>
                </button>
              );
            })}
          </div>
        </header>

        {/* Page View */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
