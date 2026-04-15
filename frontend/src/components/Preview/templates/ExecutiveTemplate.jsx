// Executive Template — serif typography, gold accents, premium centered header
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

const NAVY = '#0c1b33';
const GOLD = '#c9a84c';
const GOLD_LIGHT = '#f5e6c8';

const styles = {
  page: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '9.5pt',
    color: NAVY,
    lineHeight: 1.5,
    background: '#fff',
    minHeight: '100%',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  },
  header: {
    padding: '28px 40px 18px',
    borderTop: `5px solid ${NAVY}`,
    borderBottom: `2px solid ${GOLD}`,
    textAlign: 'center',
    background: '#fdfcf8',
  },
  name: {
    fontSize: '24pt',
    fontWeight: 700,
    color: NAVY,
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  headline: {
    fontSize: '9.5pt',
    color: GOLD,
    fontStyle: 'italic',
    fontWeight: 400,
    marginBottom: '10px',
    letterSpacing: '0.5px',
  },
  contactRow: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '0 4px',
    fontSize: '8.5pt',
    color: '#4b5563',
    fontFamily: 'system-ui, sans-serif',
    lineHeight: 1.8,
  },
  contactSep: {
    color: GOLD,
    padding: '0 4px',
    fontFamily: 'serif',
  },
  body: { padding: '18px 40px 30px' },
  section: { marginBottom: '16px' },
  sectionTitle: {
    display: 'flex', alignItems: 'center', gap: '10px',
    marginBottom: '10px',
  },
  sectionLine: { flex: 1, height: '1px', background: GOLD },
  sectionText: {
    fontSize: '8.5pt', fontWeight: 700, color: NAVY,
    textTransform: 'uppercase', letterSpacing: '2px',
    whiteSpace: 'nowrap', fontFamily: 'Georgia, serif',
  },
  expItem: { marginBottom: '13px', paddingLeft: '12px', borderLeft: `2px solid ${GOLD_LIGHT}` },
  expHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px',
    marginBottom: '2px',
  },
  company: { fontSize: '10pt', fontWeight: 700, color: GOLD, fontStyle: 'italic' },
  jobTitle: { fontSize: '9.5pt', fontWeight: 400, color: NAVY },
  dateText: {
    fontSize: '8pt', color: '#6b7280',
    fontFamily: 'system-ui, sans-serif', flexShrink: 0,
  },
  description: {
    marginTop: '4px', fontSize: '8.5pt', color: '#374151',
    whiteSpace: 'pre-line', lineHeight: 1.65,
    fontFamily: 'system-ui, sans-serif',
  },
  skillsContainer: {
    display: 'flex', flexWrap: 'wrap', gap: '6px',
    justifyContent: 'center',
  },
  skillBadge: {
    padding: '3px 12px', border: `1px solid ${GOLD}`,
    color: NAVY, fontSize: '8pt',
    fontFamily: 'system-ui, sans-serif',
    letterSpacing: '0.5px',
    background: '#fffdf5',
  },
};

