import { useState, useCallback } from 'react';
import { useResume } from '../../hooks/useResume';
import { DUMMY_RESUME } from '../../data/dummyResume';
import PersonalInfoForm from './PersonalInfoForm';
import SummaryForm from './SummaryForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import ProjectsForm from './ProjectsForm';

const SECTIONS = [
  {
    id: 'personalInfo',
    label: 'Personal',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: 'summary',
    label: 'Summary',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    id: 'experience',
    label: 'Experience',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    id: 'education',
    label: 'Education',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
];

export default function ResumeEditor() {
  const { state, updateSections, restoreSection } = useResume();
  const [activeSection, setActiveSection] = useState('personalInfo');

  const sections = state.currentResume?.sections || {};

  const handleSectionUpdate = useCallback((key, value) => {
    updateSections({ ...sections, [key]: value });
  }, [sections, updateSections]);

  // A section is "deleted" when its value is explicitly null (not just empty)
  const isDeleted = useCallback((key) => sections[key] === null, [sections]);

  // Restore to empty state
  const handleRestore = useCallback((key) => {
    restoreSection(key);
  }, [restoreSection]);

  // Restore + prefill with dummy data
  const handleFillSample = useCallback((key) => {
    const sample = DUMMY_RESUME[key];
    if (sample !== undefined) {
      updateSections({ ...sections, [key]: sample });
    }
  }, [sections, updateSections]);

  const getCompletionCount = (sectionId) => {
    const s = sections;
    switch (sectionId) {
      case 'personalInfo': {
        const info = s.personalInfo || {};
        return Object.values(info).filter(Boolean).length;
      }
      case 'summary':
        return s.summary ? 1 : 0;
      case 'experience':
        return (s.experience || []).length;
      case 'education':
        return (s.education || []).length;
      case 'skills':
        return (s.skills || []).length;
      case 'projects':
        return (s.projects || []).length;
      default:
        return 0;
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Section nav tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        overflowX: 'auto',
        flexShrink: 0,
        background: 'var(--bg)',
      }}>
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          const count = getCompletionCount(section.id);
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                padding: '0.5rem 0.625rem',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
                cursor: 'pointer',
                color: isActive ? 'var(--primary)' : 'var(--text-light)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.8rem',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition)',
                flexShrink: 0,
                flex: 1,
                minWidth: 0,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--text)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--text-light)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {section.icon}
                {count > 0 && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '16px',
                    height: '16px',
                    background: isActive ? 'var(--primary)' : 'var(--border-dark)',
                    color: isActive ? 'white' : 'var(--text-light)',
                    borderRadius: '50%',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                  }}>
                    {count}
                  </span>
                )}
              </div>
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
        {activeSection === 'personalInfo' && (
          <div className="animate-slide-in">
            <SectionHeader title="Personal Info" description="Your contact details and professional links" />
            <PersonalInfoForm
              data={sections.personalInfo || {}}
              onChange={(data) => handleSectionUpdate('personalInfo', data)}
            />
          </div>
        )}

        {activeSection === 'summary' && (
          <div className="animate-slide-in">
            <SectionHeader title="Professional Summary" description="A brief overview of your background and goals" />
            {isDeleted('summary') ? (
              <DeletedNotice sectionKey="summary" onRestore={handleRestore} onFillSample={handleFillSample} />
            ) : (
              <SummaryForm
                value={sections.summary || ''}
                onChange={(value) => handleSectionUpdate('summary', value)}
              />
            )}
          </div>
        )}

        {activeSection === 'experience' && (
          <div className="animate-slide-in">
            <SectionHeader title="Work Experience" description="Your professional work history" />
            {isDeleted('experience') ? (
              <DeletedNotice sectionKey="experience" onRestore={handleRestore} onFillSample={handleFillSample} />
            ) : (
              <ExperienceForm
                items={sections.experience || []}
                onChange={(items) => handleSectionUpdate('experience', items)}
              />
            )}
          </div>
        )}

        {activeSection === 'education' && (
          <div className="animate-slide-in">
            <SectionHeader title="Education" description="Your academic background and degrees" />
            {isDeleted('education') ? (
              <DeletedNotice sectionKey="education" onRestore={handleRestore} onFillSample={handleFillSample} />
            ) : (
              <EducationForm
                items={sections.education || []}
                onChange={(items) => handleSectionUpdate('education', items)}
              />
            )}
          </div>
        )}

        {activeSection === 'skills' && (
          <div className="animate-slide-in">
            <SectionHeader title="Skills" description="Technical and professional skills by category" />
            {isDeleted('skills') ? (
              <DeletedNotice sectionKey="skills" onRestore={handleRestore} onFillSample={handleFillSample} />
            ) : (
              <SkillsForm
                items={sections.skills || []}
                onChange={(items) => handleSectionUpdate('skills', items)}
              />
            )}
          </div>
        )}

        {activeSection === 'projects' && (
          <div className="animate-slide-in">
            <SectionHeader title="Projects" description="Personal and professional projects" />
            {isDeleted('projects') ? (
              <DeletedNotice sectionKey="projects" onRestore={handleRestore} onFillSample={handleFillSample} />
            ) : (
              <ProjectsForm
                items={sections.projects || []}
                onChange={(items) => handleSectionUpdate('projects', items)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>{description}</p>
    </div>
  );
}

function DeletedNotice({ sectionKey, onRestore, onFillSample }) {
  const label = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
  return (
    <div style={{
      borderRadius: '12px',
      border: '1.5px dashed var(--border-dark)',
      padding: '1.5rem 1.25rem',
      textAlign: 'center',
      background: 'var(--bg)',
    }}>
      {/* Icon */}
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        background: '#fef2f2', border: '1.5px solid #fecaca',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 0.75rem',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      </div>
      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>
        {label} section is hidden
      </p>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
        This section was removed from your resume. Restore it to edit.
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => onRestore(sectionKey)}
          style={{
            padding: '0.4375rem 1rem',
            borderRadius: '8px',
            border: '1.5px solid var(--primary)',
            background: 'var(--primary)',
            color: '#fff',
            fontSize: '0.8125rem', fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ↩ Restore Section
        </button>
        <button
          onClick={() => onFillSample(sectionKey)}
          style={{
            padding: '0.4375rem 1rem',
            borderRadius: '8px',
            border: '1.5px solid var(--border-dark)',
            background: 'var(--bg-card)',
            color: 'var(--text)',
            fontSize: '0.8125rem', fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ✦ Fill with Sample Data
        </button>
      </div>
    </div>
  );
}
