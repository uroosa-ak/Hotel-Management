import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, Hotel, Shield } from '../../components/common/icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(formData);
      // If admin, go to /admin by default if no prior route was requested
      if (res?.user?.role === 'admin' && from === '/') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err?.message || 'Invalid email or password credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role) => {
    if (role === 'admin') {
      setFormData({ email: 'admin@grandhotel.com', password: 'adminpassword123' });
    } else {
      setFormData({ email: 'guest@grandhotel.com', password: 'guestpassword123' });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl mb-4 text-amber-500">
            <Hotel size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Sign in to access your hotel reservations and member rewards
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <span className="text-[11px] text-amber-600 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-accent w-full py-3.5 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg shadow-amber-600/30 mt-2"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Sign In to Account'}
            </button>
          </form>

          {/* Demo account quick fill */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-[11px] text-slate-400 font-medium">Quick Demo Autofill:</p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('guest')}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
              >
                Guest Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border border-amber-200"
              >
                Admin Demo
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 pt-2">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-amber-600 font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
