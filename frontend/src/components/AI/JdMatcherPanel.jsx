import { useState } from 'react';
import { matchJob } from '../../services/aiApi';

/**
 * JD Matcher Panel — paste a job description, analyze, and tailor the entire resume.
 *
 * Props:
 *   sections      {object}   — current resume sections
 *   onAcceptAll   {function} — called with tailoredSections to merge into resume
 *   onClose       {function}
 */
export default function JdMatcherPanel({ sections, onAcceptAll, onClose }) {
  const [jd, setJd]             = useState('');
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  // Track which sections the user has accepted
  const [accepted, setAccepted] = useState({});
  const [applied, setApplied]   = useState(false);

  const handleAnalyze = async () => {
    if (!jd.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setAccepted({});
    setApplied(false);
    try {
      const data = await matchJob(sections, jd);
      setResult(data);
      // Default: accept all sections
      const defaults = {};
      Object.keys(data.tailoredSections || {}).forEach((k) => { defaults[k] = true; });
      setAccepted(defaults);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!result?.tailoredSections) return;
    const patch = {};
    Object.entries(result.tailoredSections).forEach(([key, val]) => {
      if (accepted[key]) patch[key] = val;
    });
    onAcceptAll(patch);
    setApplied(true);
  };

  const scoreColor = result?.matchScore >= 75 ? '#10b981' : result?.matchScore >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{
      position: 'fixed',
      top: '56px',
      right: 0,
      bottom: 0,
      width: '420px',
      background: '#fff',
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      boxShadow: '-4px 0 24px rgba(0,0,0,0.08)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 14px',
        borderBottom: '1px solid var(--border)',
        background: '#faf5ff',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '1rem' }}>🎯</span>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#7c3aed', flex: 1 }}>JD Matcher & Tailor</span>
        <button
          type="button"
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '2px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
        {/* JD input */}
        {!result && (
          <>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '8px' }}>
              Paste a job description below. Claude will compare it to your resume and tailor each section to match.
            </p>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the full job description here…"
              rows={10}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #ddd6fe',
                fontSize: '0.8125rem',
                lineHeight: 1.5,
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
            {error && <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '6px' }}>{error}</p>}
          </>
        )}

        {/* Results */}
        {result && (
          <>
            {/* Match score banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '10px',
              background: `${scoreColor}10`,
              border: `1px solid ${scoreColor}40`,
              marginBottom: '14px',
            }}>
              <div style={{ textAlign: 'center', minWidth: '52px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
                  {result.matchScore}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 600 }}>/ 100</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#374151' }}>Match Score</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {result.matchScore >= 75 ? 'Strong match — great fit!' : result.matchScore >= 50 ? 'Good match — small gaps' : 'Needs tailoring — apply suggestions below'}
                </div>
              </div>
            </div>

            {/* Keywords */}
            <KeywordChips label="Matched Keywords" items={result.matchedKeywords || []} color="#10b981" bg="#ecfdf5" />
            <KeywordChips label="Missing Keywords" items={result.missingKeywords || []} color="#ef4444" bg="#fef2f2" />
            {(result.skillsToAdd || []).length > 0 && (
              <KeywordChips label="Skills to Add" items={result.skillsToAdd} color="#f59e0b" bg="#fffbeb" />
            )}

            {/* Experience gaps */}
            {(result.experienceGaps || []).length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>📋 Experience Gaps</p>
                {result.experienceGaps.map((g, i) => (
                  <p key={i} style={{ fontSize: '0.75rem', color: '#6b7280', padding: '2px 0' }}>• {g}</p>
                ))}
              </div>
            )}

            {/* Tailored sections */}
            {result.tailoredSections && (
              <div style={{ marginBottom: '14px' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>
                  ✨ Tailored Sections — select what to apply:
                </p>
                {Object.entries(result.tailoredSections).map(([key, val]) => (
                  <SectionDiffRow
                    key={key}
                    sectionKey={key}
                    original={sections[key]}
                    tailored={val}
                    accepted={!!accepted[key]}
                    onToggle={() => setAccepted((prev) => ({ ...prev, [key]: !prev[key] }))}
                  />
                ))}
              </div>
            )}

            {applied && (
              <div style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#ecfdf5',
                border: '1px solid #86efac',
                fontSize: '0.8rem',
                color: '#166534',
                fontWeight: 600,
                marginBottom: '10px',
              }}>
                ✓ Tailored sections applied to your resume!
              </div>
            )}

            {error && <p style={{ color: '#dc2626', fontSize: '0.8rem', marginBottom: '8px' }}>{error}</p>}
          </>
        )}
      </div>

      {/* Footer actions */}
      <div style={{
        padding: '10px 14px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        gap: '8px',
        flexShrink: 0,
      }}>
        {!result ? (
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!jd.trim() || loading}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: jd.trim() && !loading ? '#7c3aed' : '#e5e7eb',
              color: jd.trim() && !loading ? '#fff' : '#9ca3af',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: jd.trim() && !loading ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={spinnerStyle} /> Analyzing with AI…
              </span>
            ) : '🎯 Analyze & Tailor'}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => { setResult(null); setJd(''); setApplied(false); }}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: '#fff',
                color: '#6b7280',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ← New JD
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={applied || !Object.values(accepted).some(Boolean)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: applied || !Object.values(accepted).some(Boolean) ? '#e5e7eb' : '#7c3aed',
                color: applied || !Object.values(accepted).some(Boolean) ? '#9ca3af' : '#fff',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: applied || !Object.values(accepted).some(Boolean) ? 'not-allowed' : 'pointer',
              }}
            >
              {applied ? '✓ Applied' : '✨ Apply Selected Sections'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function KeywordChips({ label, items, color, bg }) {
  if (!items.length) return null;
  return (
    <div style={{ marginBottom: '12px' }}>
      <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>{label}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {items.slice(0, 12).map((kw, i) => (
          <span key={i} style={{
            padding: '2px 8px',
            borderRadius: '20px',
            background: bg,
            color,
            fontSize: '0.7rem',
            fontWeight: 600,
            border: `1px solid ${color}40`,
          }}>
            {kw}
          </span>
        ))}
        {items.length > 12 && (
          <span style={{ fontSize: '0.7rem', color: '#9ca3af', alignSelf: 'center' }}>+{items.length - 12} more</span>
        )}
      </div>
    </div>
  );
}

function SectionDiffRow({ sectionKey, tailored, accepted, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  const label = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
  const preview = typeof tailored === 'string'
    ? tailored.slice(0, 120) + (tailored.length > 120 ? '…' : '')
    : Array.isArray(tailored)
      ? `${tailored.length} item(s) tailored`
      : 'Tailored content';

  return (
    <div style={{
      border: `1px solid ${accepted ? '#ddd6fe' : '#e5e7eb'}`,
      borderRadius: '8px',
      marginBottom: '8px',
      background: accepted ? '#faf5ff' : '#fafafa',
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px' }}>
        <input
          type="checkbox"
          checked={accepted}
          onChange={onToggle}
          style={{ width: '14px', height: '14px', cursor: 'pointer', accentColor: '#7c3aed' }}
        />
        <span style={{ fontWeight: 600, fontSize: '0.8rem', color: accepted ? '#7c3aed' : '#6b7280', flex: 1 }}>
          {label}
        </span>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '0.72rem', padding: '2px 4px' }}
        >
          {expanded ? 'hide' : 'preview'}
        </button>
      </div>
      {expanded && (
        <div style={{
          padding: '0 10px 10px',
          fontSize: '0.72rem',
          color: '#4b5563',
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          borderTop: '1px solid #ede9fe',
          paddingTop: '8px',
        }}>
          {typeof tailored === 'string' ? tailored : JSON.stringify(tailored, null, 2)}
        </div>
      )}
      {!expanded && (
        <div style={{ padding: '0 10px 8px', fontSize: '0.7rem', color: '#9ca3af' }}>{preview}</div>
      )}
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
