// Chronicle Template — inspired by "Blue and Gray Simple Professional CV Resume" (Richard Sanchez)
import SectionWrapper from '../SectionWrapper';
// Dark navy full-width header · circular photo top-left · gray sidebar · timeline dots on experience

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const [year, month] = dateStr.split('-');
    const d = new Date(parseInt(year), parseInt(month) - 1, 1);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  } catch { return dateStr; }
}

function DateRange({ start, end, current }) {
  if (!start && !end) return null;
  const s = formatDate(start);
  const e = current ? 'Present' : formatDate(end);
  return <span>{[s, e].filter(Boolean).join(' – ')}</span>;
}

const NAVY = '#1e2a45';
const NAVY_DARK = '#121c30';
const BLUE = '#2563eb';
const SIDEBAR_BG = '#f1f3f6';
const SIDEBAR_TEXT = '#374151';

function SidebarSection({ title }) {
  return (
    <div style={{
      fontSize: '7.5pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px',
      color: NAVY, marginBottom: '8px',
      borderBottom: `2px solid ${NAVY}`,
      paddingBottom: '3px',
    }}>
      {title}
    </div>
  );
}

function MainSection({ title, icon }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
      {icon && (
        <div style={{
          width: '22px', height: '22px', borderRadius: '50%',
          background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ color: '#fff', fontSize: '9pt' }}>{icon}</span>
        </div>
      )}
      <div style={{
        fontSize: '9pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px',
        color: NAVY,
      }}>
        {title}
      </div>
      <div style={{ flex: 1, height: '1.5px', background: `${NAVY}30` }} />
    </div>
  );
}

