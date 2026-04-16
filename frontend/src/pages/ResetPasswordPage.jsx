import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    email:           searchParams.get('email') || '',
    otp:             '',
    newPassword:     '',
    confirmPassword: '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await resetPassword(form.email.trim(), form.otp.trim(), form.newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>R</div>
          <h1 style={styles.title}>Set new password</h1>
          <p style={styles.subtitle}>Enter the 6-digit code from your email and choose a new password.</p>
        </div>

        {success ? (
          <div style={styles.successBox}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✅</div>
            <p style={{ margin: 0, fontWeight: 600, color: '#065f46', fontSize: '15px' }}>
              Password updated!
            </p>
            <p style={{ margin: '6px 0 0', color: '#047857', fontSize: '13px' }}>
              Redirecting you to login…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form} noValidate>
            {error && (
              <div style={styles.errorBanner} role="alert">{error}</div>
            )}

            <div style={styles.field}>
              <label style={styles.label} htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="you@example.com"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label} htmlFor="otp">Reset code</label>
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={form.otp}
                onChange={handleChange}
                style={{ ...styles.input, letterSpacing: '6px', fontSize: '20px', textAlign: 'center', fontWeight: 700 }}
                placeholder="______"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label} htmlFor="newPassword">New password</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                value={form.newPassword}
                onChange={handleChange}
                style={styles.input}
                placeholder="Min. 8 characters"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label} htmlFor="confirmPassword">Confirm new password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                style={styles.input}
                placeholder="Re-enter password"
              />
            </div>

            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Resetting…' : 'Reset password'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', margin: 0 }}>
              Didn't get the code?{' '}
              <Link to="/forgot-password" style={{ color: '#4f46e5', fontWeight: 500, textDecoration: 'none' }}>
                Send again
              </Link>
            </p>
          </form>
        )}

        <p style={styles.footer}>
          Remember it now?{' '}
          <Link to="/login" style={styles.link}>Back to login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #ede9fe 0%, #fce7f3 100%)',
    padding: '24px 16px',
    fontFamily: 'var(--font-sans)',
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(79, 70, 229, 0.15)',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logo: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
    color: '#fff',
    fontSize: '24px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
    lineHeight: 1.5,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1.5px solid #e5e7eb',
    fontSize: '15px',
    color: '#1f2937',
    outline: 'none',
    transition: 'border-color 0.15s',
    fontFamily: 'var(--font-sans)',
  },
  submitBtn: {
    padding: '13px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
  successBox: {
    background: '#ecfdf5',
    border: '1px solid #6ee7b7',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    marginBottom: '8px',
  },
  errorBanner: {
    background: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fca5a5',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
  },
  footer: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '24px',
    marginBottom: 0,
  },
  link: {
    color: '#4f46e5',
    fontWeight: '600',
    textDecoration: 'none',
  },
};
