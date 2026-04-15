import { useCallback } from 'react';

const MAX_LENGTH = 600;

const EXAMPLE_SUMMARIES = [
  'Software engineer with 5+ years of experience building scalable web applications...',
  'Creative designer passionate about crafting user-centered digital experiences...',
  'Results-driven marketing professional with expertise in digital campaigns...',
];

export default function SummaryForm({ value, onChange }) {
  const handleChange = useCallback((e) => {
    if (e.target.value.length <= MAX_LENGTH) {
      onChange(e.target.value);
    }
  }, [onChange]);

  const charCount = (value || '').length;
  const percentUsed = (charCount / MAX_LENGTH) * 100;
  const isNearLimit = percentUsed > 80;
  const isAtLimit = percentUsed >= 100;

  return (
    <div>
      <div className="form-group">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
          <label className="form-label" htmlFor="summary">
            Professional Summary / Objective
          </label>
          <span style={{
            fontSize: '0.75rem',
            color: isAtLimit ? 'var(--danger)' : isNearLimit ? 'var(--warning)' : 'var(--text-light)',
            fontWeight: isNearLimit ? 500 : 400,
          }}>
            {charCount}/{MAX_LENGTH}
          </span>
        </div>
        <textarea
          id="summary"
          className="form-textarea"
          value={value || ''}
          onChange={handleChange}
          placeholder="Write a compelling summary of your professional background, key skills, and career goals. Keep it concise (2-4 sentences)."
          rows={6}
          style={{ resize: 'vertical' }}
        />
        {/* Character progress bar */}
        <div style={{
          height: '3px',
          background: 'var(--border)',
          borderRadius: '2px',
          marginTop: '0.375rem',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min(percentUsed, 100)}%`,
            background: isAtLimit ? 'var(--danger)' : isNearLimit ? 'var(--warning)' : 'var(--primary)',
            borderRadius: '2px',
            transition: 'width 0.2s ease, background 0.2s ease',
          }} />
        </div>
        <p className="form-hint" style={{ marginTop: '0.375rem' }}>
          Aim for 2-4 sentences (150-300 characters for ATS optimization)
        </p>
      </div>

      {/* Tips */}
      <div style={{
        marginTop: '1rem',
        padding: '0.875rem',
        background: 'var(--primary-light)',
        borderRadius: 'var(--radius)',
        border: '1px solid #bfdbfe',
      }}>
        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
          Writing Tips
        </p>
        <ul style={{ paddingLeft: '1rem', listStyle: 'disc', margin: 0 }}>
          {[
            'Start with your years of experience and primary skill',
            'Mention 2-3 key accomplishments or areas of expertise',
            'Tailor to the job description when possible',
            'Avoid first-person pronouns (I, me, my)',
          ].map((tip, i) => (
            <li key={i} style={{ fontSize: '0.75rem', color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
