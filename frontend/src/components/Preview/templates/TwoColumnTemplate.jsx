// Two-Column Template — left sidebar with contact/skills/education, right with content
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
  return <span>{[s, e].filter(Boolean).join(' – ')}</span>;
}

const SIDEBAR_BG = '#f1f5f9';
const ACCENT = '#334155';
const TEXT = '#1e293b';

const styles = {
  page: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    fontSize: '9.5pt',
    color: TEXT,
    lineHeight: 1.5,
    background: '#fff',
    display: 'flex',
    minHeight: '100%',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  },
  sidebar: {
    width: '38%',
    background: SIDEBAR_BG,
    padding: '32px 20px',
    flexShrink: 0,
    borderRight: '1px solid #e2e8f0',
  },
  mainContent: {
    flex: 1,
    padding: '32px 28px',
    minWidth: 0,
  },
  // Sidebar styles
  photoPlaceholder: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: ACCENT,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    color: '#fff',
    fontSize: '24pt',
    fontWeight: 700,
    flexShrink: 0,
  },
  sideSection: {
    marginBottom: '18px',
  },
  sideSectionTitle: {
    fontSize: '8pt',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: ACCENT,
    borderBottom: `1.5px solid ${ACCENT}`,
    paddingBottom: '3px',
    marginBottom: '8px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
    fontSize: '8.5pt',
    color: '#334155',
    marginBottom: '5px',
    wordBreak: 'break-all',
  },
  contactIcon: {
    flexShrink: 0,
    marginTop: '1px',
    color: ACCENT,
  },
  skillGroup: {
    marginBottom: '7px',
  },
  skillGroupName: {
    fontSize: '8pt',
    fontWeight: 600,
    color: ACCENT,
    marginBottom: '3px',
  },
  skillItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '8.5pt',
    color: '#475569',
    marginBottom: '3px',
  },
  eduItem: {
    marginBottom: '10px',
  },
  eduDegree: {
    fontWeight: 600,
    fontSize: '8.5pt',
    color: TEXT,
    lineHeight: 1.3,
  },
  eduInstitution: {
    fontSize: '8pt',
    color: '#64748b',
  },
  eduDate: {
    fontSize: '7.5pt',
    color: '#94a3b8',
  },
  // Main content styles
  nameBlock: {
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: `2px solid ${ACCENT}`,
  },
  name: {
    fontSize: '22pt',
    fontWeight: 700,
    color: '#0f172a',
    lineHeight: 1.1,
    marginBottom: '4px',
  },
  headline: {
    fontSize: '10pt',
    color: '#64748b',
    fontWeight: 400,
  },
  mainSection: {
    marginBottom: '16px',
  },
  mainSectionTitle: {
    fontSize: '9pt',
    fontWeight: 700,
    color: ACCENT,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  expItem: {
    marginBottom: '12px',
  },
  expHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '4px',
  },
  expTitle: {
    fontWeight: 600,
    fontSize: '9.5pt',
    color: '#0f172a',
  },
  expCompany: {
    fontSize: '9pt',
    color: '#475569',
  },
  expDate: {
    fontSize: '8pt',
    color: '#94a3b8',
    fontStyle: 'italic',
    flexShrink: 0,
  },
  description: {
    fontSize: '8.5pt',
    color: '#475569',
    marginTop: '4px',
    whiteSpace: 'pre-line',
    lineHeight: 1.5,
  },
  projItem: {
    marginBottom: '10px',
  },
  projName: {
    fontWeight: 600,
    fontSize: '9pt',
    color: '#0f172a',
  },
  techTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '3px',
    marginTop: '3px',
  },
  techTag: {
    padding: '1px 6px',
    background: '#e2e8f0',
    color: '#475569',
    borderRadius: '8px',
    fontSize: '7.5pt',
    fontWeight: 500,
  },
};

