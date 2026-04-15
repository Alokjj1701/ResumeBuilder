import { useState, useRef, useEffect } from 'react';
import { useResume } from '../../hooks/useResume';
import ModernTemplate from '../Preview/templates/ModernTemplate';
import MinimalTemplate from '../Preview/templates/MinimalTemplate';
import CorporateTemplate from '../Preview/templates/CorporateTemplate';
import TwoColumnTemplate from '../Preview/templates/TwoColumnTemplate';
import CreativeTemplate from '../Preview/templates/CreativeTemplate';
import TechTemplate from '../Preview/templates/TechTemplate';
import GradientTemplate from '../Preview/templates/GradientTemplate';
import SidebarTemplate from '../Preview/templates/SidebarTemplate';
import ExecutiveTemplate from '../Preview/templates/ExecutiveTemplate';
import EmeraldTemplate from '../Preview/templates/EmeraldTemplate';
import CoralTemplate from '../Preview/templates/CoralTemplate';
import NoirTemplate from '../Preview/templates/NoirTemplate';
import PrismaTemplate from '../Preview/templates/PrismaTemplate';
import ClassicTemplate from '../Preview/templates/ClassicTemplate';
import SageTemplate from '../Preview/templates/SageTemplate';
import ChronicleTemplate from '../Preview/templates/ChronicleTemplate';
import SlateTemplate from '../Preview/templates/SlateTemplate';

const TEMPLATE_COMPONENT_MAP = {
  modern: ModernTemplate, minimal: MinimalTemplate, corporate: CorporateTemplate,
  'two-column': TwoColumnTemplate, creative: CreativeTemplate, tech: TechTemplate,
  gradient: GradientTemplate, sidebar: SidebarTemplate, executive: ExecutiveTemplate,
  emerald: EmeraldTemplate, coral: CoralTemplate, noir: NoirTemplate,
  prisma: PrismaTemplate, classic: ClassicTemplate, sage: SageTemplate,
  chronicle: ChronicleTemplate, slate: SlateTemplate,
};

