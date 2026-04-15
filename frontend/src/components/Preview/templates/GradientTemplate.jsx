// Gradient Template — bold indigo-to-pink gradient header, Gen Z energy
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
  return <span style={{ color: '#64748b', fontSize: '8pt' }}>{[s, e].filter(Boolean).join(' – ')}</span>;
}

const styles = {
  page: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    fontSize: '9.5pt',
    color: '#1e293b',
    lineHeight: 1.45,
    background: '#fff',
    minHeight: '100%',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  },
  header: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 45%, #ec4899 100%)',
    padding: '30px 36px 26px',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  decor1: {
    position: 'absolute', top: '-30px', right: '-20px',
    width: '150px', height: '150px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
  },
  decor2: {
    position: 'absolute', bottom: '-25px', left: '38%',
    width: '100px', height: '100px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
  },
  decor3: {
    position: 'absolute', top: '10px', left: '-20px',
    width: '80px', height: '80px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.04)',
  },
  name: {
    fontSize: '27pt',
    fontWeight: 800,
    letterSpacing: '-0.5px',
    lineHeight: 1.05,
    marginBottom: '6px',
    position: 'relative', zIndex: 1,
  },
  headline: {
    fontSize: '10.5pt',
    fontWeight: 400,
    opacity: 0.85,
    marginBottom: '12px',
    position: 'relative', zIndex: 1,
  },
  contactRow: {
    display: 'flex', flexWrap: 'wrap', gap: '6px 14px',
    fontSize: '8pt', position: 'relative', zIndex: 1,
  },
  contactItem: {
    display: 'flex', alignItems: 'center', gap: '5px', opacity: 0.88,
  },
  body: { padding: '22px 36px 30px' },
  twoCol: { display: 'flex', gap: '22px' },
  leftCol: { flex: '0 0 61%', minWidth: 0 },
  rightCol: { flex: '0 0 36%', minWidth: 0 },
  section: { marginBottom: '18px' },
  sectionTitle: {
    fontSize: '7.5pt',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: '#6d28d9',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  sectionLine: {
    flex: 1, height: '1px',
    background: 'linear-gradient(to right, #a78bfa60, transparent)',
  },
  experienceItem: { marginBottom: '13px' },
  jobTitle: { fontWeight: 700, fontSize: '10pt', color: '#0f172a' },
  company: { fontSize: '9pt', color: '#475569', fontWeight: 500 },
  description: {
    marginTop: '4px', fontSize: '8.5pt', color: '#475569',
    whiteSpace: 'pre-line', lineHeight: 1.55,
  },
  skillGrid: { display: 'flex', flexWrap: 'wrap', gap: '4px' },
  skillTag: {
    padding: '2px 9px', borderRadius: '100px',
    fontSize: '7.5pt', fontWeight: 500,
    background: 'linear-gradient(135deg, #ede9fe, #fce7f3)',
    color: '#6d28d9', border: '1px solid #ddd6fe',
  },
  educationItem: { marginBottom: '10px' },
  degree: { fontWeight: 600, fontSize: '9pt', color: '#0f172a' },
  institution: { fontSize: '8.5pt', color: '#64748b' },
};

