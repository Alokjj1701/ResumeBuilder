// Modern Template — two-column, blue accent, clean typography
import SectionWrapper from '../SectionWrapper';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const [year, month] = dateStr.split('-');
    const d = new Date(parseInt(year), parseInt(month) - 1, 1);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  } catch {
    return dateStr;
  }
}

function DateRange({ start, end, current }) {
  if (!start && !end) return null;
  const s = formatDate(start);
  const e = current ? 'Present' : formatDate(end);
  return <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>{[s, e].filter(Boolean).join(' – ')}</span>;
}

const styles = {
  page: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '9.5pt',
    color: '#1f2937',
    lineHeight: 1.45,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    background: '#fff',
    // Inherited by all children — prevents any text from blowing out columns
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  },
  header: {
    padding: '28px 32px 20px',
    background: '#fff',
    borderBottom: '3px solid #2563eb',
  },
  name: {
    fontSize: '26pt',
    fontWeight: 700,
    color: '#111827',
    letterSpacing: '-0.5px',
    lineHeight: 1.1,
    marginBottom: '4px',
  },
  headline: {
    fontSize: '11pt',
    color: '#2563eb',
    fontWeight: 500,
    marginBottom: '10px',
  },
  contactRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px 14px',
    fontSize: '8.5pt',
    color: '#4b5563',
    rowGap: '4px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  body: {
    display: 'flex',
    flex: 1,
    gap: 0,
  },
  mainCol: {
    flex: '0 0 62%',
    padding: '20px 24px 24px 32px',
    minWidth: 0,
  },
  sideCol: {
    flex: '0 0 38%',
    padding: '20px 28px 24px 16px',
    background: '#f8fafc',
    borderLeft: '1px solid #e5e7eb',
    minWidth: 0,
  },
  section: {
    marginBottom: '18px',
  },
  sectionTitle: {
    fontSize: '9pt',
    fontWeight: 700,
    color: '#2563eb',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderBottom: '1px solid #bfdbfe',
    paddingBottom: '3px',
    marginBottom: '10px',
  },
  experienceItem: {
    marginBottom: '12px',
  },
  jobTitle: {
    fontWeight: 600,
    fontSize: '9.5pt',
    color: '#111827',
  },
  company: {
    fontSize: '9pt',
    color: '#374151',
  },
  description: {
    marginTop: '4px',
    fontSize: '8.5pt',
    color: '#4b5563',
    whiteSpace: 'pre-line',
    lineHeight: 1.5,
  },
  skillCategory: {
    marginBottom: '8px',
  },
  skillCategoryName: {
    fontWeight: 600,
    fontSize: '8.5pt',
    color: '#374151',
    marginBottom: '3px',
  },
  skillTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
  },
  skillTag: {
    padding: '2px 7px',
    background: '#dbeafe',
    color: '#1d4ed8',
    borderRadius: '12px',
    fontSize: '7.5pt',
    fontWeight: 500,
  },
  educationItem: {
    marginBottom: '10px',
  },
  degreeTitle: {
    fontWeight: 600,
    fontSize: '8.5pt',
    color: '#111827',
  },
  institution: {
    fontSize: '8pt',
    color: '#6b7280',
  },
  projectItem: {
    marginBottom: '10px',
  },
  projectName: {
    fontWeight: 600,
    fontSize: '9pt',
    color: '#111827',
  },
  projectMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginTop: '3px',
  },
  techTag: {
    padding: '1px 6px',
    background: '#f0fdf4',
    color: '#166534',
    borderRadius: '10px',
    fontSize: '7pt',
    border: '1px solid #bbf7d0',
  },
};

