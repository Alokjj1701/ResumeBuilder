import { useRef, useCallback } from 'react';
import { useResume } from '../../hooks/useResume';
import { PreviewContext } from '../../context/PreviewContext';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import CorporateTemplate from './templates/CorporateTemplate';
import TwoColumnTemplate from './templates/TwoColumnTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import TechTemplate from './templates/TechTemplate';
import GradientTemplate from './templates/GradientTemplate';
import SidebarTemplate from './templates/SidebarTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import EmeraldTemplate from './templates/EmeraldTemplate';
import CoralTemplate from './templates/CoralTemplate';
import NoirTemplate from './templates/NoirTemplate';
import PrismaTemplate from './templates/PrismaTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import SageTemplate from './templates/SageTemplate';
import ChronicleTemplate from './templates/ChronicleTemplate';
import SlateTemplate from './templates/SlateTemplate';

const TEMPLATE_MAP = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  corporate: CorporateTemplate,
  'two-column': TwoColumnTemplate,
  creative: CreativeTemplate,
  tech: TechTemplate,
  gradient: GradientTemplate,
  sidebar: SidebarTemplate,
  executive: ExecutiveTemplate,
  emerald: EmeraldTemplate,
  coral: CoralTemplate,
  noir: NoirTemplate,
  prisma: PrismaTemplate,
  classic: ClassicTemplate,
  sage: SageTemplate,
  chronicle: ChronicleTemplate,
  slate: SlateTemplate,
};

// A4 dimensions in pixels at 96 dpi
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

export default function ResumePreview() {
  const { state, deleteSection } = useResume();
  const containerRef = useRef(null);
  const resume = state.currentResume;

  const handleDeleteSection = useCallback((key) => {
    deleteSection(key);
  }, [deleteSection]);

  if (!resume) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'var(--text-light)',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--border-dark)' }}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <p>No resume to preview</p>
      </div>
    );
  }

  const templateId = resume.templateId || 'modern';
  const TemplateComponent = TEMPLATE_MAP[templateId] || ModernTemplate;

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem',
        fontSize: '0.8125rem',
        color: 'var(--text-light)',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        Live Preview — {templateId.charAt(0).toUpperCase() + templateId.slice(1)} Template
      </div>

      {/* A4 paper with shadow */}
      <div
        id="resume-preview-page"
        style={{
          width: `${A4_WIDTH_PX}px`,
          minHeight: `${A4_HEIGHT_PX}px`,
          background: '#ffffff',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
          borderRadius: '2px',
          overflow: 'visible',
          transformOrigin: 'top center',
        }}
      >
        <PreviewContext.Provider value={{ isEditMode: true, onDeleteSection: handleDeleteSection }}>
          <TemplateComponent resume={resume} />
        </PreviewContext.Provider>
      </div>

      {/* Bottom hint */}
      <p style={{
        marginTop: '1rem',
        fontSize: '0.75rem',
        color: 'var(--text-lighter)',
        textAlign: 'center',
      }}>
        A4 format · 210 × 297 mm
      </p>
    </div>
  );
}
