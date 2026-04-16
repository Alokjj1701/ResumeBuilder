import { useState, useEffect, useCallback } from 'react';
import { getAtsScore } from '../../services/aiApi';

/**
 * Collapsible ATS score panel.
 * Props:
 *   sections  {object}  — current resume sections
 *   saveStatus {string} — 'saved' triggers a re-score
 */
export default function AtsScorePanel({ sections, saveStatus }) {
  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(false);
  const [collapsed, setCollapsed]   = useState(false);
  const [scored, setScored]         = useState(false);

  const runScore = useCallback(async () => {
    if (!sections || loading) return;
    setLoading(true);
    try {
      const result = await getAtsScore(sections);
      setData(result);
      setScored(true);
    } catch {
      // Silent fail — don't disrupt the editor
    } finally {
      setLoading(false);
    }
  }, [sections, loading]);

  useEffect(() => {
    if (!scored) runScore();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (saveStatus === 'saved' && scored) runScore();
  }, [saveStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  const score     = data?.score ?? null;
  const trackColor = score === null ? '#d1d5db'
                   : score >= 75    ? '#6ee7b7'   // soft emerald track
                   : score >= 50    ? '#fcd34d'   // soft amber track
                   :                  '#fca5a5';  // soft rose track
  const textColor  = score === null ? '#9ca3af'
                   : score >= 75    ? '#047857'
                   : score >= 50    ? '#92400e'
                   :                  '#991b1b';
  const label      = score === null ? '—'
                   : score >= 75    ? 'Good'
                   : score >= 50    ? 'Fair'
                   :                  'Weak';

  const breakdown   = data?.breakdown   ?? {};
  const suggestions = data?.suggestions ?? [];
  const weakPhrases = data?.weakPhrases ?? [];

  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--white)',
      flexShrink: 0,
    }}>
      {/* ── Header row ── */}
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '8px 14px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {/* Label */}
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', letterSpacing: '0.1px' }}>
          ATS Score
        </span>

        {loading ? (
          <span style={{ ...spinnerStyle, marginLeft: 'auto' }} />
        ) : (
          <span style={{
            marginLeft: 'auto',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: textColor,
          }}>
            {score !== null ? `${score}/100` : '—'}
          </span>
        )}

        {score !== null && !loading && (
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 500,
            color: textColor,
            background: trackColor + '55',
            borderRadius: '100px',
            padding: '1px 7px',
            letterSpacing: '0.1px',
          }}>
            {label}
          </span>
        )}

        <svg
          width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="var(--text-lighter)" strokeWidth="2"
          style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s', flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* ── Expanded content ── */}
      {!collapsed && data && (
        <div style={{ padding: '0 14px 12px' }}>

          {/* Score bar */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ height: '4px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${score}%`,
                background: trackColor,
                borderRadius: '4px',
                transition: 'width 0.7s cubic-bezier(0.22,1,0.36,1)',
              }} />
            </div>
          </div>

          {/* Breakdown mini-bars */}
          {Object.keys(breakdown).length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', marginBottom: '10px' }}>
              {Object.entries(breakdown).map(([key, val]) => {
                const barColor = val >= 75 ? '#a7f3d0' : val >= 50 ? '#fde68a' : '#fecaca';
                const barText  = val >= 75 ? '#065f46' : val >= 50 ? '#78350f' : '#7f1d1d';
                return (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '0.67rem', color: 'var(--text-lighter)', textTransform: 'capitalize' }}>{key}</span>
                      <span style={{ fontSize: '0.67rem', fontWeight: 500, color: barText }}>{val}</span>
                    </div>
                    <div style={{ height: '3px', background: '#f3f4f6', borderRadius: '2px' }}>
                      <div style={{
                        height: '100%',
                        width: `${val}%`,
                        background: barColor,
                        borderRadius: '2px',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: '5px', letterSpacing: '0.2px' }}>
                Tips
              </p>
              {suggestions.slice(0, 3).map((s, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '6px',
                  fontSize: '0.71rem',
                  color: 'var(--text-light)',
                  lineHeight: 1.5,
                  padding: '3px 0',
                  borderBottom: i < Math.min(suggestions.length, 3) - 1 ? '1px solid #f9fafb' : 'none',
                }}>
                  <span style={{ color: '#d1d5db', flexShrink: 0, marginTop: '1px' }}>›</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}

          {/* Weak phrases */}
          {weakPhrases.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: '5px', letterSpacing: '0.2px' }}>
                Replace
              </p>
              {weakPhrases.slice(0, 3).map((wp, i) => (
                <div key={i} style={{ fontSize: '0.71rem', color: 'var(--text-light)', padding: '2px 0', display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#fca5a5', textDecoration: 'line-through' }}>{wp.original}</span>
                  <span style={{ color: '#d1d5db' }}>→</span>
                  <span style={{ color: '#6ee7b7', fontWeight: 500 }}>{wp.suggestion}</span>
                </div>
              ))}
            </div>
          )}

          {/* Re-analyze link-style button */}
          <button
            type="button"
            onClick={runScore}
            disabled={loading}
            style={{
              marginTop: '6px',
              background: 'none',
              border: 'none',
              padding: '2px 0',
              color: loading ? 'var(--text-lighter)' : 'var(--text-light)',
              fontSize: '0.7rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {loading ? 'Analyzing…' : 'Re-analyze'}
          </button>
        </div>
      )}

      {/* ── Empty state ── */}
      {!collapsed && !data && !loading && (
        <div style={{ padding: '4px 14px 12px' }}>
          <button
            type="button"
            onClick={runScore}
            style={{
              width: '100%',
              padding: '6px',
              borderRadius: '7px',
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text-light)',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Analyze ATS Score
          </button>
        </div>
      )}
    </div>
  );
}

const spinnerStyle = {
  width: '11px',
  height: '11px',
  border: '1.5px solid #e5e7eb',
  borderTopColor: '#9ca3af',
  borderRadius: '50%',
  display: 'inline-block',
  animation: 'spin 0.8s linear infinite',
  flexShrink: 0,
};
