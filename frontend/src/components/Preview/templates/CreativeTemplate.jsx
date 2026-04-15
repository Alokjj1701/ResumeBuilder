// Creative Template — bold purple header, colorful tags, designed for creatives
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

const PURPLE = '#7c3aed';
const PURPLE_LIGHT = '#8B5CF6';
const PURPLE_VERY_LIGHT = '#f5f3ff';
const PINK = '#ec4899';

const SKILL_COLORS = [
  { bg: '#fef3c7', text: '#92400e' },
  { bg: '#dbeafe', text: '#1e40af' },
  { bg: '#d1fae5', text: '#065f46' },
  { bg: '#fce7f3', text: '#9d174d' },
  { bg: '#ede9fe', text: '#5b21b6' },
  { bg: '#fee2e2', text: '#991b1b' },
  { bg: '#e0f2fe', text: '#075985' },
];

const styles = {
  page: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    fontSize: '9.5pt',
    color: '#1a1a2e',
    lineHeight: 1.5,
    background: '#fff',
    minHeight: '100%',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  },
  header: {
    background: `linear-gradient(135deg, ${PURPLE} 0%, ${PURPLE_LIGHT} 50%, ${PINK} 100%)`,
    padding: '32px 36px 28px',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  headerDecor: {
    position: 'absolute',
    top: '-20px',
    right: '-20px',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.07)',
  },
  headerDecor2: {
    position: 'absolute',
    bottom: '-30px',
    left: '200px',
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
  },
  name: {
    fontSize: '30pt',
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1.0,
    marginBottom: '6px',
    letterSpacing: '-0.5px',
    position: 'relative',
    zIndex: 1,
  },
  headline: {
    fontSize: '11pt',
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 400,
    marginBottom: '14px',
    position: 'relative',
    zIndex: 1,
  },
  headerContacts: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    position: 'relative',
    zIndex: 1,
  },
  headerContact: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '8.5pt',
    color: 'rgba(255,255,255,0.9)',
    background: 'rgba(255,255,255,0.15)',
    padding: '3px 10px',
    borderRadius: '20px',
    backdropFilter: 'blur(4px)',
  },
  body: {
    padding: '24px 36px',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  sectionDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: PURPLE,
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: '10.5pt',
    fontWeight: 700,
    color: PURPLE,
    letterSpacing: '0.5px',
  },
  sectionLine: {
    flex: 1,
    height: '1px',
    background: `linear-gradient(to right, ${PURPLE}40, transparent)`,
  },
  experienceItem: {
    marginBottom: '14px',
    paddingLeft: '14px',
    borderLeft: `2px solid ${PURPLE_LIGHT}`,
    position: 'relative',
  },
  expDot: {
    position: 'absolute',
    left: '-5px',
    top: '4px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: PURPLE_LIGHT,
    border: '2px solid #fff',
  },
  expTitle: {
    fontWeight: 700,
    fontSize: '10pt',
    color: '#1a1a2e',
  },
  expCompany: {
    fontSize: '9pt',
    color: '#6b7280',
  },
  expDate: {
    fontSize: '8pt',
    color: PURPLE,
    fontWeight: 500,
    background: PURPLE_VERY_LIGHT,
    padding: '1px 8px',
    borderRadius: '10px',
    display: 'inline-block',
    marginTop: '2px',
  },
  description: {
    fontSize: '9pt',
    color: '#374151',
    marginTop: '5px',
    whiteSpace: 'pre-line',
    lineHeight: 1.5,
  },
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  skillTag: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '8.5pt',
    fontWeight: 500,
  },
  educationItem: {
    marginBottom: '10px',
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  eduIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: PURPLE_VERY_LIGHT,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  eduDegree: {
    fontWeight: 600,
    fontSize: '9.5pt',
    color: '#1a1a2e',
  },
  eduInstitution: {
    fontSize: '8.5pt',
    color: '#6b7280',
  },
  projectItem: {
    marginBottom: '12px',
    padding: '10px 12px',
    background: PURPLE_VERY_LIGHT,
    borderRadius: '8px',
    border: `1px solid ${PURPLE}20`,
  },
  projectName: {
    fontWeight: 700,
    fontSize: '9.5pt',
    color: PURPLE,
    marginBottom: '3px',
  },
  techTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginTop: '5px',
  },
  techTag: {
    padding: '2px 8px',
    background: '#fff',
    border: `1px solid ${PURPLE}40`,
    color: PURPLE,
    borderRadius: '10px',
    fontSize: '7.5pt',
    fontWeight: 500,
  },
};

