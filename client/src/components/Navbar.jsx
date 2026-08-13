import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { Menu, X, BedDouble, User, LogOut, Calendar, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/rooms', label: 'Rooms' },
  ];

  const authLinks = [
    { to: '/my-bookings', label: 'My Bookings', icon: Calendar },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-primary text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <BedDouble className="text-accent" size={24} />
            <span className="text-xl font-bold">Grand Hotel</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-accent transition-colors">
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                {authLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="hover:text-accent transition-colors flex items-center gap-1">
                    <link.icon size={16} />
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link to="/admin" className="hover:text-accent transition-colors flex items-center gap-1">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors">
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="hover:text-accent transition-colors">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-secondary border-t border-gray-700 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="block py-2 hover:text-accent">
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              {authLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="block py-2 hover:text-accent flex items-center gap-2">
                  <link.icon size={16} /> {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-2 hover:text-accent flex items-center gap-2">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="block py-2 text-red-400 flex items-center gap-2">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2 hover:text-accent">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block py-2 text-accent font-medium">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;