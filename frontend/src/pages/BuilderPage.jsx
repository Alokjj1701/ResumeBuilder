import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useResume } from '../hooks/useResume';
import ResumeEditor from '../components/Editor/ResumeEditor';
import ResumePreview from '../components/Preview/ResumePreview';
import TemplateSelector from '../components/TemplateSelector/TemplateSelector';

function SaveStatusIndicator({ status }) {
  if (status === 'saving') {
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-light)' }}>
        <span className="spinner spinner-sm" />
        Saving...
      </span>
    );
  }
  if (status === 'saved') {
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--success)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Saved
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--danger)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Save failed
      </span>
    );
  }
  return null;
}

export default function BuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    state,
    loadResume,
    loadTemplates,
    saveResume,
    updateTitle,
    changeTemplate,
    clearError,
  } = useResume();

  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const titleInputRef = useRef(null);
  const autoSaveTimer = useRef(null);

  // Load resume on mount
  useEffect(() => {
    loadTemplates();
    if (id) {
      loadResume(id);
    }
  }, [id, loadResume, loadTemplates]);

  // Sync title input value with currentResume
  useEffect(() => {
    if (state.currentResume) {
      setTitleValue(state.currentResume.title || 'Untitled Resume');
    }
  }, [state.currentResume?.title]);

  // Auto-save when isDirty
  useEffect(() => {
    if (state.isDirty && state.currentResume) {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        saveResume().catch(() => {});
      }, 2000);
    }
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [state.isDirty, state.currentResume, saveResume]);

  const handleTitleBlur = useCallback(() => {
    setEditingTitle(false);
    if (titleValue.trim()) {
      updateTitle(titleValue.trim());
    }
  }, [titleValue, updateTitle]);

  const handleTitleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      titleInputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setTitleValue(state.currentResume?.title || 'Untitled Resume');
      setEditingTitle(false);
    }
  }, [state.currentResume?.title]);

  const handleSave = useCallback(async () => {
    try {
      await saveResume();
    } catch {
      // error handled in context
    }
  }, [saveResume]);

  const handleExport = useCallback(() => {
    window.print();
  }, []);

  const handleTemplateSelect = useCallback((templateId) => {
    changeTemplate(templateId);
    setShowTemplateSelector(false);
  }, [changeTemplate]);

  // Show loading while fetching
  if (state.loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner spinner-lg" />
        <p style={{ color: 'var(--text-light)' }}>Loading resume...</p>
      </div>
    );
  }

  // No resume loaded
  if (!state.currentResume) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>No resume found.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  const currentTemplateId = state.currentResume?.templateId || state.selectedTemplateId || 'modern';

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Top Toolbar */}
      <header style={{
        background: 'var(--white)',
        borderBottom: '1px solid var(--border)',
        padding: '0 1rem',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexShrink: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)',
      }}>
        {/* Back button */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate('/')}
          style={{ flexShrink: 0 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>

        <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />

        {/* Title */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
          {editingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              style={{
                border: '1px solid var(--primary)',
                borderRadius: 'var(--radius)',
                padding: '0.25rem 0.5rem',
                fontSize: '0.9375rem',
                fontWeight: 600,
                outline: 'none',
                boxShadow: '0 0 0 3px rgba(37,99,235,0.1)',
                width: '100%',
                maxWidth: '320px',
              }}
            />
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              style={{
                background: 'none',
                border: '1px solid transparent',
                borderRadius: 'var(--radius)',
                padding: '0.25rem 0.5rem',
                fontSize: '0.9375rem',
                fontWeight: 600,
                cursor: 'text',
                color: 'var(--text)',
                maxWidth: '320px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                transition: 'border-color var(--transition)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              title="Click to edit title"
            >
              {state.currentResume?.title || 'Untitled Resume'}
            </button>
          )}
        </div>

        {/* Save status */}
        <div style={{ flexShrink: 0 }}>
          <SaveStatusIndicator status={state.saveStatus} />
        </div>

        {/* Template selector button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowTemplateSelector(true)}
          style={{ flexShrink: 0 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          {currentTemplateId}
        </button>

        {/* Save button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={handleSave}
          disabled={!state.isDirty || state.saveStatus === 'saving'}
          style={{
            flexShrink: 0,
            position: 'relative',
          }}
        >
          {state.saveStatus === 'saving' ? (
            <span className="spinner spinner-sm" />
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
          )}
          Save
          {state.isDirty && state.saveStatus !== 'saving' && (
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '6px',
              height: '6px',
              background: 'var(--warning)',
              borderRadius: '50%',
              border: '1px solid var(--white)',
            }} />
          )}
        </button>

        {/* Export PDF button */}
        <button
          className="btn btn-primary btn-sm"
          onClick={handleExport}
          style={{ flexShrink: 0 }}
          title="Export as PDF"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export PDF
        </button>
      </header>

      {/* Error banner */}
      {state.error && (
        <div className="alert alert-error" style={{ borderRadius: 0, border: 'none', borderBottom: '1px solid #fca5a5' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {state.error}
          <button
            onClick={clearError}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Main two-column layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Editor panel */}
        <div style={{
          width: '500px',
          flexShrink: 0,
          overflowY: 'auto',
          background: 'var(--white)',
          borderRight: '1px solid var(--border)',
        }}>
          <ResumeEditor />
        </div>

        {/* Right: Preview panel */}
        <div style={{
          flex: 1,
          overflow: 'auto',  // both axes — A4 is 794px; allow horizontal scroll on narrow screens
          background: '#e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem 1.5rem',
        }}>
          <ResumePreview />
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <TemplateSelector
          selectedId={currentTemplateId}
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}
    </div>
  );
}
