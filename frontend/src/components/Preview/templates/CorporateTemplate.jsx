// Corporate Template — dark header, single-column, traditional professional
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

const DARK_BLUE = '#1e3a5f';
const ACCENT = '#2c5282';

const styles = {
  page: {
    fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
    fontSize: '9.5pt',
    color: '#2d2d2d',
    lineHeight: 1.5,
    background: '#fff',
    minHeight: '100%',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  },
  header: {
    background: DARK_BLUE,
    padding: '28px 36px',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: '24pt',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.5px',
    lineHeight: 1.1,
    marginBottom: '4px',
  },
  jobTitle: {
    fontSize: '11pt',
    color: '#93c5fd',
    fontWeight: 400,
    marginBottom: '0',
  },
  headerRight: {
    textAlign: 'right',
    fontSize: '8.5pt',
    color: '#cbd5e1',
    flexShrink: 0,
  },
  contactLine: {
    marginBottom: '3px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    justifyContent: 'flex-end',
  },
  body: {
    padding: '24px 36px',
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
  sectionTitle: {
    fontSize: '10pt',
    fontWeight: 700,
    color: DARK_BLUE,
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
  },
  sectionLine: {
    flex: 1,
    height: '1.5px',
    background: DARK_BLUE,
    opacity: 0.3,
  },
  experienceItem: {
    marginBottom: '14px',
    paddingLeft: '12px',
    borderLeft: `3px solid ${ACCENT}`,
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '4px',
    marginBottom: '2px',
  },
  title: {
    fontWeight: 700,
    fontSize: '9.5pt',
    color: '#111',
  },
  dateText: {
    fontSize: '8.5pt',
    color: '#6b7280',
    fontStyle: 'italic',
    flexShrink: 0,
  },
  subtitle: {
    fontSize: '9pt',
    color: '#4b5563',
  },
  description: {
    marginTop: '4px',
    fontSize: '9pt',
    color: '#374151',
    whiteSpace: 'pre-line',
    lineHeight: 1.5,
  },
  skillsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px 16px',
  },
  skillGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  skillGroupName: {
    fontWeight: 600,
    fontSize: '8.5pt',
    color: DARK_BLUE,
    borderBottom: `1px solid ${DARK_BLUE}20`,
    paddingBottom: '2px',
    marginBottom: '3px',
  },
  skillList: {
    fontSize: '8.5pt',
    color: '#374151',
  },
  projectItem: {
    marginBottom: '12px',
    paddingLeft: '12px',
    borderLeft: `3px solid #64748b`,
  },
};

export default function CorporateTemplate({ resume }) {
  const sections = resume?.sections || {};
  const info = sections.personalInfo || {};
  const fullName = [info.firstName, info.lastName].filter(Boolean).join(' ') || 'Your Name';
  const mostRecentJob = (sections.experience || [])[0];
  const jobTitle = mostRecentJob?.title || '';

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.name}>{fullName}</div>
          {jobTitle && <div style={styles.jobTitle}>{jobTitle}</div>}
        </div>
        <div style={styles.headerRight}>
          {info.email && (
            <div style={styles.contactLine}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" /></svg>
              {info.email}
            </div>
          )}
          {info.phone && (
            <div style={styles.contactLine}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              {info.phone}
            </div>
          )}
          {info.location && (
            <div style={styles.contactLine}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
              {info.location}
            </div>
          )}
          {info.linkedin && (
            <div style={styles.contactLine}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              {info.linkedin}
            </div>
          )}
          {info.github && (
            <div style={styles.contactLine}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
              {info.github}
            </div>
          )}
          {info.website && (
            <div style={styles.contactLine}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              {info.website}
            </div>
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
              <div style={styles.sectionTitle}>Professional Summary</div>
              <div style={styles.sectionLine} />
            </div>
            <p style={{ fontSize: '9.5pt', color: '#374151', lineHeight: 1.6 }}>{sections.summary}</p>
          </div>
          </SectionWrapper>
        )}

        {/* Experience */}
        {(sections.experience || []).length > 0 && (
          <SectionWrapper sectionKey="experience">
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitle}>Professional Experience</div>
              <div style={styles.sectionLine} />
            </div>
            {sections.experience.map((exp, i) => (
              <div key={exp.id || i} style={styles.experienceItem}>
                <div style={styles.itemHeader}>
                  <div>
                    <div style={styles.title}>{exp.title}</div>
                    <div style={styles.subtitle}>
                      {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                    </div>
                  </div>
                  <div style={styles.dateText}>
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

        {/* Education */}
        {(sections.education || []).length > 0 && (
          <SectionWrapper sectionKey="education">
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitle}>Education</div>
              <div style={styles.sectionLine} />
            </div>
            {sections.education.map((edu, i) => (
              <div key={edu.id || i} style={{ ...styles.experienceItem, borderLeftColor: '#475569' }}>
                <div style={styles.itemHeader}>
                  <div>
                    <div style={styles.title}>
                      {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
                    </div>
                    <div style={styles.subtitle}>
                      {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                    </div>
                  </div>
                  <div style={styles.dateText}>
                    <DateRange start={edu.startDate} end={edu.endDate} />
                  </div>
                </div>
                {edu.gpa && (
                  <div style={{ fontSize: '8.5pt', color: '#555', marginTop: '2px' }}>GPA: {edu.gpa}</div>
                )}
                {edu.description && (
                  <div style={{ fontSize: '9pt', color: '#555', marginTop: '3px' }}>{edu.description}</div>
                )}
              </div>
            ))}
          </div>
          </SectionWrapper>
        )}

        {/* Skills */}
        {(sections.skills || []).length > 0 && (
          <SectionWrapper sectionKey="skills">
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitle}>Skills &amp; Expertise</div>
              <div style={styles.sectionLine} />
            </div>
            <div style={styles.skillsGrid}>
              {sections.skills.map((group, i) => (
                <div key={group.id || i} style={styles.skillGroup}>
                  {group.category && (
                    <div style={styles.skillGroupName}>{group.category}</div>
                  )}
                  <div style={styles.skillList}>{(group.items || []).join(' · ')}</div>
                </div>
              ))}
            </div>
          </div>
          </SectionWrapper>
        )}

        {/* Projects */}
        {(sections.projects || []).length > 0 && (
          <SectionWrapper sectionKey="projects">
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitle}>Key Projects</div>
              <div style={styles.sectionLine} />
            </div>
            {sections.projects.map((proj, i) => (
              <div key={proj.id || i} style={styles.projectItem}>
                <div style={styles.itemHeader}>
                  <div>
                    <div style={styles.title}>{proj.name}</div>
                    {(proj.technologies || []).length > 0 && (
                      <div style={styles.subtitle}>{proj.technologies.join(', ')}</div>
                    )}
                  </div>
                  <div style={styles.dateText}>
                    <DateRange start={proj.startDate} end={proj.endDate} />
                  </div>
                </div>
                {proj.description && (
                  <div style={styles.description}>{proj.description}</div>
                )}
                {proj.url && (
                  <div style={{ fontSize: '8pt', color: DARK_BLUE, marginTop: '2px' }}>{proj.url}</div>
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