const SAMPLE_RESUME = {
  sections: {
    personalInfo: {
      firstName: 'Alex', lastName: 'Johnson',
      email: 'alex@email.com', phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexjohnson',
      github: 'github.com/alexjohnson',
      website: 'alexjohnson.dev',
    },
    summary: 'Results-driven professional with 5+ years of experience building scalable solutions. Passionate about clean code, user experience, and delivering measurable impact.',
    experience: [
      { id: 'e1', title: 'Senior Software Engineer', company: 'TechCorp Inc.', location: 'San Francisco, CA', startDate: '2021-03', endDate: '', current: true, description: 'Led development of core platform features serving 2M+ users.\nReduced API response time by 40% through optimization.' },
      { id: 'e2', title: 'Software Engineer', company: 'StartupXYZ', location: 'Remote', startDate: '2019-06', endDate: '2021-02', current: false, description: 'Built React frontend increasing user retention by 25%.\nImplemented CI/CD pipeline reducing deployment time by 60%.' },
    ],
    education: [
      { id: 'ed1', degree: 'B.S. Computer Science', fieldOfStudy: '', institution: 'UC Berkeley', location: 'Berkeley, CA', startDate: '2015-09', endDate: '2019-05', gpa: '3.8', description: '' },
    ],
    skills: [
      { id: 's1', category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind'] },
      { id: 's2', category: 'Backend', items: ['Node.js', 'Python', 'Java', 'PostgreSQL'] },
      { id: 's3', category: 'Tools', items: ['Git', 'Docker', 'AWS', 'Figma'] },
    ],
    projects: [
      { id: 'p1', name: 'Open Source Dashboard', description: 'Real-time analytics dashboard with React and D3.js.', url: 'github.com/alexjohnson/dashboard', technologies: ['React', 'D3.js', 'Node.js'], startDate: '2022-01', endDate: '2022-06' },
    ],
  },
};

const A4_WIDTH = 794;

function LiveMiniPreview({ tmpl }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.24);

  useEffect(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.offsetWidth;
    setScale(w / A4_WIDTH);
  }, []);

  const TemplateComp = TEMPLATE_COMPONENT_MAP[tmpl.id];
  if (!TemplateComp) return null;

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '140px', overflow: 'hidden', position: 'relative', background: '#fff' }}
    >
      <div style={{
        width: `${A4_WIDTH}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        <TemplateComp resume={{ ...SAMPLE_RESUME, templateId: tmpl.id }} />
      </div>
    </div>
  );
}

const ALL_TEMPLATES = [
  {
    id: 'modern', name: 'Modern', category: 'Professional', color: '#2563eb',
    gradient: 'linear-gradient(135deg,#2563eb,#60a5fa)',
    description: 'Clean contemporary design with a blue accent and skills sidebar.',
    features: ['Two-column layout', 'Blue accent bar', 'Skills sidebar', 'ATS-friendly'],
  },
  {
    id: 'minimal', name: 'Minimal', category: 'Simple', color: '#374151',
    gradient: 'linear-gradient(135deg,#374151,#9ca3af)',
    description: 'Timeless single-column layout. Maximum whitespace, zero noise.',
    features: ['Single column', 'Black & white', 'Classic typography', 'ATS-friendly'],
  },
  {
    id: 'corporate', name: 'Corporate', category: 'Traditional', color: '#1e3a5f',
    gradient: 'linear-gradient(135deg,#1e3a5f,#2d6a9f)',
    description: 'Traditional professional layout for corporate environments.',
    features: ['Dark header bar', 'Left border accents', 'Single column', 'Conservative style'],
  },
  {
    id: 'two-column', name: 'Two Column', category: 'Structured', color: '#374151',
    gradient: 'linear-gradient(135deg,#374151,#6b7280)',
    description: 'Balanced layout with contact info on the left sidebar.',
    features: ['Equal columns', 'Photo placeholder', 'Gray sidebar', 'Contact sidebar'],
  },
  {
    id: 'creative', name: 'Creative', category: 'Creative', color: '#7c3aed',
    gradient: 'linear-gradient(135deg,#7c3aed,#ec4899)',
    description: 'Bold purple-to-pink gradient header for designers and creatives.',
    features: ['Gradient header', 'Colorful skill tags', 'Bold typography', 'Creative flair'],
  },
  {
    id: 'tech', name: 'Tech', category: 'Technical', color: '#0f172a',
    gradient: 'linear-gradient(135deg,#0f172a,#1e40af)',
    description: 'Built for engineers — emphasizes links, projects, and tech stack.',
    features: ['Prominent links', 'Tech stack tags', 'Projects first', 'Dark minimal style'],
  },
  {
    id: 'gradient', name: 'Gradient', category: 'Creative', color: '#4f46e5',
    gradient: 'linear-gradient(135deg,#4f46e5,#7c3aed,#ec4899)',
    description: 'Vibrant indigo-to-pink gradient with Gen Z energy.',
    features: ['Indigo→pink gradient', 'Pill-shaped tags', 'Two-column body', 'Gen Z style'],
  },
  {
    id: 'sidebar', name: 'Sidebar', category: 'Professional', color: '#0f172a',
    gradient: 'linear-gradient(135deg,#0f172a,#38bdf8)',
    description: 'Dark navy sidebar with avatar initials and sky-blue accents.',
    features: ['Dark sidebar', 'Avatar initials', 'Sky-blue accents', 'Clean layout'],
  },
  {
    id: 'executive', name: 'Executive', category: 'Professional', color: '#c9a84c',
    gradient: 'linear-gradient(135deg,#0c1b33,#c9a84c)',
    description: 'Premium serif layout with gold accents for senior professionals.',
    features: ['Serif typography', 'Gold accents', 'Centered header', 'Achievement-focused'],
  },
  {
    id: 'emerald', name: 'Emerald', category: 'Creative', color: '#047857',
    gradient: 'linear-gradient(135deg,#065f46,#047857,#059669)',
    description: 'Canva-style wide teal sidebar with large avatar circle and pill skill tags.',
    features: ['Teal gradient sidebar', 'Avatar circle', 'Pill skill tags', 'Canva-inspired'],
  },
  {
    id: 'coral', name: 'Coral', category: 'Creative', color: '#ea580c',
    gradient: 'linear-gradient(135deg,#c2410c,#ea580c,#f97316)',
    description: 'Warm coral-orange header with avatar initials and vibrant two-zone layout.',
    features: ['Coral gradient header', 'Avatar initials', 'Orange date badges', 'Warm palette'],
  },
  {
    id: 'noir', name: 'Noir', category: 'Professional', color: '#1e293b',
    gradient: 'linear-gradient(135deg,#0f172a,#e11d48)',
    description: 'Dark slate header with rose accent — elegant, dramatic, unforgettable.',
    features: ['Dark slate header', 'Rose accents', 'Rounded avatar', 'Dot timeline'],
  },
  {
    id: 'prisma', name: 'Prisma', category: 'Creative', color: '#7c3aed',
    gradient: 'linear-gradient(160deg,#5b21b6,#7c3aed,#8b5cf6)',
    description: 'Bold violet left panel with stacked contact, skills, and clean white content.',
    features: ['Violet sidebar', 'Large avatar', 'Pill skill tags', 'Two-zone layout'],
  },
  {
    id: 'classic', name: 'Classic', category: 'Professional', color: '#374151',
    gradient: 'linear-gradient(135deg,#374151,#6b7280)',
    description: 'Photo top-left, date-column layout with serif typography.',
    features: ['Profile photo', 'Date-column layout', 'Serif typography', '4-col skills'],
  },
  {
    id: 'sage', name: 'Sage', category: 'Creative', color: '#4a5c4d',
    gradient: 'linear-gradient(135deg,#4a5c4d,#6b7c6e)',
    description: 'Olive-sage sidebar with full photo area and footer contact bar.',
    features: ['Photo sidebar', 'Large display name', 'Footer contact bar', 'Bullet skills'],
  },
  {
    id: 'chronicle', name: 'Chronicle', category: 'Professional', color: '#1e2a45',
    gradient: 'linear-gradient(135deg,#121c30,#1e2a45)',
    description: 'Dark navy header with circular photo, gray sidebar, timeline experience.',
    features: ['Circular photo', 'Navy header', 'Gray sidebar', 'Timeline dots'],
  },
  {
    id: 'slate', name: 'Slate', category: 'Simple', color: '#374151',
    gradient: 'linear-gradient(135deg,#374151,#9ca3af)',
    description: 'Gray rounded section bands, 3-column skills grid, ATS-clean.',
    features: ['Gray section bands', '3-col skills', 'Profile photo', 'ATS-friendly'],
  },
];

const CATEGORIES = ['All', 'Professional', 'Creative', 'Technical', 'Simple', 'Traditional', 'Structured'];


export default function TemplateSelector({ onSelect, selectedId, onClose }) {
  const { state } = useResume();
  const [filter, setFilter] = useState('All');

  // Merge backend templates with our local metadata (color/gradient/features)
  const templates = ALL_TEMPLATES.map((local) => {
    const fromServer = (state.templates || []).find((t) => t.id === local.id);
    return fromServer ? { ...local, ...fromServer, gradient: local.gradient, color: local.color, features: local.features } : local;
  });

  const visibleCategories = CATEGORIES.filter(
    (cat) => cat === 'All' || templates.some((t) => t.category === cat)
  );
  const filtered = filter === 'All' ? templates : templates.filter((t) => t.category === filter);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: '860px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Choose Template</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-light)', marginTop: '0.125rem' }}>
              Switch your resume's design anytime — content stays intact
            </p>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Category tabs */}
        <div style={{
          display: 'flex', gap: '0.4rem', padding: '0.75rem 1.5rem 0',
          borderBottom: '1px solid var(--border)',
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          {visibleCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '0.3125rem 0.875rem',
                borderRadius: '100px',
                border: '1.5px solid',
                borderColor: filter === cat ? 'var(--primary)' : 'var(--border)',
                background: filter === cat ? 'var(--primary)' : 'transparent',
                color: filter === cat ? '#fff' : 'var(--text-light)',
                fontSize: '0.8rem', fontWeight: 500,
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                marginBottom: '0.75rem',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="modal-body">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
            gap: '1rem',
          }}>
            {filtered.map((tmpl) => {
              const isSelected = selectedId === tmpl.id;
              const color = tmpl.color || '#2563eb';
              return (
                <div
                  key={tmpl.id}
                  onClick={() => onSelect(tmpl.id)}
                  style={{
                    border: `2px solid ${isSelected ? color : 'var(--border)'}`,
                    borderRadius: '14px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    boxShadow: isSelected ? `0 0 0 3px ${color}33` : 'var(--shadow-sm)',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = color;
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${color}22`;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {/* Mini preview */}
                  <div style={{ position: 'relative', borderBottom: '1px solid var(--border)' }}>
                    <LiveMiniPreview tmpl={tmpl} />
                    {isSelected && (
                      <div style={{
                        position: 'absolute', top: '8px', right: '8px',
                        width: '22px', height: '22px', background: '#fff',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{
                    padding: '0.7rem 0.875rem',
                    background: isSelected ? `${color}08` : 'var(--white)',
                    borderTop: `1px solid ${isSelected ? color : 'var(--border)'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>{tmpl.name}</span>
                      {isSelected ? (
                        <span style={{ fontSize: '0.7rem', color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                          Active
                        </span>
                      ) : (
                        <span style={{
                          padding: '1px 7px', borderRadius: '100px',
                          fontSize: '0.65rem', fontWeight: 500,
                          background: `${color}15`, color,
                        }}>
                          {tmpl.category}
                        </span>
                      )}
                    </div>
                    {tmpl.description && (
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginBottom: '0.375rem', lineHeight: 1.45 }}>
                        {tmpl.description}
                      </p>
                    )}
                    {(tmpl.features || []).slice(0, 3).map((f, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: '0.69rem', color: 'var(--text-light)', marginBottom: '0.1rem',
                      }}>
                        <span style={{ color, fontSize: '0.58rem' }}>▸</span>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
