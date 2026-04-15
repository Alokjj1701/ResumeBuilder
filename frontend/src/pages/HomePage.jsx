import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useResume } from '../hooks/useResume';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/Home/HeroSection';
import WhyResumeMatters from '../components/Home/WhyResumeMatters';
import FeaturesSection from '../components/Home/FeaturesSection';
import Testimonials from '../components/Home/Testimonials';
import TemplatesGrid, { LiveMiniPreview, TEMPLATE_COMPONENT_MAP, SAMPLE_RESUME } from '../components/Home/TemplatesGrid';
import CtaSection from '../components/Home/CtaSection';

// Template metadata (used by ResumeCard + TemplatePickerModal)
const ALL_TEMPLATES = [
  { id: 'modern',     name: 'Modern',     category: 'Professional', color: '#2563eb' },
  { id: 'minimal',    name: 'Minimal',    category: 'Simple',       color: '#374151' },
  { id: 'corporate',  name: 'Corporate',  category: 'Traditional',  color: '#1e3a5f' },
  { id: 'creative',   name: 'Creative',   category: 'Creative',     color: '#7c3aed' },
  { id: 'tech',       name: 'Tech',       category: 'Technical',    color: '#0f172a' },
  { id: 'gradient',   name: 'Gradient',   category: 'Creative',     color: '#4f46e5' },
  { id: 'sidebar',    name: 'Sidebar',    category: 'Professional', color: '#0f172a' },
  { id: 'two-column', name: 'Two Column', category: 'Structured',   color: '#374151' },
  { id: 'executive',  name: 'Executive',  category: 'Professional', color: '#c9a84c' },
  { id: 'emerald',    name: 'Emerald',    category: 'Creative',     color: '#047857' },
  { id: 'coral',      name: 'Coral',      category: 'Creative',     color: '#ea580c' },
  { id: 'noir',       name: 'Noir',       category: 'Professional', color: '#1e293b' },
  { id: 'prisma',     name: 'Prisma',     category: 'Creative',     color: '#7c3aed' },
  { id: 'classic',    name: 'Classic',    category: 'Professional', color: '#374151' },
  { id: 'sage',       name: 'Sage',       category: 'Creative',     color: '#4a5c4d' },
  { id: 'chronicle',  name: 'Chronicle',  category: 'Professional', color: '#1e2a45' },
  { id: 'slate',      name: 'Slate',      category: 'Simple',       color: '#374151' },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return dateStr; }
}