export default function ChronicleTemplate({ resume }) {
  const sections = resume?.sections || {};
  const info = sections.personalInfo || {};
  const fullName = [info.firstName, info.lastName].filter(Boolean).join(' ') || 'Your Name';
  const initials = [info.firstName?.[0], info.lastName?.[0]].filter(Boolean).join('') || '?';
  const mostRecentJob = (sections.experience || [])[0];
  const headline = mostRecentJob?.title ? mostRecentJob.title.toUpperCase() : '';

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
      fontSize: '9.5pt', color: '#1f2937',
      background: '#fff', minHeight: '100%',
      overflowWrap: 'break-word', wordBreak: 'break-word',
    }}>
      {/* ── Full-width navy header ── */}
      <div style={{
        background: `linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY} 100%)`,
        padding: '22px 28px 22px',
        display: 'flex', alignItems: 'center', gap: '22px',
      }}>
        {/* Circular photo */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.5)',
          overflow: 'hidden', flexShrink: 0,
          background: 'rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}>
          {info.photo ? (
            <img src={info.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '22pt', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>{initials}</span>
          )}
        </div>

        {/* Name + headline */}
        <div>
          <div style={{ fontSize: '22pt', fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.5px' }}>
            {fullName}
          </div>
          {headline && (
            <div style={{ fontSize: '8.5pt', fontWeight: 600, color: 'rgba(255,255,255,0.65)', letterSpacing: '2px', marginTop: '4px' }}>
              {headline}
            </div>
          )}
        </div>
      </div>

      {/* ── Two-column body ── */}
      <div style={{ display: 'flex' }}>
        {/* ── Sidebar ── */}
        <div style={{
          width: '190px', flexShrink: 0,
          background: SIDEBAR_BG,
          padding: '22px 16px',
        }}>
          {/* Contact */}
          {(info.email || info.phone || info.location || info.website || info.linkedin || info.github) && (
            <div style={{ marginBottom: '18px' }}>
              <SidebarSection title="Contact" />
              {[
                info.phone && { icon: '☎', val: info.phone },
                info.email && { icon: '✉', val: info.email },
                info.location && { icon: '⌖', val: info.location },
                info.website && { icon: '🌐', val: info.website },
                info.linkedin && { icon: 'in', val: info.linkedin },
                info.github && { icon: 'gh', val: info.github },
              ].filter(Boolean).map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '5px' }}>
                  <span style={{ fontSize: '7pt', color: NAVY, fontWeight: 700, flexShrink: 0, width: '14px', textAlign: 'center', marginTop: '1px' }}>{c.icon}</span>
                  <span style={{ fontSize: '7.5pt', color: SIDEBAR_TEXT, wordBreak: 'break-all', lineHeight: 1.4 }}>{c.val}</span>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {(sections.skills || []).length > 0 && (
            <SectionWrapper sectionKey="skills">
            <div style={{ marginBottom: '18px' }}>
              <SidebarSection title="Skills" />
              {sections.skills.map((group, i) => (
                <div key={group.id || i} style={{ marginBottom: '8px' }}>
                  {group.category && (
                    <div style={{ fontSize: '7pt', color: '#6b7280', fontStyle: 'italic', marginBottom: '3px' }}>{group.category}</div>
                  )}
                  {(group.items || []).map((skill, si) => (
                    <div key={si} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: NAVY, flexShrink: 0, display: 'block' }} />
                      <span style={{ fontSize: '7.5pt', color: SIDEBAR_TEXT }}>{skill}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            </SectionWrapper>
          )}

          {/* Education */}
          {(sections.education || []).length > 0 && (
            <SectionWrapper sectionKey="education">
            <div>
              <SidebarSection title="Education" />
              {sections.education.map((edu, i) => (
                <div key={edu.id || i} style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '8pt', fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
                  </div>
                  <div style={{ fontSize: '7.5pt', color: '#4b5563', fontWeight: 600 }}>{edu.institution}</div>
                  <div style={{ fontSize: '7pt', color: '#6b7280', fontStyle: 'italic' }}>
                    <DateRange start={edu.startDate} end={edu.endDate} />
                  </div>
                  {edu.gpa && <div style={{ fontSize: '7pt', color: '#6b7280' }}>GPA: {edu.gpa}</div>}
                  {edu.description && <div style={{ fontSize: '7pt', color: '#6b7280', marginTop: '2px', lineHeight: 1.5 }}>{edu.description}</div>}
                </div>
              ))}
            </div>
            </SectionWrapper>
          )}
        </div>

        {/* ── Main content ── */}
        <div style={{ flex: 1, minWidth: 0, padding: '22px 24px' }}>
          {/* Profile / Summary */}
          {sections.summary && (
            <SectionWrapper sectionKey="summary">
            <div style={{ marginBottom: '18px' }}>
              <MainSection title="Profile" icon="◉" />
              <p style={{ fontSize: '9pt', color: '#374151', lineHeight: 1.75 }}>{sections.summary}</p>
            </div>
            </SectionWrapper>
          )}

          {/* Work Experience — with timeline dots */}
          {(sections.experience || []).length > 0 && (
            <SectionWrapper sectionKey="experience">
            <div style={{ marginBottom: '18px' }}>
              <MainSection title="Work Experience" icon="◉" />
              {/* Timeline line */}
              <div style={{ position: 'relative', paddingLeft: '16px', borderLeft: `2px solid ${NAVY}25` }}>
                {sections.experience.map((exp, i) => (
                  <div key={exp.id || i} style={{ marginBottom: '14px', position: 'relative' }}>
                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute', left: '-20px', top: '5px',
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: NAVY, border: '2px solid #fff',
                      boxShadow: `0 0 0 2px ${NAVY}40`,
                    }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                      <div style={{ fontWeight: 700, fontSize: '10pt', color: '#111827' }}>{exp.title}</div>
                      <div style={{ fontSize: '7.5pt', color: '#6b7280', flexShrink: 0 }}>
                        <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
                      </div>
                    </div>
                    <div style={{ fontSize: '8.5pt', color: NAVY, fontWeight: 600, marginBottom: '3px' }}>
                      {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                    </div>
                    {exp.description && (
                      <div style={{ fontSize: '8.5pt', color: '#4b5563', whiteSpace: 'pre-line', lineHeight: 1.65 }}>
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            </SectionWrapper>
          )}

          {/* Projects */}
          {(sections.projects || []).length > 0 && (
            <SectionWrapper sectionKey="projects">
            <div>
              <MainSection title="Projects" icon="◉" />
              <div style={{ position: 'relative', paddingLeft: '16px', borderLeft: `2px solid ${NAVY}25` }}>
                {sections.projects.map((proj, i) => (
                  <div key={proj.id || i} style={{ marginBottom: '12px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: '-20px', top: '5px',
                      width: '8px', height: '8px', borderRadius: '2px',
                      background: BLUE, border: '2px solid #fff',
                    }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '9.5pt', color: '#111827' }}>{proj.name}</span>
                      <span style={{ fontSize: '7.5pt', color: '#6b7280' }}><DateRange start={proj.startDate} end={proj.endDate} /></span>
                    </div>
                    {proj.url && <div style={{ fontSize: '7.5pt', color: BLUE }}>{proj.url}</div>}
                    {proj.description && <p style={{ fontSize: '8.5pt', color: '#4b5563', lineHeight: 1.6, marginTop: '2px' }}>{proj.description}</p>}
                    {(proj.technologies || []).length > 0 && (
                      <div style={{ fontSize: '7.5pt', color: '#6b7280', marginTop: '3px' }}>
                        {proj.technologies.join(' · ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            </SectionWrapper>
          )}
        </div>
      </div>
    </div>
  );
}
