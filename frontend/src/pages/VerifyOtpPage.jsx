import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RESEND_COOLDOWN = 60; // seconds

export default function VerifyOtpPage() {
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  // Redirect away if no email in state (someone navigated here directly)
  useEffect(() => {
    if (!email) navigate('/register', { replace: true });
  }, [email, navigate]);

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const intervalRef = useRef(null);

  // Start countdown on mount
  useEffect(() => {
    startCountdown();
    return () => clearInterval(intervalRef.current);
  }, []);

  const startCountdown = () => {
    setCountdown(RESEND_COOLDOWN);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(val);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await verifyOtp(email, otp);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      await resendOtp(email);
      setOtp('');
      setSuccessMsg('A new code has been sent to your email.');
      startCountdown();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrap}>
            <span style={{ fontSize: '28px' }}>✉️</span>
          </div>
          <h1 style={styles.title}>Check your email</h1>
          <p style={styles.subtitle}>
            We sent a 6-digit verification code to
          </p>
          <p style={styles.emailDisplay}>{email}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          {error && (
            <div style={styles.errorBanner} role="alert">{error}</div>
          )}
          {successMsg && (
            <div style={styles.successBanner} role="status">{successMsg}</div>
          )}

          <div style={styles.field}>
            <label style={styles.label} htmlFor="otp">Verification code</label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={handleOtpChange}
              style={styles.otpInput}
              placeholder="000000"
              maxLength={6}
              autoFocus
            />
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading || otp.length !== 6}>
            {loading ? 'Verifying…' : 'Verify email'}
          </button>
        </form>

        {/* Resend */}
        <div style={styles.resendWrap}>
          {countdown > 0 ? (
            <p style={styles.cooldownText}>
              Resend code in <span style={styles.countdown}>{countdown}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              style={styles.resendBtn}
            >
              {resendLoading ? 'Sending…' : 'Resend code'}
            </button>
          )}
        </div>

        <p style={styles.footer}>
          Wrong email?{' '}
          <Link to="/register" style={styles.link}>Start over</Link>
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
  iconWrap: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    background: '#f5f3ff',
    border: '2px solid #ddd6fe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 4px',
  },
  emailDisplay: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4f46e5',
    margin: 0,
    wordBreak: 'break-all',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
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
  successBanner: {
    background: '#d1fae5',
    color: '#065f46',
    border: '1px solid #6ee7b7',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  otpInput: {
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid #ddd6fe',
    fontSize: '32px',
    fontWeight: '700',
    color: '#4f46e5',
    textAlign: 'center',
    letterSpacing: '12px',
    outline: 'none',
    fontFamily: 'monospace',
    background: '#f5f3ff',
    width: '100%',
    boxSizing: 'border-box',
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
  resendWrap: {
    textAlign: 'center',
    marginTop: '20px',
  },
  cooldownText: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: 0,
  },
  countdown: {
    fontWeight: '600',
    color: '#6b7280',
  },
  resendBtn: {
    background: 'none',
    border: 'none',
    color: '#4f46e5',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: 0,
  },
  footer: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '16px',
    marginBottom: 0,
  },
  link: {
    color: '#4f46e5',
    fontWeight: '600',
    textDecoration: 'none',
  },
};
