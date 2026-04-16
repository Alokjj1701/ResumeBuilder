import { useState, useEffect, useCallback } from 'react';
import { getAtsScore } from '../../services/aiApi';

/**
 * Collapsible ATS score panel.
 * Props:
 *   sections  {object}  — current resume sections
 *   saveStatus {string} — 'saved' triggers a re-score
 */
export default function AtsScorePanel({ sections, saveStatus }) {
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [scored, setScored]     = useState(false); // true once first score fetched

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

  // Score once on first mount
  useEffect(() => {
    if (!scored) runScore();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-score after each save
  useEffect(() => {
    if (saveStatus === 'saved' && scored) runScore();
  }, [saveStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  const score       = data?.score ?? null;
  const color       = score === null ? '#9ca3af' : score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const label       = score === null ? '—' : score >= 75 ? 'Great' : score >= 50 ? 'Good' : 'Needs Work';
  const breakdown   = data?.breakdown ?? {};
  const suggestions = data?.suggestions ?? [];
  const weakPhrases = data?.weakPhrases ?? [];

  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      background: '#fafafa',
      flexShrink: 0,
    }}>
      {/* Header row */}
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7c3aed' }}>⚡ ATS Score</span>

        {loading ? (
          <span style={{ ...spinnerStyle, marginLeft: 'auto' }} />
        ) : (
          <span style={{
            marginLeft: 'auto',
            fontSize: '0.875rem',
            fontWeight: 800,
            color,
            minWidth: '52px',
            textAlign: 'right',
          }}>
            {score !== null ? `${score}/100` : '—'}
          </span>
        )}

        {score !== null && !loading && (
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            color: '#fff',
            background: color,
            borderRadius: '4px',
            padding: '1px 6px',
          }}>
            {label}
          </span>
        )}

        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="#9ca3af" strokeWidth="2"
          style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expanded content */}
      {!collapsed && data && (
        <div style={{ padding: '0 14px 12px' }}>
          {/* Score bar */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${score}%`,
                background: `linear-gradient(90deg, ${color}99, ${color})`,
                borderRadius: '3px',
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>

          {/* Breakdown mini-bars */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px' }}>
            {Object.entries(breakdown).map(([key, val]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.68rem', color: '#6b7280', textTransform: 'capitalize' }}>{key}</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#374151' }}>{val}</span>
                </div>
                <div style={{ height: '3px', background: '#e5e7eb', borderRadius: '2px' }}>
                  <div style={{
                    height: '100%',
                    width: `${val}%`,
                    background: val >= 75 ? '#10b981' : val >= 50 ? '#f59e0b' : '#ef4444',
                    borderRadius: '2px',
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                💡 Top Tips
              </p>
              {suggestions.slice(0, 3).map((s, i) => (
                <div key={i} style={{
                  fontSize: '0.72rem',
                  color: '#4b5563',
                  padding: '3px 0',
                  borderBottom: i < Math.min(suggestions.length, 3) - 1 ? '1px solid #f3f4f6' : 'none',
                }}>
                  • {s}
                </div>
              ))}
            </div>
          )}

          {/* Weak phrases */}
          {weakPhrases.length > 0 && (
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                🔄 Replace These
              </p>
              {weakPhrases.slice(0, 3).map((wp, i) => (
                <div key={i} style={{ fontSize: '0.72rem', color: '#4b5563', padding: '2px 0' }}>
                  <span style={{ color: '#ef4444', textDecoration: 'line-through' }}>{wp.original}</span>
                  <span style={{ color: '#9ca3af', margin: '0 4px' }}>→</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>{wp.suggestion}</span>
                </div>
              ))}
            </div>
          )}

          {/* Re-score button */}
          <button
            type="button"
            onClick={runScore}
            disabled={loading}
            style={{
              marginTop: '10px',
              width: '100%',
              padding: '5px',
              borderRadius: '6px',
              border: '1px solid #ddd6fe',
              background: '#faf5ff',
              color: '#7c3aed',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Analyzing…' : '↻ Re-analyze'}
          </button>
        </div>
      )}

      {/* Empty state — first time, not yet scored */}
      {!collapsed && !data && !loading && (
        <div style={{ padding: '0 14px 12px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={runScore}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: 'none',
              background: '#7c3aed',
              color: '#fff',
              fontSize: '0.78rem',
              fontWeight: 600,
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
  width: '12px',
  height: '12px',
  border: '2px solid #ddd6fe',
  borderTopColor: '#7c3aed',
  borderRadius: '50%',
  display: 'inline-block',
  animation: 'spin 0.7s linear infinite',
  flexShrink: 0,
};