export default function CreativeTemplate({ resume }) {
  const sections = resume?.sections || {};
  const info = sections.personalInfo || {};
  const fullName = [info.firstName, info.lastName].filter(Boolean).join(' ') || 'Your Name';
  const mostRecentJob = (sections.experience || [])[0];
  const headline = mostRecentJob?.title || '';

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerDecor} />
        <div style={styles.headerDecor2} />
        <div style={styles.name}>{fullName}</div>
        {headline && <div style={styles.headline}>{headline}</div>}
        <div style={styles.headerContacts}>
          {info.email && (
            <span style={styles.headerContact}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" /></svg>
              {info.email}
            </span>
          )}
          {info.phone && (
            <span style={styles.headerContact}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              {info.phone}
            </span>
          )}
          {info.location && (
            <span style={styles.headerContact}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
              {info.location}
            </span>
          )}
          {info.linkedin && (
            <span style={styles.headerContact}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              {info.linkedin}
            </span>
          )}
          {info.github && (
            <span style={styles.headerContact}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
              {info.github}
            </span>
          )}
          {info.website && (
            <span style={styles.headerContact}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /></svg>
              {info.website}
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
            <div style={styles.sectionTitleRow}>
              <div style={styles.sectionDot} />
              <div style={styles.sectionTitle}>About Me</div>
              <div style={styles.sectionLine} />
            </div>
            <p style={{ fontSize: '9.5pt', color: '#374151', lineHeight: 1.7 }}>{sections.summary}</p>
          </div>
          </SectionWrapper>
        )}

        {/* Skills */}
        {(sections.skills || []).length > 0 && (
          <SectionWrapper sectionKey="skills">
          <div style={styles.section}>
            <div style={styles.sectionTitleRow}>
              <div style={styles.sectionDot} />
              <div style={styles.sectionTitle}>Skills</div>
              <div style={styles.sectionLine} />
            </div>
            {sections.skills.map((group, gi) => (
              <div key={group.id || gi} style={{ marginBottom: '8px' }}>
                {group.category && (
                  <div style={{ fontSize: '8.5pt', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                    {group.category}
                  </div>
                )}
                <div style={styles.skillsContainer}>
                  {(group.items || []).map((skill, si) => {
                    const colorScheme = SKILL_COLORS[(gi * 7 + si) % SKILL_COLORS.length];
                    return (
                      <span key={si} style={{ ...styles.skillTag, background: colorScheme.bg, color: colorScheme.text }}>
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          </SectionWrapper>
        )}

        {/* Experience */}
        {(sections.experience || []).length > 0 && (
          <SectionWrapper sectionKey="experience">
          <div style={styles.section}>
            <div style={styles.sectionTitleRow}>
              <div style={styles.sectionDot} />
              <div style={styles.sectionTitle}>Experience</div>
              <div style={styles.sectionLine} />
            </div>
            {sections.experience.map((exp, i) => (
              <div key={exp.id || i} style={styles.experienceItem}>
                <div style={styles.expDot} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                  <div>
                    <div style={styles.expTitle}>{exp.title}</div>
                    <div style={styles.expCompany}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
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

        {/* Projects */}
        {(sections.projects || []).length > 0 && (
          <SectionWrapper sectionKey="projects">
          <div style={styles.section}>
            <div style={styles.sectionTitleRow}>
              <div style={styles.sectionDot} />
              <div style={styles.sectionTitle}>Projects</div>
              <div style={styles.sectionLine} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {sections.projects.map((proj, i) => (
                <div key={proj.id || i} style={styles.projectItem}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={styles.projectName}>{proj.name}</div>
                    {(proj.startDate || proj.endDate) && (
                      <div style={{ fontSize: '7.5pt', color: '#9ca3af' }}>
                        <DateRange start={proj.startDate} end={proj.endDate} />
                      </div>
                    )}
                  </div>
                  {proj.description && (
                    <p style={{ fontSize: '8.5pt', color: '#374151', lineHeight: 1.4 }}>{proj.description}</p>
                  )}
                  {(proj.technologies || []).length > 0 && (
                    <div style={styles.techTags}>
                      {proj.technologies.map((tech, ti) => (
                        <span key={ti} style={styles.techTag}>{tech}</span>
                      ))}
                    </div>
                  )}
                  {proj.url && (
                    <div style={{ fontSize: '7.5pt', color: PURPLE, marginTop: '4px' }}>{proj.url}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          </SectionWrapper>
        )}

        {/* Education */}
        {(sections.education || []).length > 0 && (
          <SectionWrapper sectionKey="education">
          <div style={styles.section}>
            <div style={styles.sectionTitleRow}>
              <div style={styles.sectionDot} />
              <div style={styles.sectionTitle}>Education</div>
              <div style={styles.sectionLine} />
            </div>
            {sections.education.map((edu, i) => (
              <div key={edu.id || i} style={styles.educationItem}>
                <div style={styles.eduIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                </div>
                <div>
                  <div style={styles.eduDegree}>
                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
                  </div>
                  <div style={styles.eduInstitution}>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</div>
                  <div style={{ fontSize: '7.5pt', color: '#9ca3af' }}>
                    <DateRange start={edu.startDate} end={edu.endDate} />
                    {edu.gpa && ` · GPA: ${edu.gpa}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
          </SectionWrapper>
        )}
      </div>
    </div>
  );
}
