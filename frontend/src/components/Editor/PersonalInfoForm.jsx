import { useCallback, useRef } from 'react';

export default function PersonalInfoForm({ data, onChange }) {
  const fileInputRef = useRef(null);

  const handleChange = useCallback((field, value) => {
    onChange({ ...data, [field]: value });
  }, [data, onChange]);

  const handlePhotoUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange({ ...data, photo: ev.target.result });
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-uploaded
    e.target.value = '';
  }, [data, onChange]);

  const removePhoto = useCallback(() => {
    onChange({ ...data, photo: null });
  }, [data, onChange]);

  return (
    <div>
      {/* ── Photo Upload ── */}
      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <label className="form-label">Profile Photo <span style={{ fontWeight: 400, color: 'var(--text-lighter)', fontSize: '0.75rem' }}>(optional — only shown on photo-enabled templates)</span></label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Preview / placeholder */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '72px', height: '72px', borderRadius: '50%',
              border: '2px dashed var(--border-dark)',
              overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg)', position: 'relative',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-dark)'}
          >
            {data.photo ? (
              <>
                <img
                  src={data.photo}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Hover overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.2s',
                  fontSize: '0.65rem', color: '#fff', fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                >
                  Change
                </div>
              </>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-lighter)" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '0.375rem 0.875rem',
                  fontSize: '0.8125rem', fontWeight: 500,
                  border: '1px solid var(--border-dark)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--bg-card)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                }}
              >
                {data.photo ? 'Change Photo' : 'Upload Photo'}
              </button>
              {data.photo && (
                <button
                  type="button"
                  onClick={removePhoto}
                  style={{
                    padding: '0.375rem 0.875rem',
                    fontSize: '0.8125rem', fontWeight: 500,
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    background: 'transparent',
                    color: '#ef4444',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-lighter)', marginTop: '5px' }}>
              JPG, PNG or WebP · Max 5 MB · Appears in photo-enabled templates
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={handlePhotoUpload}
        />
      </div>

      {/* ── First name + Last name ── */}
      <div className="form-grid-2">
        <div className="form-group" style={{ marginBottom: '0.875rem' }}>
          <label className="form-label required" htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            className="form-input"
            type="text"
            value={data.firstName || ''}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="John"
            autoComplete="given-name"
          />
        </div>
        <div className="form-group" style={{ marginBottom: '0.875rem' }}>
          <label className="form-label required" htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            className="form-input"
            type="text"
            value={data.lastName || ''}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Doe"
            autoComplete="family-name"
          />
        </div>
      </div>

      {/* ── Email + Phone ── */}
      <div className="form-grid-2">
        <div className="form-group" style={{ marginBottom: '0.875rem' }}>
          <label className="form-label required" htmlFor="email">Email Address</label>
          <input
            id="email"
            className="form-input"
            type="email"
            value={data.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john@example.com"
            autoComplete="email"
          />
        </div>
        <div className="form-group" style={{ marginBottom: '0.875rem' }}>
          <label className="form-label" htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            className="form-input"
            type="tel"
            value={data.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
            autoComplete="tel"
          />
        </div>
      </div>

      {/* ── Location ── */}
      <div className="form-group" style={{ marginBottom: '0.875rem' }}>
        <label className="form-label" htmlFor="location">Location</label>
        <input
          id="location"
          className="form-input"
          type="text"
          value={data.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="San Francisco, CA"
          autoComplete="address-level2"
        />
      </div>

      {/* ── Website ── */}
      <div className="form-group" style={{ marginBottom: '0.875rem' }}>
        <label className="form-label" htmlFor="website">Personal Website</label>
        <input
          id="website"
          className="form-input"
          type="url"
          value={data.website || ''}
          onChange={(e) => handleChange('website', e.target.value)}
          placeholder="https://johndoe.com"
          autoComplete="url"
        />
      </div>

      {/* ── LinkedIn + GitHub ── */}
      <div className="form-grid-2">
        <div className="form-group" style={{ marginBottom: '0.875rem' }}>
          <label className="form-label" htmlFor="linkedin">LinkedIn</label>
          <input
            id="linkedin"
            className="form-input"
            type="text"
            value={data.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
        <div className="form-group" style={{ marginBottom: '0.875rem' }}>
          <label className="form-label" htmlFor="github">GitHub</label>
          <input
            id="github"
            className="form-input"
            type="text"
            value={data.github || ''}
            onChange={(e) => handleChange('github', e.target.value)}
            placeholder="github.com/johndoe"
          />
        </div>
      </div>

      {/* ── Live preview ── */}
      {(data.firstName || data.lastName || data.email) && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'var(--bg)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          {data.photo ? (
            <img src={data.photo} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--brand)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, color: '#fff',
            }}>
              {[data.firstName?.[0], data.lastName?.[0]].filter(Boolean).join('') || '?'}
            </div>
          )}
          <div>
            <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)' }}>
              {[data.firstName, data.lastName].filter(Boolean).join(' ') || '—'}
            </p>
            {data.email && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>{data.email}</p>
            )}
            {data.location && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>{data.location}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
