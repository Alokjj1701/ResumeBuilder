import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]     = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await forgotPassword(email.trim());
      setSent(true);
      // After a short pause navigate to reset page with the email pre-filled
      setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(email.trim())}`), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>R</div>
          <h1 style={styles.title}>Forgot your password?</h1>
          <p style={styles.subtitle}>
            Enter your email and we'll send a 6-digit reset code.
          </p>
        </div>

        {sent ? (
          <div style={styles.successBox}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📬</div>
            <p style={{ margin: 0, fontWeight: 600, color: '#065f46', fontSize: '15px' }}>
              Check your inbox!
            </p>
            <p style={{ margin: '6px 0 0', color: '#047857', fontSize: '13px' }}>
              A reset code has been sent if an account exists for <strong>{email}</strong>.
              Redirecting you now…
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
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                style={styles.input}
                placeholder="you@example.com"
              />
            </div>

            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Sending…' : 'Send reset code'}
            </button>
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
    gap: '20px',
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
    marginTop: '4px',
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
