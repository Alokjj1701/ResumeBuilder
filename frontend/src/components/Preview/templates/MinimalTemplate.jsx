// Minimal Template — single column, black & white, serif-inspired
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

const styles = {
  page: {
    fontFamily: 'Georgia, "Times New Roman", Times, serif',
    fontSize: '10pt',
    color: '#1a1a1a',
    lineHeight: 1.5,
    padding: '48px 52px',
    background: '#fff',
    minHeight: '100%',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  },
  name: {
    fontSize: '28pt',
    fontWeight: 700,
    color: '#000',
    textAlign: 'center',
    letterSpacing: '1px',
    marginBottom: '6px',
  },
  contactRow: {
    textAlign: 'center',
    fontSize: '9pt',
    color: '#333',
    marginBottom: '4px',
  },
  divider: {
    borderTop: '1.5px solid #1a1a1a',
    margin: '14px 0',
  },
  thinDivider: {
    borderTop: '0.5px solid #999',
    margin: '12px 0',
  },
  section: {
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '10pt',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color: '#000',
    marginBottom: '8px',
  },
  experienceItem: {
    marginBottom: '12px',
  },
  jobRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1px',
  },
  jobTitle: {
    fontWeight: 700,
    fontSize: '10pt',
  },
  dateText: {
    fontSize: '9pt',
    color: '#555',
    fontStyle: 'italic',
    flexShrink: 0,
    marginLeft: '8px',
  },
  company: {
    fontSize: '9.5pt',
    color: '#333',
    fontStyle: 'italic',
  },
  description: {
    marginTop: '4px',
    fontSize: '9.5pt',
    whiteSpace: 'pre-line',
    lineHeight: 1.5,
    color: '#222',
  },
  skillLine: {
    marginBottom: '4px',
    fontSize: '9.5pt',
  },
  skillCategory: {
    fontWeight: 700,
    marginRight: '6px',
  },
  educationItem: {
    marginBottom: '10px',
  },
  projectItem: {
    marginBottom: '10px',
  },
};

export default function MinimalTemplate({ resume }) {
  const sections = resume?.sections || {};
  const info = sections.personalInfo || {};
  const fullName = [info.firstName, info.lastName].filter(Boolean).join(' ') || 'Your Name';

  const contacts = [
    info.email,
    info.phone,
    info.location,
    info.website,
    info.linkedin,
    info.github,
  ].filter(Boolean);

  const midpoint = Math.ceil(contacts.length / 2);
  const line1 = contacts.slice(0, midpoint).join('  ·  ');
  const line2 = contacts.slice(midpoint).join('  ·  ');

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.name}>{fullName}</div>
      {line1 && <div style={styles.contactRow}>{line1}</div>}
      {line2 && <div style={styles.contactRow}>{line2}</div>}
      <div style={styles.divider} />

      {/* Summary */}
      {sections.summary && (
        <SectionWrapper sectionKey="summary">
        <div style={styles.section}>
          <p style={{ fontSize: '9.5pt', color: '#222', lineHeight: 1.6, textAlign: 'justify' }}>
            {sections.summary}
          </p>
          <div style={styles.thinDivider} />
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
              <div style={styles.jobRow}>
                <div>
                  <span style={styles.jobTitle}>{exp.title}</span>
                  {exp.company && <span style={{ fontSize: '10pt' }}> — {exp.company}</span>}
                </div>
                <span style={styles.dateText}>
                  <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
                </span>
              </div>
              {exp.location && (
                <div style={styles.company}>{exp.location}</div>
              )}
              {exp.description && (
                <div style={styles.description}>{exp.description}</div>
              )}
            </div>
          ))}
          <div style={styles.thinDivider} />
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
              <div style={styles.jobRow}>
                <div>
                  <span style={styles.jobTitle}>
                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
                  </span>
                </div>
                <span style={styles.dateText}>
                  <DateRange start={edu.startDate} end={edu.endDate} />
                </span>
              </div>
              <div style={styles.company}>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</div>
              {edu.gpa && <div style={{ fontSize: '9pt', color: '#555' }}>GPA: {edu.gpa}</div>}
              {edu.description && (
                <div style={{ fontSize: '9pt', color: '#444', marginTop: '3px' }}>{edu.description}</div>
              )}
            </div>
          ))}
          <div style={styles.thinDivider} />
        </div>
        </SectionWrapper>
      )}

      {/* Skills */}
      {(sections.skills || []).length > 0 && (
        <SectionWrapper sectionKey="skills">
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Skills</div>
          {sections.skills.map((group, i) => (
            <div key={group.id || i} style={styles.skillLine}>
              {group.category && (
                <span style={styles.skillCategory}>{group.category}:</span>
              )}
              <span style={{ color: '#333' }}>{(group.items || []).join(', ')}</span>
            </div>
          ))}
          <div style={styles.thinDivider} />
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
              <div style={styles.jobRow}>
                <div>
                  <span style={styles.jobTitle}>{proj.name}</span>
                  {proj.url && (
                    <span style={{ fontSize: '8.5pt', color: '#555', marginLeft: '8px', fontStyle: 'italic' }}>
                      {proj.url}
                    </span>
                  )}
                </div>
                <span style={styles.dateText}>
                  <DateRange start={proj.startDate} end={proj.endDate} />
                </span>
              </div>
              {(proj.technologies || []).length > 0 && (
                <div style={styles.company}>{proj.technologies.join(', ')}</div>
              )}
              {proj.description && (
                <div style={styles.description}>{proj.description}</div>
              )}
            </div>
          ))}
        </div>
        </SectionWrapper>
      )}
    </div>
  );
}