export default function TwoColumnTemplate({ resume }) {
  const sections = resume?.sections || {};
  const info = sections.personalInfo || {};
  const fullName = [info.firstName, info.lastName].filter(Boolean).join(' ') || 'Your Name';
  const initials = [info.firstName?.[0], info.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?';
  const mostRecentJob = (sections.experience || [])[0];
  const headline = mostRecentJob?.title || '';

  return (
    <div style={styles.page}>
      {/* Left Sidebar */}
      <div style={styles.sidebar}>
        {/* Photo placeholder */}
        <div style={styles.photoPlaceholder}>{initials}</div>

        {/* Contact info */}
        <div style={styles.sideSection}>
          <div style={styles.sideSectionTitle}>Contact</div>
          {info.email && (
            <div style={styles.contactItem}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" style={styles.contactIcon}><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" /></svg>
              {info.email}
            </div>
          )}
          {info.phone && (
            <div style={styles.contactItem}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" style={styles.contactIcon}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              {info.phone}
            </div>
          )}
          {info.location && (
            <div style={styles.contactItem}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" style={styles.contactIcon}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
              {info.location}
            </div>
          )}
          {info.linkedin && (
            <div style={styles.contactItem}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" style={styles.contactIcon}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              {info.linkedin}
            </div>
          )}
          {info.github && (
            <div style={styles.contactItem}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" style={styles.contactIcon}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
              {info.github}
            </div>
          )}
          {info.website && (
            <div style={styles.contactItem}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" style={styles.contactIcon}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              {info.website}
            </div>
          )}
        </div>

        {/* Skills */}
        {(sections.skills || []).length > 0 && (
          <SectionWrapper sectionKey="skills">
          <div style={styles.sideSection}>
            <div style={styles.sideSectionTitle}>Skills</div>
            {sections.skills.map((group, i) => (
              <div key={group.id || i} style={styles.skillGroup}>
                {group.category && (
                  <div style={styles.skillGroupName}>{group.category}</div>
                )}
                <div style={{ fontSize: '8.5pt', color: '#475569', lineHeight: 1.6 }}>
                  {(group.items || []).join(' · ')}
                </div>
              </div>
            ))}
          </div>
          </SectionWrapper>
        )}

        {/* Education */}
        {(sections.education || []).length > 0 && (
          <SectionWrapper sectionKey="education">
          <div style={styles.sideSection}>
            <div style={styles.sideSectionTitle}>Education</div>
            {sections.education.map((edu, i) => (
              <div key={edu.id || i} style={styles.eduItem}>
                <div style={styles.eduDegree}>
                  {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
                </div>
                <div style={styles.eduInstitution}>{edu.institution}</div>
                {edu.location && <div style={styles.eduDate}>{edu.location}</div>}
                <div style={styles.eduDate}>
                  <DateRange start={edu.startDate} end={edu.endDate} />
                </div>
                {edu.gpa && <div style={styles.eduDate}>GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
          </SectionWrapper>
        )}
      </div>

      {/* Right Main Content */}
      <div style={styles.mainContent}>
        {/* Name and headline */}
        <div style={styles.nameBlock}>
          <div style={styles.name}>{fullName}</div>
          {headline && <div style={styles.headline}>{headline}</div>}
        </div>

        {/* Summary */}
        {sections.summary && (
          <SectionWrapper sectionKey="summary">
          <div style={styles.mainSection}>
            <div style={styles.mainSectionTitle}>About Me</div>
            <p style={{ fontSize: '9pt', color: '#475569', lineHeight: 1.6 }}>{sections.summary}</p>
          </div>
          </SectionWrapper>
        )}

        {/* Experience */}
        {(sections.experience || []).length > 0 && (
          <SectionWrapper sectionKey="experience">
          <div style={styles.mainSection}>
            <div style={styles.mainSectionTitle}>Experience</div>
            {sections.experience.map((exp, i) => (
              <div key={exp.id || i} style={styles.expItem}>
                <div style={styles.expHeader}>
                  <div>
                    <div style={styles.expTitle}>{exp.title}</div>
                    <div style={styles.expCompany}>
                      {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                    </div>
                  </div>
                  <div style={styles.expDate}>
                    <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
                  </div>
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
          <div style={styles.mainSection}>
            <div style={styles.mainSectionTitle}>Projects</div>
            {sections.projects.map((proj, i) => (
              <div key={proj.id || i} style={styles.projItem}>
                <div style={styles.expHeader}>
                  <div>
                    <span style={styles.projName}>{proj.name}</span>
                    {proj.url && (
                      <span style={{ fontSize: '8pt', color: '#64748b', marginLeft: '8px' }}>{proj.url}</span>
                    )}
                  </div>
                  <div style={styles.expDate}>
                    <DateRange start={proj.startDate} end={proj.endDate} />
                  </div>
                </div>
                {proj.description && (
                  <div style={styles.description}>{proj.description}</div>
                )}
                {(proj.technologies || []).length > 0 && (
                  <div style={styles.techTags}>
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
    </div>
  );
}
