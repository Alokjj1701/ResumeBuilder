import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
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
      { id: 'e1', title: 'Senior Software Engineer', company: 'TechCorp Inc.', location: 'San Francisco, CA', startDate: '2021-03', endDate: '', current: true, description: 'Led development of core platform features serving 2M+ users.\nReduced API response time by 40% through optimization.\nMentored 4 junior engineers and conducted code reviews.' },
      { id: 'e2', title: 'Software Engineer', company: 'StartupXYZ', location: 'Remote', startDate: '2019-06', endDate: '2021-02', current: false, description: 'Built React frontend increasing user retention by 25%.\nImplemented CI/CD pipeline reducing deployment time by 60%.' },
    ],
    education: [
      { id: 'ed1', degree: 'B.S. Computer Science', fieldOfStudy: '', institution: 'UC Berkeley', location: 'Berkeley, CA', startDate: '2015-09', endDate: '2019-05', gpa: '3.8', description: '' },
    ],
    skills: [
      { id: 's1', category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'] },
      { id: 's2', category: 'Backend', items: ['Node.js', 'Python', 'Java', 'PostgreSQL'] },
      { id: 's3', category: 'Tools', items: ['Git', 'Docker', 'AWS', 'Figma'] },
    ],
    projects: [
      { id: 'p1', name: 'Open Source Dashboard', description: 'Real-time analytics dashboard with React and D3.js, used by 500+ developers.', url: 'github.com/alexjohnson/dashboard', technologies: ['React', 'D3.js', 'Node.js'], startDate: '2022-01', endDate: '2022-06' },
    ],
  },
};

const A4_WIDTH = 794;

function LiveMiniPreview({ tmpl }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.42);

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
      style={{ width: '100%', height: '195px', overflow: 'hidden', position: 'relative', background: '#fff' }}
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