/* ─── Resume Card ────────────────────────────────────────────────────── */
function ResumeCard({ resume, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const tmpl = ALL_TEMPLATES.find((t) => t.id === resume.templateId) || ALL_TEMPLATES[0];

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${resume.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try { await onDelete(resume.id); } catch { setDeleting(false); }
  };

  const previewResume = resume.sections
    ? { sections: resume.sections, templateId: tmpl.id }
    : { ...SAMPLE_RESUME, templateId: tmpl.id };

  return (
    <div
      onClick={() => onEdit(resume)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
        border: `1.5px solid ${hovered ? tmpl.color + '55' : 'var(--border)'}`,
        background: 'var(--white)',
        boxShadow: hovered ? `0 14px 40px ${tmpl.color}20` : 'var(--shadow-sm)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.22s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* Live template preview banner */}
      <div style={{ position: 'relative', borderBottom: '1px solid var(--border)' }}>
        <LiveMiniPreview
          tmpl={tmpl}
          resume={previewResume}
          height={110}
        />
        <div style={{
          position: 'absolute', top: '8px', right: '8px',
          padding: '2px 8px', background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(4px)', borderRadius: '100px',
          fontSize: '0.65rem', color: 'rgba(255,255,255,0.95)', fontWeight: 600,
        }}>
          {tmpl.name}
        </div>
      </div>

      <div style={{ padding: '0.875rem 1rem' }}>
        <h3 style={{
          fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text)',
          marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {resume.title || 'Untitled Resume'}
        </h3>

        {resume.sections?.personalInfo?.firstName && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-light)', marginBottom: '0.125rem' }}>
            {resume.sections.personalInfo.firstName} {resume.sections.personalInfo.lastName}
          </p>
        )}
        {resume.sections?.personalInfo?.email && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-lighter)', marginBottom: '0.625rem' }}>
            {resume.sections.personalInfo.email}
          </p>
        )}
        <p style={{ fontSize: '0.72rem', color: 'var(--text-lighter)', marginBottom: '0.75rem' }}>
          Updated {formatDate(resume.updatedAt)}
        </p>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
            onClick={(e) => { e.stopPropagation(); onEdit(resume); }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Delete resume"
          >
            {deleting ? <span className="spinner spinner-sm" /> : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Template Picker Modal ──────────────────────────────────────────── */
function TemplatePickerModal({ templates, onSelect, onClose }) {
  const [selected, setSelected] = useState('modern');
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...Array.from(new Set(templates.map((t) => t.category)))];
  const filtered = filter === 'All' ? templates : templates.filter((t) => t.category === filter);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '860px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Choose a Template</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.125rem' }}>
              Pick a design — you can always change it later.
            </p>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', padding: '0.75rem 1.5rem 0', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '0.3rem 0.875rem', borderRadius: '100px',
                border: '1.5px solid', borderColor: filter === cat ? '#7c3aed' : 'var(--border)',
                background: filter === cat ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'transparent',
                color: filter === cat ? '#fff' : 'var(--text-light)',
                fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
                whiteSpace: 'nowrap', transition: 'all 0.15s ease', marginBottom: '0.75rem',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.875rem' }}>
            {filtered.map((tmpl) => {
              const color = tmpl.color || '#2563eb';
              const isSelected = selected === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelected(tmpl.id)}
                  style={{
                    border: `2px solid ${isSelected ? color : 'var(--border)'}`,
                    borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    boxShadow: isSelected ? `0 0 0 3px ${color}33` : 'var(--shadow-sm)',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = color; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  {/* Live mini preview */}
                  <div style={{ position: 'relative' }}>
                    <LiveMiniPreview tmpl={tmpl} height={120} />
                    {isSelected && (
                      <div style={{
                        position: 'absolute', top: '6px', right: '6px',
                        width: '20px', height: '20px', background: '#fff', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div style={{
                    padding: '0.5rem 0.75rem',
                    background: isSelected ? `${color}08` : 'var(--white)',
                    borderTop: `1px solid ${isSelected ? color : 'var(--border)'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text)' }}>{tmpl.name}</span>
                      <span style={{ padding: '1px 6px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 500, background: `${color}18`, color }}>
                        {tmpl.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={() => { onSelect(selected); onClose(); }}
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Resume
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── User Menu ──────────────────────────────────────────────────────── */
function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'none', border: '1.5px solid var(--border)',
          borderRadius: '100px', padding: '0.3rem 0.75rem 0.3rem 0.3rem',
          cursor: 'pointer', transition: 'border-color 0.15s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4f46e5'}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        {/* Avatar */}
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          color: '#fff', fontSize: '0.7rem', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.fullName || user?.email}
        </span>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="2"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 299 }} onClick={() => setOpen(false)} />
          {/* Dropdown */}
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            background: 'var(--white)', border: '1px solid var(--border)',
            borderRadius: '14px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            minWidth: '200px', zIndex: 300, overflow: 'hidden',
          }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.15rem' }}>
                {user?.fullName || 'User'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </div>
            </div>
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              style={{
                width: '100%', padding: '0.7rem 1rem',
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '0.8125rem', fontWeight: 500, color: '#dc2626',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────── */
export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { state, loadResumes, loadTemplates, createNewResume, deleteResume } = useResume();
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  useEffect(() => {
    loadResumes();
    loadTemplates();
  }, [loadResumes, loadTemplates]);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  const handleNew = useCallback(() => setShowTemplateModal(true), []);

  const handleTemplateSelected = useCallback((templateId) => {
    createNewResume(templateId);
    navigate('/builder');
  }, [createNewResume, navigate]);

  const handleSelectTemplate = useCallback((templateId) => {
    createNewResume(templateId);
    navigate('/builder');
  }, [createNewResume, navigate]);

  const handleEdit = useCallback((resume) => navigate(`/builder/${resume.id}`), [navigate]);

  const handleViewTemplates = useCallback(() => {
    document.getElementById('templates-section')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const templates = state.templates.length > 0
    ? state.templates
        .filter((t) => ALL_TEMPLATES.some((at) => at.id === t.id))   // drop DB-only templates with no component
        .map((t) => ({ ...ALL_TEMPLATES.find((at) => at.id === t.id), ...t }))
    : ALL_TEMPLATES;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 200,
        height: '60px',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '34px', height: '34px',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(79,70,229,0.4)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.1, letterSpacing: '-0.3px' }}>
              Resume
              <span style={{ background: 'linear-gradient(135deg, #4f46e5, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Craft
              </span>
            </div>
            <div style={{ fontSize: '0.67rem', color: 'var(--text-lighter)', lineHeight: 1 }}>Build. Preview. Export.</div>
          </div>
        </div>

        {/* Nav links + user */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button
            onClick={handleViewTemplates}
            style={{ background: 'none', border: 'none', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-light)', cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-light)'}
          >
            Templates
          </button>
          {state.resumes.length > 0 && (
            <button
              onClick={() => document.getElementById('your-resumes')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'none', border: 'none', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-light)', cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-light)'}
            >
              My Resumes ({state.resumes.length})
            </button>
          )}
          <button
            onClick={handleNew}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.4rem 1rem',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: '#fff', border: 'none', borderRadius: '100px',
              fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(79,70,229,0.35)',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Resume
          </button>
          <UserMenu user={user} onLogout={handleLogout} />
        </div>
      </nav>

      {/* ── Hero ── */}
      <HeroSection onCreateResume={handleNew} onViewTemplates={handleViewTemplates} />

      {/* ── Why Resume Matters ── */}
      <WhyResumeMatters />

      {/* ── Features ── */}
      <FeaturesSection />

      {/* ── Templates Grid ── */}
      <TemplatesGrid onSelectTemplate={handleSelectTemplate} />

      {/* ── Testimonials ── */}
      <Testimonials />

      {/* ── Your Resumes (existing) ── */}
      {!state.loading && state.resumes.length > 0 && (
        <section id="your-resumes" style={{
          padding: 'clamp(3rem,7vw,5rem) 2rem',
          background: 'var(--bg)',
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: '-60px' }}
            >
              {/* Error */}
              {state.error && (
                <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {state.error}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.375rem', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.4px' }}>
                    Your Resumes
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                    {state.resumes.length} resume{state.resumes.length !== 1 ? 's' : ''} · click to open in editor
                  </p>
                </div>
                <button
                  onClick={handleNew}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.5rem 1.125rem',
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    color: '#fff', border: 'none', borderRadius: '100px',
                    fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(79,70,229,0.3)',
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  New Resume
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.125rem' }}>
                {state.resumes.map((resume, i) => (
                  <motion.div
                    key={resume.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                  >
                    <ResumeCard resume={resume} onEdit={handleEdit} onDelete={deleteResume} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ── */}
      <CtaSection onCreateResume={handleNew} />

      {/* ── Footer ── */}
      <footer style={{
        background: '#06040f', borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '1.5rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '0.5rem',
      }}>
        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
          Built with ♥ · ResumeCraft · Free forever
        </span>
      </footer>

      {/* ── Template Picker Modal ── */}
      {showTemplateModal && (
        <TemplatePickerModal
          templates={templates}
          onSelect={handleTemplateSelected}
          onClose={() => setShowTemplateModal(false)}
        />
      )}
    </div>
  );
}
