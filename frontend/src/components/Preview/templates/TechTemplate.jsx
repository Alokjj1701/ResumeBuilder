// Tech Template — clean technical layout for software engineers
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
  return <>{[s, e].filter(Boolean).join(' – ')}</>;
}

const DARK = '#0f172a';
const ACCENT = '#0ea5e9';
const CODE_BG = '#f8fafc';
const BORDER = '#e2e8f0';

const styles = {
  page: {
    fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
    fontSize: '9.5pt',
    color: DARK,
    lineHeight: 1.5,
    background: '#fff',
    minHeight: '100%',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  },
  header: {
    background: DARK,
    padding: '24px 36px',
    borderBottom: `3px solid ${ACCENT}`,
  },
  nameRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '12px',
  },
  name: {
    fontSize: '22pt',
    fontWeight: 700,
    color: '#f1f5f9',
    letterSpacing: '-0.3px',
    lineHeight: 1.0,
    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
  },
  namePrefix: {
    color: ACCENT,
    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
  },
  contactLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  linkBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 10px',
    background: `${ACCENT}20`,
    border: `1px solid ${ACCENT}40`,
    borderRadius: '4px',
    color: ACCENT,
    fontSize: '8pt',
    fontFamily: '"SFMono-Regular", Consolas, monospace',
    fontWeight: 500,
  },
  contactInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    fontSize: '8.5pt',
    color: '#94a3b8',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  body: {
    padding: '20px 36px',
  },
  section: {
    marginBottom: '18px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  sectionHash: {
    color: ACCENT,
    fontFamily: '"SFMono-Regular", Consolas, monospace',
    fontSize: '11pt',
    fontWeight: 700,
    lineHeight: 1,
  },
  sectionTitle: {
    fontSize: '10.5pt',
    fontWeight: 700,
    color: DARK,
    letterSpacing: '0.3px',
  },
  sectionLine: {
    flex: 1,
    height: '1px',
    background: BORDER,
  },
  experienceItem: {
    marginBottom: '14px',
    padding: '10px 12px',
    background: CODE_BG,
    borderRadius: '6px',
    borderLeft: `3px solid ${ACCENT}`,
    border: `1px solid ${BORDER}`,
    borderLeftColor: ACCENT,
  },
  expHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '4px',
    marginBottom: '3px',
  },
  expTitle: {
    fontWeight: 700,
    fontSize: '10pt',
    color: DARK,
    fontFamily: '"SFMono-Regular", Consolas, monospace',
  },
  expCompany: {
    fontSize: '8.5pt',
    color: '#475569',
    marginBottom: '3px',
  },
  expDate: {
    fontSize: '8pt',
    color: ACCENT,
    fontFamily: '"SFMono-Regular", Consolas, monospace',
    flexShrink: 0,
    background: `${ACCENT}10`,
    padding: '1px 6px',
    borderRadius: '3px',
  },
  description: {
    fontSize: '8.5pt',
    color: '#374151',
    marginTop: '4px',
    whiteSpace: 'pre-line',
    lineHeight: 1.5,
  },
  skillsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  skillRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '6px 10px',
    background: CODE_BG,
    borderRadius: '4px',
    border: `1px solid ${BORDER}`,
  },
  skillCategory: {
    fontFamily: '"SFMono-Regular", Consolas, monospace',
    fontSize: '8pt',
    fontWeight: 600,
    color: ACCENT,
    flexShrink: 0,
    minWidth: '90px',
    paddingRight: '8px',
    borderRight: `1px solid ${BORDER}`,
  },
  skillTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
  },
  skillTag: {
    padding: '2px 8px',
    background: '#fff',
    border: `1px solid ${BORDER}`,
    borderRadius: '3px',
    fontSize: '7.5pt',
    color: '#374151',
    fontFamily: '"SFMono-Regular", Consolas, monospace',
  },
  projectItem: {
    marginBottom: '10px',
    padding: '10px 12px',
    background: CODE_BG,
    borderRadius: '6px',
    border: `1px solid ${BORDER}`,
  },
  projHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '4px',
    marginBottom: '4px',
  },
  projName: {
    fontWeight: 700,
    fontSize: '9.5pt',
    color: DARK,
    fontFamily: '"SFMono-Regular", Consolas, monospace',
  },
  projUrl: {
    fontSize: '7.5pt',
    color: ACCENT,
    fontFamily: '"SFMono-Regular", Consolas, monospace',
    background: `${ACCENT}10`,
    padding: '1px 6px',
    borderRadius: '3px',
  },
  projDate: {
    fontSize: '8pt',
    color: '#94a3b8',
    flexShrink: 0,
  },
  techTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginTop: '5px',
  },
  techTag: {
    padding: '2px 7px',
    background: `${ACCENT}15`,
    color: '#0369a1',
    borderRadius: '3px',
    fontSize: '7.5pt',
    fontFamily: '"SFMono-Regular", Consolas, monospace',
    fontWeight: 500,
    border: `1px solid ${ACCENT}30`,
  },
  eduItem: {
    marginBottom: '8px',
    padding: '8px 12px',
    background: CODE_BG,
    borderRadius: '4px',
    border: `1px solid ${BORDER}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '4px',
  },
};

export default function TechTemplate({ resume }) {
  const sections = resume?.sections || {};
  const info = sections.personalInfo || {};
  const fullName = [info.firstName, info.lastName].filter(Boolean).join(' ') || 'Your Name';

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.nameRow}>
          <div>
            <div style={styles.name}>
              <span style={styles.namePrefix}>{'> '}</span>
              {fullName}
            </div>
          </div>
          {/* Tech Links */}
          <div>
            <div style={styles.contactLinks}>
              {info.github && (
                <span style={styles.linkBadge}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                  {info.github}
                </span>
              )}
              {info.linkedin && (
                <span style={styles.linkBadge}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                  {info.linkedin}
                </span>
              )}
              {info.website && (
                <span style={styles.linkBadge}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /></svg>
                  {info.website}
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={styles.contactInfo}>
          {info.email && (
            <span style={styles.contactItem}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" /></svg>
              {info.email}
            </span>
          )}
          {info.phone && (
            <span style={styles.contactItem}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              {info.phone}
            </span>
          )}
          {info.location && (
            <span style={styles.contactItem}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
              {info.location}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        {/* Summary */}
        {sections.summary && (
          <SectionWrapper sectionKey="summary">
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionHash}>#</span>
              <span style={styles.sectionTitle}>Summary</span>
              <div style={styles.sectionLine} />
            </div>
            <p style={{ fontSize: '9.5pt', color: '#374151', lineHeight: 1.6 }}>{sections.summary}</p>
          </div>
          </SectionWrapper>
        )}

        {/* Skills — most important for tech */}
        {(sections.skills || []).length > 0 && (
          <SectionWrapper sectionKey="skills">
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionHash}>#</span>
              <span style={styles.sectionTitle}>Tech Stack</span>
              <div style={styles.sectionLine} />
            </div>
            <div style={styles.skillsSection}>
              {sections.skills.map((group, i) => (
                <div key={group.id || i} style={styles.skillRow}>
                  {group.category && (
                    <div style={styles.skillCategory}>{group.category}</div>
                  )}
                  <div style={styles.skillTags}>
                    {(group.items || []).map((skill, si) => (
                      <span key={si} style={styles.skillTag}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          </SectionWrapper>
        )}

        {/* Projects — prominent for tech engineers */}
        {(sections.projects || []).length > 0 && (
          <SectionWrapper sectionKey="projects">
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionHash}>#</span>
              <span style={styles.sectionTitle}>Projects</span>
              <div style={styles.sectionLine} />
            </div>
            {sections.projects.map((proj, i) => (
              <div key={proj.id || i} style={styles.projectItem}>
                <div style={styles.projHeader}>
                  <div>
                    <span style={styles.projName}>{proj.name}</span>
                    {proj.url && (
                      <span style={{ ...styles.projUrl, marginLeft: '8px' }}>{proj.url}</span>
                    )}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <span style={styles.projDate}>
                      <DateRange start={proj.startDate} end={proj.endDate} />
                    </span>
                  )}
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

        {/* Experience */}
        {(sections.experience || []).length > 0 && (
          <SectionWrapper sectionKey="experience">
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionHash}>#</span>
              <span style={styles.sectionTitle}>Experience</span>
              <div style={styles.sectionLine} />
            </div>
            {sections.experience.map((exp, i) => (
              <div key={exp.id || i} style={styles.experienceItem}>
                <div style={styles.expHeader}>
                  <div>
                    <div style={styles.expTitle}>{exp.title}</div>
                    <div style={styles.expCompany}>
                      {exp.company}{exp.location ? ` @ ${exp.location}` : ''}
                    </div>
                  </div>
                  {(exp.startDate || exp.endDate) && (
                    <div style={styles.expDate}>
                      <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
                    </div>
                  )}
                </div>
                {exp.description && (
                  <div style={styles.description}>{exp.description}</div>
                )}
              </div>
            ))}
          </div>
          </SectionWrapper>
        )}

        {/* Education */}
        {(sections.education || []).length > 0 && (
          <SectionWrapper sectionKey="education">
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionHash}>#</span>
              <span style={styles.sectionTitle}>Education</span>
              <div style={styles.sectionLine} />
            </div>
            {sections.education.map((edu, i) => (
              <div key={edu.id || i} style={styles.eduItem}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '9.5pt', fontFamily: '"SFMono-Regular", Consolas, monospace' }}>
                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
                  </div>
                  <div style={{ fontSize: '8.5pt', color: '#64748b' }}>
                    {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                  </div>
                  {edu.gpa && (
                    <div style={{ fontSize: '8pt', color: '#94a3b8', fontFamily: '"SFMono-Regular", Consolas, monospace' }}>
                      gpa: {edu.gpa}
                    </div>
                  )}
                </div>
                {(edu.startDate || edu.endDate) && (
                  <div style={{ fontSize: '8pt', color: ACCENT, fontFamily: '"SFMono-Regular", Consolas, monospace', flexShrink: 0 }}>
                    <DateRange start={edu.startDate} end={edu.endDate} />
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
