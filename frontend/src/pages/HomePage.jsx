import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useResume } from '../hooks/useResume';
import HeroSection from '../components/Home/HeroSection';
import WhyResumeMatters from '../components/Home/WhyResumeMatters';
import FeaturesSection from '../components/Home/FeaturesSection';
import Testimonials from '../components/Home/Testimonials';
import TemplatesGrid from '../components/Home/TemplatesGrid';
import CtaSection from '../components/Home/CtaSection';

// Template metadata (used by ResumeCard + TemplatePickerModal)
const ALL_TEMPLATES = [
  { id: 'modern',     name: 'Modern',     category: 'Professional', color: '#2563eb', gradient: 'linear-gradient(135deg,#2563eb,#60a5fa)', features: ['Two-column layout','Blue accent','Skills sidebar'] },
  { id: 'minimal',    name: 'Minimal',    category: 'Simple',       color: '#374151', gradient: 'linear-gradient(135deg,#374151,#9ca3af)', features: ['Single column','Black & white','ATS-friendly'] },
  { id: 'corporate',  name: 'Corporate',  category: 'Traditional',  color: '#1e3a5f', gradient: 'linear-gradient(135deg,#1e3a5f,#2d6a9f)', features: ['Dark header','Border accents','Conservative'] },
  { id: 'creative',   name: 'Creative',   category: 'Creative',     color: '#7c3aed', gradient: 'linear-gradient(135deg,#7c3aed,#ec4899)', features: ['Gradient header','Colorful tags','Bold type'] },
  { id: 'tech',       name: 'Tech',       category: 'Technical',    color: '#0f172a', gradient: 'linear-gradient(135deg,#0f172a,#1e40af)', features: ['GitHub links','Tech tags','Projects first'] },
  { id: 'gradient',   name: 'Gradient',   category: 'Creative',     color: '#4f46e5', gradient: 'linear-gradient(135deg,#4f46e5,#7c3aed,#ec4899)', features: ['Indigo→pink gradient','Pill tags','Gen Z style'] },
  { id: 'sidebar',    name: 'Sidebar',    category: 'Professional', color: '#0f172a', gradient: 'linear-gradient(135deg,#0f172a,#38bdf8)', features: ['Dark sidebar','Avatar initials','Sky accents'] },
  { id: 'two-column', name: 'Two Column', category: 'Structured',   color: '#374151', gradient: 'linear-gradient(135deg,#374151,#6b7280)', features: ['Equal columns','Contact sidebar','Compact'] },
  { id: 'executive',  name: 'Executive',  category: 'Professional', color: '#c9a84c', gradient: 'linear-gradient(135deg,#0c1b33,#c9a84c)', features: ['Serif typography','Gold accents','Premium feel'] },
  { id: 'emerald',   name: 'Emerald',   category: 'Creative',     color: '#047857', gradient: 'linear-gradient(135deg,#065f46,#047857,#059669)', features: ['Teal sidebar','Avatar circle','Canva-style'] },
  { id: 'coral',     name: 'Coral',     category: 'Creative',     color: '#ea580c', gradient: 'linear-gradient(135deg,#c2410c,#ea580c,#f97316)', features: ['Coral header','Avatar initials','Warm palette'] },
  { id: 'noir',      name: 'Noir',      category: 'Professional', color: '#1e293b', gradient: 'linear-gradient(135deg,#0f172a,#e11d48)', features: ['Dark slate header','Rose accents','Dramatic'] },
  { id: 'prisma',    name: 'Prisma',    category: 'Creative',     color: '#7c3aed', gradient: 'linear-gradient(160deg,#5b21b6,#7c3aed,#8b5cf6)', features: ['Violet sidebar','Large avatar','Bold layout'] },
  { id: 'classic',   name: 'Classic',   category: 'Professional', color: '#374151', gradient: 'linear-gradient(135deg,#374151,#6b7280)', features: ['Profile photo','Date-column','Serif type'] },
  { id: 'sage',      name: 'Sage',      category: 'Creative',     color: '#4a5c4d', gradient: 'linear-gradient(135deg,#4a5c4d,#6b7c6e)', features: ['Photo sidebar','Display name','Footer bar'] },
  { id: 'chronicle', name: 'Chronicle', category: 'Professional', color: '#1e2a45', gradient: 'linear-gradient(135deg,#121c30,#1e2a45)', features: ['Circular photo','Navy header','Timeline'] },
  { id: 'slate',     name: 'Slate',     category: 'Simple',       color: '#374151', gradient: 'linear-gradient(135deg,#374151,#9ca3af)', features: ['Section bands','3-col skills','ATS-ready'] },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return dateStr; }
}

