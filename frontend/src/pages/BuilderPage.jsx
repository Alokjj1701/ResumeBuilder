import { useEffect, useState, useCallback, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useNavigate, useParams } from 'react-router-dom';
import { useResume } from '../hooks/useResume';
import useIsMobile from '../hooks/useIsMobile';
import ResumeEditor from '../components/Editor/ResumeEditor';
import ResumePreview from '../components/Preview/ResumePreview';
import TemplateSelector from '../components/TemplateSelector/TemplateSelector';
import AtsScorePanel from '../components/AI/AtsScorePanel';
import AiChatPanel from '../components/AI/AiChatPanel';
import JdMatcherPanel from '../components/AI/JdMatcherPanel';
import { sendResumePdfEmailWithBytes } from '../services/api';

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
    createNewResume,
    updateTitle,
    updateSections,
    changeTemplate,
    clearError,
  } = useResume();

  const isMobile = useIsMobile();
  const [mobileTab, setMobileTab] = useState('edit'); // 'edit' | 'preview' | 'ai'

  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showChat, setShowChat]           = useState(false);
  const [showJdMatcher, setShowJdMatcher] = useState(false);
  const [editingTitle, setEditingTitle]   = useState(false);
  const [pdfProgress, setPdfProgress]     = useState(0);  // 0 = idle, 1–100 = generating
  const [toasts, setToasts]               = useState([]);
  const pdfTimerRef      = useRef(null);
  const lastPdfBlobRef   = useRef(null);   // stored after download — reused for email action
  const lastPdfNameRef   = useRef('Resume.pdf');
  const [titleValue, setTitleValue] = useState('');
  const titleInputRef = useRef(null);
  const autoSaveTimer = useRef(null);

  // Load resume on mount
  useEffect(() => {
    loadTemplates();
    if (id) {
      loadResume(id);
    } else if (!state.currentResume) {
      createNewResume();
    }
  }, [id, loadResume, loadTemplates, createNewResume]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...toast }]);
    if (!toast.sticky) {
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), toast.duration || 5000);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── PDF Export (client-side — captures the live template preview) ───────────
  const handleExport = useCallback(async () => {
    if (pdfProgress > 0) return;

    const resume  = state.currentResume;
    const element = document.getElementById('resume-preview-page');
    if (!element) {
      addToast({ type: 'error', message: 'Preview not visible. Scroll to see it, then try again.' });
      return;
    }

    // Build filename from personal info
    const info     = resume?.sections?.personalInfo || {};
    const namePart = [info.firstName, info.lastName].filter(Boolean).join(' ');
    const fileName = namePart ? `${namePart} Resume.pdf` : 'Resume.pdf';
    lastPdfNameRef.current = fileName;

    // Smooth progress ramp while html2canvas works
    setPdfProgress(5);
    pdfTimerRef.current = setInterval(() => {
      setPdfProgress((p) => (p < 82 ? p + 4 : p));
    }, 180);

    try {
      // ── 1. Capture the rendered template as a high-res canvas ──────────────
      const canvas = await html2canvas(element, {
        scale: 2,                // 2× for retina-quality text
        useCORS: true,           // allow cross-origin profile photos
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        // Prevent transforms on the clone from affecting capture
        onclone: (_doc, cloned) => {
          cloned.style.transform      = 'none';
          cloned.style.transformOrigin = 'top left';
          cloned.style.boxShadow      = 'none';
        },
      });

      clearInterval(pdfTimerRef.current);
      setPdfProgress(88);

      // ── 2. Build an A4 PDF from the canvas ────────────────────────────────
      const { jsPDF } = await import('jspdf');
      const pdf        = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW      = pdf.internal.pageSize.getWidth();   // 210 mm
      const pageH      = pdf.internal.pageSize.getHeight();  // 297 mm

      const imgData   = canvas.toDataURL('image/jpeg', 0.95);
      const imgWidth  = pageW;
      const imgHeight = (canvas.height / canvas.width) * pageW;

      // Multi-page: slide the image up by one page-height on each new page
      let heightLeft = imgHeight;
      let position   = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageH;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;   // negative → shifts image up
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageH;
      }

      // ── 3. Download ───────────────────────────────────────────────────────
      const pdfBlob = pdf.output('blob');
      lastPdfBlobRef.current = pdfBlob;

      const url = URL.createObjectURL(pdfBlob);
      const a   = document.createElement('a');
      a.href     = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setPdfProgress(100);
      setTimeout(() => setPdfProgress(0), 800);

      // ── 4. Success toast with optional email action ───────────────────────
      const resumeId = resume?.id;
      addToast({
        type: 'success',
        message: '🎉 Your resume is ready!',
        sticky: true,
        action: resumeId ? {
          label: 'Send to my inbox →',
          onClick: async (toastId) => {
            removeToast(toastId);
            try {
              await sendResumePdfEmailWithBytes(
                resumeId,
                lastPdfBlobRef.current,
                lastPdfNameRef.current,
              );
              addToast({ type: 'success', message: '📬 Sent! Check your inbox.' });
            } catch {
              addToast({ type: 'error', message: 'Could not send email. Try again.' });
            }
          },
        } : undefined,
      });
    } catch (err) {
      console.error('PDF export failed:', err);
      clearInterval(pdfTimerRef.current);
      setPdfProgress(0);
      addToast({ type: 'error', message: 'PDF generation failed. Please try again.' });
    }
  }, [pdfProgress, state.currentResume, addToast, removeToast]);

  const handleJdAccept = useCallback((tailoredSections) => {
    const current = state.currentResume?.sections || {};
    updateSections({ ...current, ...tailoredSections });
  }, [state.currentResume?.sections, updateSections]);

  // fieldPath: 'summary' | 'experience.0.description' | 'projects.1.description' | 'education.0.description'
  const handleChatApply = useCallback((fieldPath, text) => {
    const current = state.currentResume?.sections || {};
    const parts = fieldPath.split('.');
    if (parts.length === 1) {
      updateSections({ ...current, [parts[0]]: text });
    } else {
      const [sectionKey, idx, field] = parts;
      const arr = [...(current[sectionKey] || [])];
      arr[parseInt(idx)] = { ...arr[parseInt(idx)], [field]: text };
      updateSections({ ...current, [sectionKey]: arr });
    }
  }, [state.currentResume?.sections, updateSections]);

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

  // ── Mobile layout ─────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>
        {/* Mobile top bar */}
        <header style={{
          background: 'var(--white)',
          borderBottom: '1px solid var(--border)',
          padding: '0 0.75rem',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexShrink: 0,
          zIndex: 50,
        }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')} style={{ padding: '0.5rem', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {state.currentResume?.title || 'Untitled Resume'}
            </div>
          </div>

          <SaveStatusIndicator status={state.saveStatus} />

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowTemplateSelector(true)}
            style={{ flexShrink: 0, padding: '0.375rem 0.625rem', fontSize: '0.75rem' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleExport}
            disabled={pdfProgress > 0}
            style={{ flexShrink: 0, padding: '0.375rem 0.75rem', fontSize: '0.8rem', minWidth: '70px' }}
          >
            {pdfProgress > 0 ? <span className="spinner spinner-sm" /> : 'Export'}
          </button>
        </header>

        {/* Error banner */}
        {state.error && (
          <div className="alert alert-error" style={{ borderRadius: 0, border: 'none', borderBottom: '1px solid #fca5a5', fontSize: '0.8125rem' }}>
            {state.error}
            <button onClick={clearError} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>✕</button>
          </div>
        )}

        {/* Tab content */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {/* Edit tab */}
          <div style={{ display: mobileTab === 'edit' ? 'flex' : 'none', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--white)' }}>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <ResumeEditor />
            </div>
          </div>

          {/* Preview tab */}
          <div style={{ display: mobileTab === 'preview' ? 'flex' : 'none', flexDirection: 'column', height: '100%', overflow: 'auto', background: '#e5e7eb', alignItems: 'center', padding: '1rem' }}>
            <div style={{
              transformOrigin: 'top center',
              transform: `scale(${Math.min((window.innerWidth - 32) / 794, 1)})`,
              marginBottom: `calc((${Math.min((window.innerWidth - 32) / 794, 1)} - 1) * 1123px)`,
            }}>
              <ResumePreview />
            </div>
          </div>

          {/* AI tab */}
          <div style={{ display: mobileTab === 'ai' ? 'flex' : 'none', flexDirection: 'column', height: '100%', overflowY: 'auto', background: 'var(--bg)', gap: '0' }}>
            <AtsScorePanel sections={state.currentResume?.sections} saveStatus={state.saveStatus} />
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                className="btn btn-sm"
                onClick={() => { setShowJdMatcher(true); setShowChat(false); }}
                style={{ background: '#faf5ff', color: '#7c3aed', border: '1px solid #ddd6fe', fontWeight: 600, justifyContent: 'center', padding: '0.75rem' }}
              >
                🎯 JD Match — Tailor resume to a job description
              </button>
              <button
                className="btn btn-sm"
                onClick={() => { setShowChat(true); setShowJdMatcher(false); }}
                style={{ background: '#faf5ff', color: '#7c3aed', border: '1px solid #ddd6fe', fontWeight: 600, justifyContent: 'center', padding: '0.75rem' }}
              >
                ✨ AI Coach — Chat about your resume
              </button>
            </div>
          </div>
        </div>

        {/* Bottom tab bar */}
        <nav style={{
          display: 'flex',
          background: 'var(--white)',
          borderTop: '1px solid var(--border)',
          flexShrink: 0,
          height: '56px',
        }}>
          {[
            { id: 'edit',    label: 'Edit',    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
            { id: 'preview', label: 'Preview', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
            { id: 'ai',      label: 'AI',      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMobileTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: mobileTab === tab.id ? 'var(--brand)' : 'var(--text-light)',
                fontSize: '0.7rem',
                fontWeight: mobileTab === tab.id ? 700 : 400,
                borderTop: `2px solid ${mobileTab === tab.id ? 'var(--brand)' : 'transparent'}`,
                transition: 'color 0.15s',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Modals (same as desktop) */}
        {showTemplateSelector && (
          <TemplateSelector selectedId={currentTemplateId} onSelect={handleTemplateSelect} onClose={() => setShowTemplateSelector(false)} />
        )}
        {showChat && (
          <AiChatPanel sections={state.currentResume?.sections} onApply={handleChatApply} onClose={() => setShowChat(false)} />
        )}
        {showJdMatcher && (
          <JdMatcherPanel sections={state.currentResume?.sections} onAcceptAll={handleJdAccept} onClose={() => setShowJdMatcher(false)} />
        )}

        {/* Toast container */}
        <div style={{ position: 'fixed', bottom: '72px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 500, alignItems: 'center', pointerEvents: 'none', width: '90vw' }}>
          {toasts.map((toast) => (
            <div key={toast.id} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 14px', borderRadius: '12px',
              background: toast.type === 'error' ? '#fef2f2' : '#f0fdf4',
              border: `1px solid ${toast.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              fontSize: '0.8125rem', fontWeight: 500,
              color: toast.type === 'error' ? '#dc2626' : '#166534',
              width: '100%', animation: 'toastIn 0.25s ease', pointerEvents: 'auto',
            }}>
              <span style={{ flex: 1 }}>{toast.message}</span>
              {toast.action && (
                <button type="button" onClick={() => toast.action.onClick(toast.id)}
                  style={{ padding: '4px 10px', borderRadius: '8px', border: 'none', background: '#7c3aed', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {toast.action.label}
                </button>
              )}
              <button type="button" onClick={() => removeToast(toast.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.6 }}>✕</button>
            </div>
          ))}
        </div>
        <style>{`@keyframes toastIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
      </div>
    );
  }

  // ── Desktop layout (unchanged) ────────────────────────────────────────────
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

        {/* AI toolbar buttons */}
        <button
          className="btn btn-sm"
          onClick={() => { setShowJdMatcher((v) => !v); setShowChat(false); }}
          style={{
            flexShrink: 0,
            background: showJdMatcher ? '#7c3aed' : '#faf5ff',
            color: showJdMatcher ? '#fff' : '#7c3aed',
            border: '1px solid #ddd6fe',
            fontWeight: 600,
          }}
        >
          🎯 JD Match
        </button>
        <button
          className="btn btn-sm"
          onClick={() => { setShowChat((v) => !v); setShowJdMatcher(false); }}
          style={{
            flexShrink: 0,
            background: showChat ? '#7c3aed' : '#faf5ff',
            color: showChat ? '#fff' : '#7c3aed',
            border: '1px solid #ddd6fe',
            fontWeight: 600,
          }}
        >
          ✨ AI Coach
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

        {/* Export PDF button with progress bar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleExport}
            disabled={pdfProgress > 0}
            style={{ minWidth: '110px', position: 'relative', overflow: 'hidden' }}
            title="Download as PDF"
          >
            {/* Progress fill */}
            {pdfProgress > 0 && (
              <div style={{
                position: 'absolute',
                inset: 0,
                width: `${pdfProgress}%`,
                background: 'rgba(255,255,255,0.25)',
                transition: 'width 0.25s ease',
                borderRadius: 'inherit',
              }} />
            )}
            <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '5px' }}>
              {pdfProgress > 0 ? (
                <>
                  <span style={{
                    width: '12px', height: '12px',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  Generating…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export PDF
                </>
              )}
            </span>
          </button>
        </div>
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
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--white)',
          borderRight: '1px solid var(--border)',
          overflow: 'hidden',
        }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <ResumeEditor />
          </div>
          <AtsScorePanel
            sections={state.currentResume?.sections}
            saveStatus={state.saveStatus}
          />
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

      {/* AI Chat Panel */}
      {showChat && (
        <AiChatPanel
          sections={state.currentResume?.sections}
          onApply={handleChatApply}
          onClose={() => setShowChat(false)}
        />
      )}

      {/* JD Matcher Panel */}
      {showJdMatcher && (
        <JdMatcherPanel
          sections={state.currentResume?.sections}
          onAcceptAll={handleJdAccept}
          onClose={() => setShowJdMatcher(false)}
        />
      )}

      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 500,
        alignItems: 'center',
        pointerEvents: 'none',
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              borderRadius: '12px',
              background: toast.type === 'error' ? '#fef2f2' : '#f0fdf4',
              border: `1px solid ${toast.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: toast.type === 'error' ? '#dc2626' : '#166534',
              maxWidth: '420px',
              animation: 'toastIn 0.25s ease',
              pointerEvents: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ flex: 1 }}>{toast.message}</span>
            {toast.action && (
              <button
                type="button"
                onClick={() => toast.action.onClick(toast.id)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#7c3aed',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {toast.action.label}
              </button>
            )}
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: '0 2px', opacity: 0.6 }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
