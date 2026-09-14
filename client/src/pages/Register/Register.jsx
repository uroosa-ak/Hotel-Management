import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword, validatePhone } from '../../utils/validators';

const FieldError = ({ message }) =>
  message ? (
    <p className="motela-text" style={{ fontSize: 12, color: '#b4453c', marginTop: 6 }}>
      {message}
    </p>
  ) : null;

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const passErr = validatePassword(formData.password);
    if (passErr) newErrors.password = passErr;

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setApiError('');
    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/');
    } catch (err) {
      setApiError(err?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const field = (name) => ({
    value: formData[name],
    onChange: (e) => setFormData({ ...formData, [name]: e.target.value }),
  });

  return (
    <section className="motela-section motela-section--alt">
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 34 }}>
          <p className="motela-eyebrow">LuxuryStay Hospitality</p>
          <h1 className="motela-title" style={{ marginBottom: 8 }}>Create your account</h1>
          <p className="motela-text" style={{ fontSize: 14 }}>
            Book faster, track your stays and manage reservations in one place.
          </p>
        </div>

        <div className="motela-panel">
          {apiError && <div className="motela-alert motela-alert--error">{apiError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18 }}>
              <div>
                <label className="motela-label" htmlFor="reg-first">First name *</label>
                <input id="reg-first" className="motela-input" {...field('firstName')} required />
                <FieldError message={errors.firstName} />
              </div>
              <div>
                <label className="motela-label" htmlFor="reg-last">Last name *</label>
                <input id="reg-last" className="motela-input" {...field('lastName')} required />
                <FieldError message={errors.lastName} />
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <label className="motela-label" htmlFor="reg-email">Email address *</label>
              <input id="reg-email" type="email" className="motela-input" autoComplete="email" {...field('email')} required />
              <FieldError message={errors.email} />
            </div>

            <div style={{ marginTop: 18 }}>
              <label className="motela-label" htmlFor="reg-phone">Phone number</label>
              <input id="reg-phone" className="motela-input" placeholder="+1 555 000 0000" {...field('phone')} />
              <FieldError message={errors.phone} />
            </div>

            <div style={{ marginTop: 18 }}>
              <label className="motela-label" htmlFor="reg-password">Password *</label>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className="motela-input"
                autoComplete="new-password"
                {...field('password')}
                required
              />
              <FieldError message={errors.password} />
              <p className="motela-text" style={{ fontSize: 12, marginTop: 6 }}>
                At least 8 characters, with upper and lower case, a number and a symbol.
              </p>
            </div>

            <div style={{ marginTop: 18 }}>
              <label className="motela-label" htmlFor="reg-confirm">Confirm password *</label>
              <input
                id="reg-confirm"
                type={showPassword ? 'text' : 'password'}
                className="motela-input"
                autoComplete="new-password"
                {...field('confirmPassword')}
                required
              />
              <FieldError message={errors.confirmPassword} />
            </div>

            <label
              style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#5c5c5c' }}
            >
              <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
              Show passwords
            </label>

            <button type="submit" className="motela-btn" style={{ width: '100%', marginTop: 26 }} disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="motela-text" style={{ textAlign: 'center', marginTop: 24, fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#c19c77', textDecoration: 'underline' }}>
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