export default function GradientTemplate({ resume }) {
  const sections = resume?.sections || {};
  const info = sections.personalInfo || {};
  const fullName = [info.firstName, info.lastName].filter(Boolean).join(' ') || 'Your Name';
  const mostRecentJob = (sections.experience || [])[0];
  const headline = mostRecentJob
    ? `${mostRecentJob.title || ''}${mostRecentJob.company ? ` · ${mostRecentJob.company}` : ''}`
    : '';

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.decor1} />
        <div style={styles.decor2} />
        <div style={styles.decor3} />
        <div style={styles.name}>{fullName}</div>
        {headline && <div style={styles.headline}>{headline}</div>}
        <div style={styles.contactRow}>
          {info.email && <span style={styles.contactItem}>{info.email}</span>}
          {info.phone && <span style={styles.contactItem}>{info.phone}</span>}
          {info.location && <span style={styles.contactItem}>{info.location}</span>}
          {info.linkedin && <span style={styles.contactItem}>{info.linkedin}</span>}
          {info.github && <span style={styles.contactItem}>{info.github}</span>}
          {info.website && <span style={styles.contactItem}>{info.website}</span>}
        </div>
      </div>

      <div style={styles.body}>
        {/* Summary */}
        {sections.summary && (
          <SectionWrapper sectionKey="summary">
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              About
              <div style={styles.sectionLine} />
            </div>
            <p style={{ fontSize: '9pt', color: '#475569', lineHeight: 1.65 }}>{sections.summary}</p>
          </div>
          </SectionWrapper>
        )}

        <div style={styles.twoCol}>
          {/* Left column */}
          <div style={styles.leftCol}>
            {(sections.experience || []).length > 0 && (
              <SectionWrapper sectionKey="experience">
              <div style={styles.section}>
                <div style={styles.sectionTitle}>
                  Experience
                  <div style={styles.sectionLine} />
                </div>
                {sections.experience.map((exp, i) => (
                  <div key={exp.id || i} style={styles.experienceItem}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                      <div>
                        <div style={styles.jobTitle}>{exp.title}</div>
                        <div style={styles.company}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                      </div>
                      <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
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
                <div style={styles.sectionTitle}>
                  Projects
                  <div style={styles.sectionLine} />
                </div>
                {sections.projects.map((proj, i) => (
                  <div key={proj.id || i} style={{ marginBottom: '11px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '9.5pt', color: '#0f172a' }}>{proj.name}</span>
                      <DateRange start={proj.startDate} end={proj.endDate} />
                    </div>
                    {proj.url && <div style={{ fontSize: '7.5pt', color: '#7c3aed', marginTop: '1px' }}>{proj.url}</div>}
                    {proj.description && (
                      <p style={{ fontSize: '8.5pt', color: '#475569', marginTop: '3px', lineHeight: 1.5 }}>{proj.description}</p>
                    )}
                    {(proj.technologies || []).length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '4px' }}>
                        {proj.technologies.map((tech, ti) => (
                          <span key={ti} style={{ padding: '1px 6px', background: '#f8fafc', color: '#475569', borderRadius: '4px', fontSize: '7pt', border: '1px solid #e2e8f0' }}>{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              </SectionWrapper>
            )}
          </div>

          {/* Right column */}
          <div style={styles.rightCol}>
            {(sections.skills || []).length > 0 && (
              <SectionWrapper sectionKey="skills">
              <div style={styles.section}>
                <div style={styles.sectionTitle}>
                  Skills
                  <div style={styles.sectionLine} />
                </div>
                {sections.skills.map((group, i) => (
                  <div key={group.id || i} style={{ marginBottom: '8px' }}>
                    {group.category && (
                      <div style={{ fontWeight: 600, fontSize: '8pt', color: '#334155', marginBottom: '4px' }}>{group.category}</div>
                    )}
                    <div style={styles.skillGrid}>
                      {(group.items || []).map((skill, si) => (
                        <span key={si} style={styles.skillTag}>{skill}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              </SectionWrapper>
            )}

            {(sections.education || []).length > 0 && (
              <SectionWrapper sectionKey="education">
              <div style={styles.section}>
                <div style={styles.sectionTitle}>
                  Education
                  <div style={styles.sectionLine} />
                </div>
                {sections.education.map((edu, i) => (
                  <div key={edu.id || i} style={styles.educationItem}>
                    <div style={styles.degree}>{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}</div>
                    <div style={styles.institution}>{edu.institution}</div>
                    {edu.location && <div style={{ fontSize: '8pt', color: '#94a3b8' }}>{edu.location}</div>}
                    <DateRange start={edu.startDate} end={edu.endDate} />
                    {edu.gpa && <div style={{ fontSize: '7.5pt', color: '#64748b', marginTop: '1px' }}>GPA: {edu.gpa}</div>}
                    {edu.description && <div style={{ fontSize: '7.5pt', color: '#64748b', marginTop: '2px' }}>{edu.description}</div>}
                  </div>
                ))}
              </div>
              </SectionWrapper>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
