import { useState } from 'react';
import { generateSummary } from '../../services/aiApi';

/**
 * Modal that generates 3 AI-written summary options.
 *
 * Props:
 *   experience  {Array}    — sections.experience
 *   skills      {Array}    — sections.skills
 *   onAccept    {function} — called with the chosen summary string
 *   onClose     {function}
 */
export default function SummaryGenerator({ experience, skills, onAccept, onClose }) {
  const [targetRole, setTargetRole] = useState('');
  const [summaries, setSummaries]   = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [selected, setSelected]     = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setSummaries(null);
    setSelected(null);
    try {
      const result = await generateSummary(experience, skills, targetRole);
      const list = result?.summaries;
      if (Array.isArray(list) && list.length > 0) {
        setSummaries(list);
      } else {
        // Backend returned { error: ... } or { summaries: [] } — treat as failure
        setError(result?.error || 'Generation returned no results. Please try again.');
      }
    } catch {
      setError('Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (selected !== null && summaries[selected]) {
      onAccept(summaries[selected].text);
      onClose();
    }
  };

  return (
    // Overlay
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300,
        padding: '16px',
      }}
    >
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '18px 20px',
          borderBottom: '1px solid #f3f4f6',
          background: 'linear-gradient(135deg, #faf5ff, #f5f3ff)',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '1.25rem' }}>✨</span>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#4c1d95' }}>
              AI Summary Generator
            </h2>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#7c3aed' }}>
              Get 3 tailored options — pick your favourite and apply instantly
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {/* Role input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
              Target Role <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional — makes summaries more focused)</span>
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !loading) handleGenerate(); }}
                placeholder="e.g. Senior Software Engineer, Product Manager…"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd6fe',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: loading ? '#e5e7eb' : '#7c3aed',
                  color: loading ? '#9ca3af' : '#fff',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {loading ? (
                  <>
                    <span style={spinnerStyle} />
                    Generating…
                  </>
                ) : (
                  summaries ? '↻ Regenerate' : '✨ Generate'
                )}
              </button>
            </div>
          </div>

          {error && (
            <p style={{ color: '#dc2626', fontSize: '0.8rem', marginBottom: '12px' }}>{error}</p>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  borderRadius: '12px',
                  border: '1px solid #ede9fe',
                  padding: '14px 16px',
                  background: '#fafafa',
                }}>
                  <div style={{ height: '12px', width: '35%', background: '#e5e7eb', borderRadius: '6px', marginBottom: '10px', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                  <div style={{ height: '10px', width: '100%', background: '#f3f4f6', borderRadius: '4px', marginBottom: '6px' }} />
                  <div style={{ height: '10px', width: '85%', background: '#f3f4f6', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          )}

          {/* Summary cards */}
          {!loading && summaries && summaries.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '4px' }}>
                Click a card to select it, then click <strong>Use This Summary</strong>.
              </p>
              {summaries.map((s, i) => (
                <div
                  key={i}
                  onClick={() => setSelected(i)}
                  style={{
                    borderRadius: '12px',
                    border: `2px solid ${selected === i ? '#7c3aed' : '#e5e7eb'}`,
                    padding: '14px 16px',
                    cursor: 'pointer',
                    background: selected === i ? '#faf5ff' : '#fff',
                    transition: 'border-color 0.15s, background 0.15s',
                    position: 'relative',
                  }}
                >
                  {/* Label badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: selected === i ? '#7c3aed' : '#6b7280',
                      background: selected === i ? '#ede9fe' : '#f3f4f6',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      letterSpacing: '0.03em',
                    }}>
                      {s.label}
                    </span>
                    {selected === i && (
                      <span style={{
                        width: '18px', height: '18px',
                        background: '#7c3aed',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    color: '#1f2937',
                  }}>
                    {s.text}
                  </p>
                  <p style={{ margin: '6px 0 0', fontSize: '0.7rem', color: '#9ca3af' }}>
                    {s.text.length} characters
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Empty state — not yet generated */}
          {!loading && summaries === null && !error && (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: '#9ca3af' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✨</div>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '6px' }}>
                Ready to write your summary
              </p>
              <p style={{ fontSize: '0.78rem' }}>
                Add a target role above for best results, then hit Generate.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'flex-end',
          padding: '14px 20px',
          borderTop: '1px solid #f3f4f6',
          flexShrink: 0,
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: '#fff',
              color: '#6b7280',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAccept}
            disabled={selected === null}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              background: selected !== null ? '#7c3aed' : '#e5e7eb',
              color: selected !== null ? '#fff' : '#9ca3af',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: selected !== null ? 'pointer' : 'not-allowed',
            }}
          >
            ✓ Use This Summary
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const spinnerStyle = {
  width: '12px',
  height: '12px',
  border: '2px solid rgba(255,255,255,0.4)',
  borderTopColor: '#fff',
  borderRadius: '50%',
  display: 'inline-block',
  animation: 'spin 0.7s linear infinite',
  flexShrink: 0,
};