const TEMPLATES = [
  {
    id: 'modern',     name: 'Modern',     category: 'Professional', color: '#2563eb',
    gradient: 'linear-gradient(135deg,#2563eb,#60a5fa)',
    description: 'Clean two-column layout with blue accent bar and skills sidebar.',
    badge: 'Most Popular',
    badgeColor: '#2563eb',
  },
  {
    id: 'gradient',   name: 'Gradient',   category: 'Creative',     color: '#4f46e5',
    gradient: 'linear-gradient(135deg,#4f46e5,#7c3aed,#ec4899)',
    description: 'Bold indigo-to-pink gradient header. Made for standing out.',
    badge: 'Gen Z Fave',
    badgeColor: '#7c3aed',
  },
  {
    id: 'creative',   name: 'Creative',   category: 'Creative',     color: '#7c3aed',
    gradient: 'linear-gradient(135deg,#7c3aed,#ec4899)',
    description: 'Vibrant purple-pink header with colorful skill tags. Bold typography.',
    badge: 'Designer Pick',
    badgeColor: '#ec4899',
  },
  {
    id: 'sidebar',    name: 'Sidebar',    category: 'Professional', color: '#0f172a',
    gradient: 'linear-gradient(135deg,#0f172a,#38bdf8)',
    description: 'Dark navy sidebar with avatar initials and sky-blue accents.',
    badge: null,
    badgeColor: null,
  },
  {
    id: 'tech',       name: 'Tech',       category: 'Technical',    color: '#1e40af',
    gradient: 'linear-gradient(135deg,#0f172a,#1e40af)',
    description: 'Built for engineers — prominent links, tech stack tags, projects first.',
    badge: 'Engineers ♥',
    badgeColor: '#1e40af',
  },
  {
    id: 'executive',  name: 'Executive',  category: 'Professional', color: '#c9a84c',
    gradient: 'linear-gradient(135deg,#0c1b33,#c9a84c)',
    description: 'Serif typography with gold accents. Premium feel for senior roles.',
    badge: 'Premium',
    badgeColor: '#c9a84c',
  },
  {
    id: 'minimal',    name: 'Minimal',    category: 'Simple',       color: '#374151',
    gradient: 'linear-gradient(135deg,#374151,#9ca3af)',
    description: 'Timeless single-column. Maximum whitespace, ATS-perfect.',
    badge: 'ATS #1',
    badgeColor: '#374151',
  },
  {
    id: 'corporate',  name: 'Corporate',  category: 'Traditional',  color: '#1e3a5f',
    gradient: 'linear-gradient(135deg,#1e3a5f,#2d6a9f)',
    description: 'Dark header, left border accents. Trusted for corporate applications.',
    badge: null,
    badgeColor: null,
  },
  {
    id: 'two-column', name: 'Two Column', category: 'Structured',   color: '#374151',
    gradient: 'linear-gradient(135deg,#374151,#6b7280)',
    description: 'Balanced dual columns with contact sidebar and maximum content density.',
    badge: null,
    badgeColor: null,
  },
  {
    id: 'emerald',    name: 'Emerald',    category: 'Creative',     color: '#047857',
    gradient: 'linear-gradient(135deg,#065f46,#047857,#059669)',
    description: 'Canva-style wide teal sidebar with large avatar circle and pill skill tags.',
    badge: 'Canva-Style',
    badgeColor: '#047857',
  },
  {
    id: 'coral',      name: 'Coral',      category: 'Creative',     color: '#ea580c',
    gradient: 'linear-gradient(135deg,#c2410c,#ea580c,#f97316)',
    description: 'Warm coral-orange header with avatar initials and vibrant two-zone layout.',
    badge: 'Warm & Bold',
    badgeColor: '#ea580c',
  },
  {
    id: 'noir',       name: 'Noir',       category: 'Professional', color: '#1e293b',
    gradient: 'linear-gradient(135deg,#0f172a,#e11d48)',
    description: 'Dark slate header with rose accent — elegant, dramatic, unforgettable.',
    badge: 'Dark Mode',
    badgeColor: '#e11d48',
  },
  {
    id: 'prisma',     name: 'Prisma',     category: 'Creative',     color: '#7c3aed',
    gradient: 'linear-gradient(160deg,#5b21b6,#7c3aed,#8b5cf6)',
    description: 'Bold violet left panel with stacked contact, skills, and clean white content.',
    badge: 'New',
    badgeColor: '#7c3aed',
  },
  {
    id: 'classic',    name: 'Classic',    category: 'Professional', color: '#374151',
    gradient: 'linear-gradient(135deg,#374151,#6b7280)',
    description: 'Photo top-left, date-column layout with serif typography. Timeless and clean.',
    badge: '📷 Photo',
    badgeColor: '#374151',
  },
  {
    id: 'sage',       name: 'Sage',       category: 'Creative',     color: '#4a5c4d',
    gradient: 'linear-gradient(135deg,#4a5c4d,#6b7c6e)',
    description: 'Olive-sage sidebar with full photo, large display name, and footer contact bar.',
    badge: '📷 Photo',
    badgeColor: '#4a5c4d',
  },
  {
    id: 'chronicle',  name: 'Chronicle',  category: 'Professional', color: '#1e2a45',
    gradient: 'linear-gradient(135deg,#121c30,#1e2a45)',
    description: 'Dark navy header with circular photo, gray sidebar, timeline dot experience.',
    badge: '📷 Photo',
    badgeColor: '#1e2a45',
  },
  {
    id: 'slate',      name: 'Slate',      category: 'Simple',       color: '#374151',
    gradient: 'linear-gradient(135deg,#374151,#9ca3af)',
    description: 'Gray rounded section bands, 3-column skills grid, clean infographic ATS style.',
    badge: 'ATS Ready',
    badgeColor: '#374151',
  },
];

const CATS = ['All', 'Professional', 'Creative', 'Technical', 'Simple', 'Traditional', 'Structured'];

