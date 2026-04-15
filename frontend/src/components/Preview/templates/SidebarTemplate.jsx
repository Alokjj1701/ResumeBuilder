// Sidebar Template — dark navy sidebar, light content area
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

const DARK = '#0f172a';
const ACCENT = '#38bdf8';
const ACCENT_DIM = 'rgba(56,189,248,0.18)';

const styles = {
  page: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    fontSize: '9.5pt',
    display: 'flex',
    minHeight: '100%',
    background: '#fff',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  },
  sidebar: {
    width: '198px',
    flexShrink: 0,
    background: DARK,
    padding: '26px 16px 24px',
    color: '#e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  avatarCircle: {
    width: '52px', height: '52px', borderRadius: '50%',
    background: `linear-gradient(135deg, ${ACCENT}, #818cf8)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '16pt', fontWeight: 800, color: '#fff',
    marginBottom: '12px', flexShrink: 0,
    letterSpacing: '-0.5px',
  },
  sidebarName: {
    fontSize: '13pt',
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1.2,
    marginBottom: '3px',
    letterSpacing: '-0.3px',
  },
  sidebarHeadline: {
    fontSize: '8pt',
    color: ACCENT,
    fontWeight: 500,
    marginBottom: '16px',
    lineHeight: 1.35,
  },
  sidebarSection: { marginBottom: '16px' },
  sidebarSectionTitle: {
    fontSize: '7pt',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: ACCENT,
    marginBottom: '7px',
    borderBottom: `1px solid ${ACCENT_DIM}`,
    paddingBottom: '4px',
  },
  contactItem: {
    display: 'flex', alignItems: 'flex-start', gap: '5px',
    marginBottom: '4px', fontSize: '7.5pt', color: '#94a3b8',
    lineHeight: 1.4,
    wordBreak: 'break-all',
  },
  contactDot: {
    width: '4px', height: '4px', borderRadius: '50%',
    background: ACCENT, flexShrink: 0, marginTop: '4px',
  },
  skillTag: {
    display: 'inline-block',
    padding: '2px 7px',
    background: ACCENT_DIM,
    color: '#7dd3fc',
    borderRadius: '3px',
    fontSize: '7pt',
    marginBottom: '3px', marginRight: '2px',
    border: `1px solid rgba(56,189,248,0.15)`,
  },
  eduItem: { marginBottom: '9px' },
  eduDegree: { fontSize: '8pt', fontWeight: 600, color: '#e2e8f0' },
  eduInstitution: { fontSize: '7.5pt', color: '#64748b' },
  eduDate: { fontSize: '7pt', color: '#475569' },
  main: {
    flex: 1,
    padding: '26px 22px 26px 20px',
    minWidth: 0,
  },
  section: { marginBottom: '17px' },
  sectionTitle: {
    fontSize: '9pt', fontWeight: 700, color: DARK,
    textTransform: 'uppercase', letterSpacing: '1px',
    borderBottom: `2px solid ${DARK}`,
    paddingBottom: '3px', marginBottom: '10px',
  },
  expItem: { marginBottom: '12px' },
  jobTitle: { fontWeight: 700, fontSize: '10pt', color: DARK },
  company: { fontSize: '9pt', color: '#475569', fontWeight: 500 },
  dateText: { fontSize: '7.5pt', color: '#64748b' },
  description: {
    marginTop: '4px', fontSize: '8.5pt', color: '#475569',
    whiteSpace: 'pre-line', lineHeight: 1.55,
  },
};

export default function SidebarTemplate({ resume }) {
  const sections = resume?.sections || {};
  const info = sections.personalInfo || {};
  const fullName = [info.firstName, info.lastName].filter(Boolean).join(' ') || 'Your Name';
  const initials = [info.firstName?.[0], info.lastName?.[0]].filter(Boolean).join('') || '?';
  const mostRecentJob = (sections.experience || [])[0];
  const headline = mostRecentJob
    ? `${mostRecentJob.title || ''}${mostRecentJob.company ? ` · ${mostRecentJob.company}` : ''}`
    : '';

  const contactFields = [
    info.email, info.phone, info.location,
    info.linkedin, info.github, info.website,
  ].filter(Boolean);

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.avatarCircle}>{initials}</div>
        <div style={styles.sidebarName}>{fullName}</div>
        {headline && <div style={styles.sidebarHeadline}>{headline}</div>}

        {/* Contact */}
        {contactFields.length > 0 && (
          <div style={styles.sidebarSection}>
            <div style={styles.sidebarSectionTitle}>Contact</div>
            {contactFields.map((item, i) => (
              <div key={i} style={styles.contactItem}>
                <span style={styles.contactDot} />
                {item}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {(sections.skills || []).length > 0 && (
          <SectionWrapper sectionKey="skills">
          <div style={styles.sidebarSection}>
            <div style={styles.sidebarSectionTitle}>Skills</div>
            {sections.skills.map((group, i) => (
              <div key={group.id || i} style={{ marginBottom: '6px' }}>
                {group.category && (
                  <div style={{ fontSize: '7pt', color: '#475569', marginBottom: '3px', fontWeight: 500 }}>{group.category}</div>
                )}
                <div>
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
          <div style={styles.sidebarSection}>
            <div style={styles.sidebarSectionTitle}>Education</div>
            {sections.education.map((edu, i) => (
              <div key={edu.id || i} style={styles.eduItem}>
                <div style={styles.eduDegree}>{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}</div>
                <div style={styles.eduInstitution}>{edu.institution}</div>
                <div style={styles.eduDate}><DateRange start={edu.startDate} end={edu.endDate} /></div>
                {edu.gpa && <div style={{ fontSize: '7pt', color: '#475569' }}>GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
          </SectionWrapper>
        )}
      </div>

      {/* Main content */}
      <div style={styles.main}>
        {sections.summary && (
          <SectionWrapper sectionKey="summary">
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Profile</div>
            <p style={{ fontSize: '9pt', color: '#374151', lineHeight: 1.65 }}>{sections.summary}</p>
          </div>
          </SectionWrapper>
        )}

        {(sections.experience || []).length > 0 && (
          <SectionWrapper sectionKey="experience">
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Experience</div>
            {sections.experience.map((exp, i) => (
              <div key={exp.id || i} style={styles.expItem}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                  <div>
                    <div style={styles.jobTitle}>{exp.title}</div>
                    <div style={styles.company}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                  </div>
                  <div style={styles.dateText}><DateRange start={exp.startDate} end={exp.endDate} current={exp.current} /></div>
                </div>
                {exp.description && <div style={styles.description}>{exp.description}</div>}
              </div>
            ))}
          </div>
          </SectionWrapper>
        )}

        {(sections.projects || []).length > 0 && (
          <SectionWrapper sectionKey="projects">
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Projects</div>
            {sections.projects.map((proj, i) => (
              <div key={proj.id || i} style={{ marginBottom: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '9.5pt', color: DARK }}>{proj.name}</span>
                  <span style={styles.dateText}><DateRange start={proj.startDate} end={proj.endDate} /></span>
                </div>
                {proj.url && <div style={{ fontSize: '7.5pt', color: '#3b82f6', marginTop: '1px' }}>{proj.url}</div>}
                {proj.description && (
                  <p style={{ fontSize: '8.5pt', color: '#475569', marginTop: '3px', lineHeight: 1.5 }}>{proj.description}</p>
                )}
                {(proj.technologies || []).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '4px' }}>
                    {proj.technologies.map((tech, ti) => (
                      <span key={ti} style={{ padding: '1px 7px', background: '#f1f5f9', color: '#475569', borderRadius: '3px', fontSize: '7pt', border: '1px solid #e2e8f0' }}>{tech}</span>
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
