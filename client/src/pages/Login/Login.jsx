import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateEmail } from '../../utils/validators';

const DEMO_ACCOUNTS = [
  { label: 'Guest', email: 'guest@luxurystay.com', password: 'GuestPassword123!' },
  { label: 'Housekeeping', email: 'housekeeping@luxurystay.com', password: 'HousekeepingPass123!' },
  { label: 'Receptionist', email: 'reception@luxurystay.com', password: 'StaffPassword123!' },
  { label: 'Manager', email: 'manager@luxurystay.com', password: 'ManagerPassword123!' },
  { label: 'Admin', email: 'admin@luxurystay.com', password: 'AdminPassword123!' },
];

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectParam = queryParams.get('redirect');
  const redirectTarget = redirectParam || location.state?.from?.pathname || '/my-bookings';
  const redirectMessage = location.state?.message || (redirectParam ? 'Please Login First to Book a Room' : '');

  const handleLoginSubmit = async (credentials) => {
    setError('');
    const emailErr = validateEmail(credentials.email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    setLoading(true);
    try {
      const res = await login(credentials);
      const userRole = res?.user?.role || res?.role;
      if (['admin', 'manager', 'receptionist', 'housekeeping'].includes(userRole)) {
        navigate('/admin', { replace: true });
      } else {
        navigate(redirectTarget, { replace: true });
      }
    } catch (err) {
      setError(err?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginSubmit(formData);
  };

  const handleDemoLogin = (account) => {
    setFormData({ email: account.email, password: account.password });
    handleLoginSubmit({ email: account.email, password: account.password });
  };

  return (
    <section className="motela-section motela-section--alt" style={{ minHeight: '70vh' }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 34 }}>
          <p className="motela-eyebrow">LuxuryStay Hospitality</p>
          <h1 className="motela-title" style={{ marginBottom: 8 }}>Sign in</h1>
          <p className="motela-text" style={{ fontSize: 14 }}>
            Access your reservations, or open the staff portal.
          </p>
        </div>

        <div className="motela-panel">
          {redirectMessage && (
            <div className="motela-alert" style={{ background: '#fdf6ed', borderColor: '#c19c77', color: '#8a5a2b', marginBottom: 16 }}>
              {redirectMessage}
            </div>
          )}
          {error && <div className="motela-alert motela-alert--error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 20 }}>
              <label className="motela-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                className="motela-input"
                placeholder="you@example.com"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div style={{ marginBottom: 26 }}>
              <label className="motela-label" htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="motela-input"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  style={{ paddingRight: 74 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 11,
                    letterSpacing: 1.4,
                    textTransform: 'uppercase',
                    color: '#c19c77',
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="submit" className="motela-btn" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div style={{ marginTop: 28, paddingTop: 22, borderTop: '1px solid #eee' }}>
            <p className="motela-eyebrow" style={{ textAlign: 'center', marginBottom: 14 }}>
              Demo accounts
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  className="motela-chip"
                  onClick={() => handleDemoLogin(account)}
                >
                  {account.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="motela-text" style={{ textAlign: 'center', marginTop: 24, fontSize: 14 }}>
          No account yet?{' '}
          <Link to="/register" style={{ color: '#c19c77', textDecoration: 'underline' }}>
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