function TemplateCard({ tmpl, onSelect }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: '-40px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '18px', overflow: 'hidden',
        border: `1.5px solid ${hovered ? tmpl.color + '80' : 'var(--border)'}`,
        background: 'var(--white)',
        boxShadow: hovered ? `0 16px 44px ${tmpl.color}22` : 'var(--shadow-sm)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Preview panel */}
      <div style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
        <LiveMiniPreview tmpl={tmpl} />

        {/* Badge */}
        {tmpl.badge && (
          <div style={{
            position: 'absolute', top: '10px', left: '10px',
            padding: '2px 9px',
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(6px)',
            borderRadius: '100px',
            fontSize: '0.65rem', fontWeight: 700,
            color: '#fff', letterSpacing: '0.3px',
          }}>
            {tmpl.badge}
          </div>
        )}

        {/* Hover overlay with "Use Template" */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(2px)',
          }}
        >
          <button
            onClick={() => onSelect(tmpl.id)}
            style={{
              padding: '0.5rem 1.25rem',
              background: '#fff',
              color: tmpl.color,
              border: 'none', borderRadius: '100px',
              fontSize: '0.8125rem', fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Use Template
          </button>
        </motion.div>
      </div>

      {/* Card footer */}
      <div style={{ padding: '1rem 1.125rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text)' }}>{tmpl.name}</span>
          <span style={{
            padding: '2px 8px', borderRadius: '100px',
            fontSize: '0.65rem', fontWeight: 600,
            background: `${tmpl.color}14`, color: tmpl.color,
          }}>
            {tmpl.category}
          </span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.55, margin: 0 }}>
          {tmpl.description}
        </p>
        <button
          onClick={() => onSelect(tmpl.id)}
          style={{
            marginTop: '0.5rem',
            width: '100%', padding: '0.5rem',
            background: hovered ? tmpl.color : 'var(--bg)',
            color: hovered ? '#fff' : 'var(--text)',
            border: `1.5px solid ${hovered ? tmpl.color : 'var(--border)'}`,
            borderRadius: '10px',
            fontSize: '0.8125rem', fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Use This Template →
        </button>
      </div>
    </motion.div>
  );
}

export default function TemplatesGrid({ onSelectTemplate }) {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? TEMPLATES : TEMPLATES.filter((t) => t.category === filter);

  return (
    <section id="templates-section" style={{
      padding: 'clamp(3.5rem,8vw,5.5rem) 2rem',
      background: 'var(--white)',
    }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true, margin: '-60px' }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <span style={{
            display: 'inline-block',
            padding: '0.25rem 0.875rem',
            background: 'linear-gradient(135deg, #ede9fe, #fce7f3)',
            borderRadius: '100px',
            fontSize: '0.75rem', fontWeight: 700,
            color: '#7c3aed', letterSpacing: '0.5px',
            textTransform: 'uppercase', marginBottom: '1rem',
          }}>
            17 Templates
          </span>
          <h2 style={{
            fontSize: 'clamp(1.625rem, 4vw, 2.5rem)',
            fontWeight: 900, letterSpacing: '-0.75px',
            color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.15,
          }}>
            Find Your Perfect Template
          </h2>
          <p style={{
            fontSize: '1rem', color: 'var(--text-light)',
            lineHeight: 1.7, maxWidth: '440px', margin: '0 auto',
          }}>
            Every design is fully editable. Pick one, fill in your details, export PDF.
          </p>
        </motion.div>

        {/* Category filter */}
        <div style={{
          display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
          justifyContent: 'center', marginBottom: '2.25rem',
        }}>
          {CATS.filter((c) => c === 'All' || TEMPLATES.some((t) => t.category === c)).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '0.375rem 1rem',
                borderRadius: '100px',
                border: '1.5px solid',
                borderColor: filter === cat ? '#7c3aed' : 'var(--border)',
                background: filter === cat ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                color: filter === cat ? '#fff' : 'var(--text-light)',
                fontSize: '0.8125rem', fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.375rem',
        }}>
          {filtered.map((tmpl) => (
            <TemplateCard key={tmpl.id} tmpl={tmpl} onSelect={onSelectTemplate} />
          ))}
        </div>
      </div>
    </section>
  );
}