export default function ModernTemplate({ resume }) {
  const sections = resume?.sections || {};
  const info = sections.personalInfo || {};
  const fullName = [info.firstName, info.lastName].filter(Boolean).join(' ') || 'Your Name';
  const mostRecentJob = (sections.experience || [])[0];
  const headline = mostRecentJob ? `${mostRecentJob.title || ''}${mostRecentJob.company ? ` at ${mostRecentJob.company}` : ''}` : '';

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.name}>{fullName}</div>
        {headline && <div style={styles.headline}>{headline}</div>}
        <div style={styles.contactRow}>
          {info.email && (
            <span style={styles.contactItem}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" /></svg>
              {info.email}
            </span>
          )}
          {info.phone && (
            <span style={styles.contactItem}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              {info.phone}
            </span>
          )}
          {info.location && (
            <span style={styles.contactItem}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
              {info.location}
            </span>
          )}
          {info.linkedin && (
            <span style={styles.contactItem}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              {info.linkedin}
            </span>
          )}
          {info.github && (
            <span style={styles.contactItem}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
              {info.github}
            </span>
          )}
          {info.website && (
            <span style={styles.contactItem}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              {info.website}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        {/* Main column */}
        <div style={styles.mainCol}>
          {/* Summary */}
          {sections.summary && (
            <SectionWrapper sectionKey="summary">
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Summary</div>
              <p style={{ fontSize: '8.5pt', color: '#4b5563', lineHeight: 1.6 }}>{sections.summary}</p>
            </div>
            </SectionWrapper>
          )}

          {/* Experience */}
          {(sections.experience || []).length > 0 && (
            <SectionWrapper sectionKey="experience">
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Experience</div>
              {sections.experience.map((exp, i) => (
                <div key={exp.id || i} style={styles.experienceItem}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                    <div>
                      <div style={styles.jobTitle}>{exp.title}</div>
                      <div style={styles.company}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                    </div>
                    <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
                  </div>
                  {exp.description && (
                    <div style={styles.description}>{exp.description}</div>
                  )}
                </div>
              ))}
            </div>
            </SectionWrapper>
          )}

          {/* Projects */}
          {(sections.projects || []).length > 0 && (
            <SectionWrapper sectionKey="projects">
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Projects</div>
              {sections.projects.map((proj, i) => (
                <div key={proj.id || i} style={styles.projectItem}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={styles.projectName}>{proj.name}</span>
                      {proj.url && (
                        <span style={{ fontSize: '7.5pt', color: '#2563eb' }}>{proj.url}</span>
                      )}
                    </div>
                    <DateRange start={proj.startDate} end={proj.endDate} />
                  </div>
                  {proj.description && (
                    <p style={{ fontSize: '8.5pt', color: '#4b5563', marginTop: '3px', lineHeight: 1.5 }}>
                      {proj.description}
                    </p>
                  )}
                  {(proj.technologies || []).length > 0 && (
                    <div style={styles.projectMeta}>
                      {proj.technologies.map((tech, ti) => (
                        <span key={ti} style={styles.techTag}>{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            </SectionWrapper>
          )}
        </div>

        {/* Sidebar */}
        <div style={styles.sideCol}>
          {/* Skills */}
          {(sections.skills || []).length > 0 && (
            <SectionWrapper sectionKey="skills">
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Skills</div>
              {sections.skills.map((group, i) => (
                <div key={group.id || i} style={styles.skillCategory}>
                  {group.category && (
                    <div style={styles.skillCategoryName}>{group.category}</div>
                  )}
                  <div style={styles.skillTags}>
                    {(group.items || []).map((skill, si) => (
                      <span key={si} style={styles.skillTag}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            </SectionWrapper>
          )}

          {/* Education */}
          {(sections.education || []).length > 0 && (
            <SectionWrapper sectionKey="education">
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Education</div>
              {sections.education.map((edu, i) => (
                <div key={edu.id || i} style={styles.educationItem}>
                  <div style={styles.degreeTitle}>
                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
                  </div>
                  <div style={styles.institution}>{edu.institution}</div>
                  {edu.location && (
                    <div style={{ fontSize: '8pt', color: '#9ca3af' }}>{edu.location}</div>
                  )}
                  <DateRange start={edu.startDate} end={edu.endDate} />
                  {edu.gpa && (
                    <div style={{ fontSize: '8pt', color: '#6b7280', marginTop: '2px' }}>GPA: {edu.gpa}</div>
                  )}
                  {edu.description && (
                    <div style={{ fontSize: '7.5pt', color: '#6b7280', marginTop: '3px' }}>{edu.description}</div>
                  )}
                </div>
              ))}
            </div>
            </SectionWrapper>
          )}

          {/* Links */}
          {(info.website || info.github || info.linkedin) && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Links</div>
              {info.github && (
                <div style={{ fontSize: '8pt', marginBottom: '6px', display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                  <span style={{ color: '#2563eb', wordBreak: 'break-all' }}>{info.github}</span>
                </div>
              )}
              {info.linkedin && (
                <div style={{ fontSize: '8pt', marginBottom: '6px', display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                  <span style={{ color: '#2563eb', wordBreak: 'break-all' }}>{info.linkedin}</span>
                </div>
              )}
              {info.website && (
                <div style={{ fontSize: '8pt', marginBottom: '6px', display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                  <span style={{ color: '#2563eb', wordBreak: 'break-all' }}>{info.website}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
