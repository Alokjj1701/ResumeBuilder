import { useState, useRef, useEffect } from 'react';
import { rewriteContent } from '../../services/aiApi';

const ACTIONS = [
  { id: 'improve',        label: '✨ Improve',         desc: 'Make it more impactful' },
  { id: 'stronger-verbs', label: '💪 Stronger Verbs',  desc: 'Replace weak verbs' },
  { id: 'concise',        label: '✂️ More Concise',    desc: 'Trim without losing meaning' },
  { id: 'professional',   label: '🎯 More Professional', desc: 'Polish the tone' },
  { id: 'tailor',         label: '🎯 Tailor for Role', desc: 'Target a specific job title' },
];

/**
 * Sparkle button that rewrites a piece of resume text.
 *
 * Props:
 *   content     {string}   — current text to rewrite
 *   sectionType {string}   — experience | summary | projects | skills
 *   onAccept    {function} — called with the accepted rewritten string
 */
export default function AiRewriteButton({ content, sectionType, onAccept }) {
  const [open, setOpen]           = useState(false);
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAction = async (action) => {
    if (!content?.trim()) {
      setError('No content to rewrite.');
      setOpen(false);
      return;
    }
    if (action === 'tailor' && !targetRole.trim()) {
      setPendingAction(action);
      return; // show role input first
    }
    setOpen(false);
    setPendingAction(null);
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const rewritten = await rewriteContent(content, action, sectionType, targetRole || undefined);
      setResult(rewritten);
    } catch (err) {
      setError(err.response?.data?.message || 'AI request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (result) {
      onAccept(result);
      setResult(null);
      setTargetRole('');
    }
  };

  const handleDismiss = () => {
    setResult(null);
    setError('');
    setTargetRole('');
    setPendingAction(null);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => { setOpen((v) => !v); setError(''); }}
        disabled={loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 10px',
          borderRadius: '6px',
          border: '1px solid #ddd6fe',
          background: loading ? '#f5f3ff' : '#faf5ff',
          color: '#7c3aed',
          fontSize: '0.75rem',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#ede9fe'; }}
        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#faf5ff'; }}
      >
        {loading ? (
          <>
            <span style={spinnerStyle} />
            Rewriting…
          </>
        ) : (
          <>✨ AI Rewrite</>
        )}
      </button>

      {/* Action dropdown */}
      {open && !loading && (
        <div style={dropdownStyle}>
          {ACTIONS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => handleAction(a.id)}
              style={dropdownItemStyle}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f5f3ff'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{a.label}</span>
              <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>{a.desc}</span>
            </button>
          ))}
          {/* Role input shown inline when "Tailor" is pending */}
          {pendingAction === 'tailor' && (
            <div style={{ padding: '8px 12px', borderTop: '1px solid #ede9fe' }}>
              <input
                autoFocus
                type="text"
                placeholder="Target role (e.g. Product Manager)"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAction('tailor'); }}
                style={roleInputStyle}
              />
              <button
                type="button"
                onClick={() => handleAction('tailor')}
                disabled={!targetRole.trim()}
                style={roleSubmitStyle(!!targetRole.trim())}
              >
                Tailor →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Result / error popover */}
      {(result || error) && (
        <div style={resultStyle}>
          {error && (
            <p style={{ color: '#dc2626', fontSize: '0.8rem', margin: '0 0 8px' }}>{error}</p>
          )}
          {result && (
            <>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#7c3aed', margin: '0 0 6px' }}>
                ✨ AI Suggestion
              </p>
              <p style={{
                fontSize: '0.8125rem',
                color: '#374151',
                whiteSpace: 'pre-wrap',
                margin: '0 0 10px',
                lineHeight: 1.5,
                maxHeight: '120px',
                overflowY: 'auto',
              }}>
                {result}
              </p>
            </>
          )}
          <div style={{ display: 'flex', gap: '6px' }}>
            {result && (
              <button type="button" onClick={handleAccept} style={acceptBtnStyle}>
                ✓ Accept
              </button>
            )}
            <button type="button" onClick={handleDismiss} style={dismissBtnStyle}>
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const spinnerStyle = {
  width: '10px',
  height: '10px',
  border: '2px solid #ddd6fe',
  borderTopColor: '#7c3aed',
  borderRadius: '50%',
  display: 'inline-block',
  animation: 'spin 0.7s linear infinite',
};

const dropdownStyle = {
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: 0,
  zIndex: 200,
  background: '#fff',
  border: '1px solid #ede9fe',
  borderRadius: '10px',
  boxShadow: '0 8px 24px rgba(124,58,237,0.12)',
  minWidth: '200px',
  overflow: 'hidden',
};

const dropdownItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
  width: '100%',
  padding: '8px 12px',
  background: 'transparent',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background 0.1s',
};

const resultStyle = {
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: 0,
  zIndex: 200,
  background: '#fff',
  border: '1px solid #ddd6fe',
  borderRadius: '10px',
  boxShadow: '0 8px 24px rgba(124,58,237,0.15)',
  padding: '12px',
  minWidth: '260px',
  maxWidth: '340px',
};

const roleInputStyle = {
  width: '100%',
  padding: '5px 8px',
  borderRadius: '6px',
  border: '1px solid #ddd6fe',
  fontSize: '0.8rem',
  marginBottom: '6px',
  outline: 'none',
  boxSizing: 'border-box',
};

const roleSubmitStyle = (enabled) => ({
  padding: '4px 10px',
  borderRadius: '6px',
  border: 'none',
  background: enabled ? '#7c3aed' : '#e5e7eb',
  color: enabled ? '#fff' : '#9ca3af',
  fontSize: '0.78rem',
  fontWeight: 600,
  cursor: enabled ? 'pointer' : 'not-allowed',
  width: '100%',
});

const acceptBtnStyle = {
  flex: 1,
  padding: '5px 10px',
  borderRadius: '6px',
  border: 'none',
  background: '#7c3aed',
  color: '#fff',
  fontSize: '0.78rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const dismissBtnStyle = {
  flex: 1,
  padding: '5px 10px',
  borderRadius: '6px',
  border: '1px solid #e5e7eb',
  background: '#fff',
  color: '#6b7280',
  fontSize: '0.78rem',
  fontWeight: 500,
  cursor: 'pointer',
};