/* ─── Resume Card (for "Your Resumes" grid) ─────────────────────────── */
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
      {/* Gradient banner */}
      <div style={{ height: '80px', background: tmpl.gradient, position: 'relative', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px' }}>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.6)', borderRadius: '3px', width: '50%', marginBottom: '5px' }} />
          <div style={{ height: '2px', background: 'rgba(255,255,255,0.3)', borderRadius: '1px', width: '35%', marginBottom: '8px' }} />
          <div style={{ display: 'flex', gap: '4px' }}>
            {[60, 75, 55].map((w, i) => (
              <div key={i} style={{ height: '2px', background: 'rgba(255,255,255,0.2)', borderRadius: '1px', width: `${w}%` }} />
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />
        <div style={{
          position: 'absolute', top: '8px', right: '8px',
          padding: '2px 8px', background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(4px)', borderRadius: '100px',
          fontSize: '0.65rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600,
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
      <div className="modal" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.875rem' }}>
            {filtered.map((tmpl) => {
              const color = tmpl.color || '#2563eb';
              const gradient = tmpl.gradient || `linear-gradient(135deg, ${color}, ${color}88)`;
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
                  <div style={{ height: '76px', background: gradient, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ padding: '8px 10px' }}>
                      <div style={{ height: '5px', background: 'rgba(255,255,255,0.7)', borderRadius: '3px', width: '60%', marginBottom: '4px' }} />
                      <div style={{ height: '2px', background: 'rgba(255,255,255,0.4)', borderRadius: '1px', width: '40%', marginBottom: '5px' }} />
                      {[80, 70, 60].map((w, i) => (
                        <div key={i} style={{ height: '2px', background: 'rgba(255,255,255,0.22)', borderRadius: '1px', width: `${w}%`, marginBottom: '2px' }} />
                      ))}
                    </div>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />
                    {isSelected && (
                      <div style={{
                        position: 'absolute', top: '6px', right: '6px',
                        width: '20px', height: '20px', background: '#fff', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div style={{
                    padding: '0.625rem 0.75rem',
                    background: isSelected ? `${color}08` : 'var(--white)',
                    borderTop: `1px solid ${isSelected ? color : 'var(--border)'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text)' }}>{tmpl.name}</span>
                      <span style={{ padding: '1px 6px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 500, background: `${color}18`, color }}>
                        {tmpl.category}
                      </span>
                    </div>
                    {(tmpl.features || []).slice(0, 2).map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-light)' }}>
                        <span style={{ color, fontSize: '0.55rem' }}>▸</span>{f}
                      </div>
                    ))}
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

/* ─── Main Page ──────────────────────────────────────────────────────── */
export default function HomePage() {
  const navigate = useNavigate();
  const { state, loadResumes, loadTemplates, createNewResume, deleteResume } = useResume();
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  useEffect(() => {
    loadResumes();
    loadTemplates();
  }, [loadResumes, loadTemplates]);

  const handleNew = useCallback(() => setShowTemplateModal(true), []);

  const handleTemplateSelected = useCallback((templateId) => {
    createNewResume(templateId);
    navigate('/builder');
  }, [createNewResume, navigate]);

  // Also used by TemplatesGrid "Use Template" buttons
  const handleSelectTemplate = useCallback((templateId) => {
    createNewResume(templateId);
    navigate('/builder');
  }, [createNewResume, navigate]);

  const handleEdit = useCallback((resume) => navigate(`/builder/${resume.id}`), [navigate]);

  const handleViewTemplates = useCallback(() => {
    document.getElementById('templates-section')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const templates = state.templates.length > 0
    ? state.templates.map((t) => ({ ...ALL_TEMPLATES.find((at) => at.id === t.id) || {}, ...t }))
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

        {/* Nav links + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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