export default function ExecutiveTemplate({ resume }) {
  const sections = resume?.sections || {};
  const info = sections.personalInfo || {};
  const fullName = [info.firstName, info.lastName].filter(Boolean).join(' ') || 'Your Name';
  const mostRecentJob = (sections.experience || [])[0];
  const headline = mostRecentJob?.title || '';

  const contactItems = [
    info.email, info.phone, info.location, info.linkedin, info.github, info.website,
  ].filter(Boolean);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.name}>{fullName}</div>
        {headline && <div style={styles.headline}>{headline}</div>}
        <div style={styles.contactRow}>
          {contactItems.map((item, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && <span style={styles.contactSep}>◆</span>}
              {item}
            </span>
          ))}
        </div>
      </div>

      <div style={styles.body}>
        {/* Summary */}
        {sections.summary && (
          <SectionWrapper sectionKey="summary">
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <div style={styles.sectionLine} />
              <span style={styles.sectionText}>Executive Summary</span>
              <div style={styles.sectionLine} />
            </div>
            <p style={{ fontSize: '9pt', color: '#374151', lineHeight: 1.75, textAlign: 'justify', fontFamily: 'Georgia, serif' }}>
              {sections.summary}
            </p>
          </div>
          </SectionWrapper>
        )}

        {/* Experience */}
        {(sections.experience || []).length > 0 && (
          <SectionWrapper sectionKey="experience">
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <div style={styles.sectionLine} />
              <span style={styles.sectionText}>Professional Experience</span>
              <div style={styles.sectionLine} />
            </div>
            {sections.experience.map((exp, i) => (
              <div key={exp.id || i} style={styles.expItem}>
                <div style={styles.expHeader}>
                  <div>
                    <div style={styles.company}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                    <div style={styles.jobTitle}>{exp.title}</div>
                  </div>
                  <div style={styles.dateText}><DateRange start={exp.startDate} end={exp.endDate} current={exp.current} /></div>
                </div>
                {exp.description && <div style={styles.description}>{exp.description}</div>}
              </div>
            ))}
          </div>
          </SectionWrapper>
        )}

        {/* Education */}
        {(sections.education || []).length > 0 && (
          <SectionWrapper sectionKey="education">
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <div style={styles.sectionLine} />
              <span style={styles.sectionText}>Education</span>
              <div style={styles.sectionLine} />
            </div>
            {sections.education.map((edu, i) => (
              <div key={edu.id || i} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: `2px solid ${GOLD_LIGHT}` }}>
                <div style={styles.expHeader}>
                  <div>
                    <div style={styles.company}>{edu.institution}</div>
                    <div style={styles.jobTitle}>{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}</div>
                    {edu.location && <div style={{ fontSize: '8pt', color: '#6b7280', fontFamily: 'system-ui, sans-serif' }}>{edu.location}</div>}
                  </div>
                  <div style={styles.dateText}><DateRange start={edu.startDate} end={edu.endDate} /></div>
                </div>
                {edu.gpa && <div style={{ fontSize: '8pt', color: '#6b7280', fontFamily: 'system-ui, sans-serif' }}>GPA: {edu.gpa}</div>}
                {edu.description && <div style={{ fontSize: '8pt', color: '#6b7280', fontFamily: 'system-ui, sans-serif', marginTop: '2px' }}>{edu.description}</div>}
              </div>
            ))}
          </div>
          </SectionWrapper>
        )}

        {/* Core Competencies */}
        {(sections.skills || []).length > 0 && (
          <SectionWrapper sectionKey="skills">
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <div style={styles.sectionLine} />
              <span style={styles.sectionText}>Core Competencies</span>
              <div style={styles.sectionLine} />
            </div>
            <div style={styles.skillsContainer}>
              {sections.skills.flatMap((group) => group.items || []).map((skill, i) => (
                <span key={i} style={styles.skillBadge}>{skill}</span>
              ))}
            </div>
          </div>
          </SectionWrapper>
        )}

        {/* Projects */}
        {(sections.projects || []).length > 0 && (
          <SectionWrapper sectionKey="projects">
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <div style={styles.sectionLine} />
              <span style={styles.sectionText}>Notable Projects</span>
              <div style={styles.sectionLine} />
            </div>
            {sections.projects.map((proj, i) => (
              <div key={proj.id || i} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: `2px solid ${GOLD_LIGHT}` }}>
                <div style={styles.expHeader}>
                  <span style={{ fontWeight: 700, fontSize: '9.5pt', color: GOLD, fontStyle: 'italic' }}>{proj.name}</span>
                  <div style={styles.dateText}><DateRange start={proj.startDate} end={proj.endDate} /></div>
                </div>
                {proj.description && (
                  <p style={{ fontSize: '8.5pt', color: '#374151', marginTop: '2px', lineHeight: 1.6, fontFamily: 'system-ui, sans-serif' }}>
                    {proj.description}
                  </p>
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
