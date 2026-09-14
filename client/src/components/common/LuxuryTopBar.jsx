import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiCalendar, FiLogOut, FiPhone, FiMapPin, FiShield } from 'react-icons/fi';

const LuxuryTopBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch {
      // fallback
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#161616',
        color: '#d6cbbf',
        fontFamily: "'Jost', sans-serif",
        fontSize: '13px',
        borderBottom: '1px solid rgba(193, 156, 119, 0.25)',
        position: 'relative',
        zIndex: 99999,
        lineHeight: 1.4,
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '8px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        {/* Contact info on the left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#c19c77' }}>
            <FiMapPin size={13} />
            <span style={{ color: '#d6cbbf' }}>Paradise Bay Waterfront, Fl</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#c19c77' }}>
            <FiPhone size={13} />
            <span style={{ color: '#d6cbbf' }}>+1 (800) 555-STAY</span>
          </span>
        </div>

        {/* User / Auth navigation on the right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {isAuthenticated ? (
            <>
              <span style={{ color: '#c19c77', fontWeight: 500 }}>
                Welcome, {user?.name || user?.email?.split('@')[0] || 'Guest'}
              </span>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    backgroundColor: '#c19c77',
                    color: '#ffffff',
                    borderRadius: '2px',
                    fontWeight: 600,
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a9865f')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#c19c77')}
                >
                  <FiShield size={12} />
                  Admin Portal
                </Link>
              )}

              <Link
                to="/my-bookings"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#c19c77')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
              >
                <FiCalendar size={13} />
                My Bookings
              </Link>

              <Link
                to="/profile"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#c19c77')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
              >
                <FiUser size={13} />
                Profile
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'transparent',
                  border: 'none',
                  color: '#d6cbbf',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  padding: 0,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#e07a5f')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#d6cbbf')}
              >
                <FiLogOut size={13} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#c19c77')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
              >
                Sign In
              </Link>

              <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>

              <Link
                to="/register"
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#c19c77')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
              >
                Register
              </Link>
            </>
          )}

          <Link
            to="/booking"
            style={{
              padding: '4px 14px',
              backgroundColor: 'transparent',
              border: '1px solid #c19c77',
              color: '#c19c77',
              borderRadius: '2px',
              fontWeight: 600,
              fontSize: '11px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              marginLeft: '4px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#c19c77';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#c19c77';
            }}
          >
            Instant Reservation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LuxuryTopBar;
