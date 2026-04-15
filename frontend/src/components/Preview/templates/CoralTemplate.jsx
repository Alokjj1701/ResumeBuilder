// Coral Template — warm orange-coral full-width header, clean two-zone body
import SectionWrapper from '../SectionWrapper';

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

const CORAL = '#ea580c';
const CORAL_DARK = '#c2410c';
const CORAL_LIGHT = '#fff7ed';
const CORAL_PALE = '#fed7aa';

export default function CoralTemplate({ resume }) {
  const sections = resume?.sections || {};
  const info = sections.personalInfo || {};
  const fullName = [info.firstName, info.lastName].filter(Boolean).join(' ') || 'Your Name';
  const initials = [info.firstName?.[0], info.lastName?.[0]].filter(Boolean).join('') || '?';
  const mostRecentJob = (sections.experience || [])[0];
  const headline = mostRecentJob?.title || '';

  const contactItems = [info.email, info.phone, info.location].filter(Boolean);
  const linkItems = [info.linkedin, info.github, info.website].filter(Boolean);

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
      fontSize: '9.5pt', color: '#1c1917',
      background: '#fff', minHeight: '100%',
      overflowWrap: 'break-word', wordBreak: 'break-word',
    }}>
      {/* ── Header ── */}
      <div style={{
        background: `linear-gradient(135deg, ${CORAL_DARK} 0%, ${CORAL} 60%, #f97316 100%)`,
        padding: '28px 36px 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '55%', width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
          {/* Avatar */}
          <div style={{
            width: '68px', height: '68px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            border: '2.5px solid rgba(255,255,255,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18pt', fontWeight: 900, color: '#fff',
            flexShrink: 0, boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
          }}>
            {initials}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '22pt', fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.5px', marginBottom: '3px' }}>
              {fullName}
            </div>
            {headline && (
              <div style={{ fontSize: '10.5pt', color: 'rgba(255,255,255,0.82)', fontWeight: 500, marginBottom: '8px' }}>
                {headline}
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: '7.5pt', color: 'rgba(255,255,255,0.78)' }}>
              {contactItems.map((item, i) => (
                <span key={i}>{item}</span>
              ))}
              {linkItems.map((item, i) => (
                <span key={i} style={{ color: 'rgba(255,255,255,0.65)' }}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '22px 36px 28px' }}>
        {/* Summary */}
        {sections.summary && (
          <SectionWrapper sectionKey="summary">
          <div style={{ marginBottom: '18px', padding: '12px 14px', background: CORAL_LIGHT, borderLeft: `3px solid ${CORAL}`, borderRadius: '0 8px 8px 0' }}>
            <p style={{ fontSize: '9pt', color: '#44403c', lineHeight: 1.7, fontStyle: 'italic' }}>{sections.summary}</p>
          </div>
          </SectionWrapper>
        )}

        {/* Experience */}
        {(sections.experience || []).length > 0 && (
          <SectionWrapper sectionKey="experience">
          <div style={{ marginBottom: '18px' }}>
            <SectionTitle title="Work Experience" color={CORAL} />
            {sections.experience.map((exp, i) => (
              <div key={exp.id || i} style={{ marginBottom: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '10pt', color: '#1c1917' }}>{exp.title}</div>
                    <div style={{ fontSize: '8.5pt', color: CORAL, fontWeight: 600 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                  </div>
                  <div style={{
                    fontSize: '7.5pt', color: '#fff', background: CORAL,
                    padding: '2px 8px', borderRadius: '100px', flexShrink: 0,
                  }}>
                    <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
                  </div>
                </div>
                {exp.description && (
                  <div style={{ fontSize: '8.5pt', color: '#57534e', whiteSpace: 'pre-line', lineHeight: 1.6, marginTop: '4px' }}>
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
          </SectionWrapper>
        )}

        {/* Two-col: Skills + Education */}
        {((sections.skills || []).length > 0 || (sections.education || []).length > 0) && (
          <div style={{ display: 'flex', gap: '20px', marginBottom: '18px' }}>
            {(sections.skills || []).length > 0 && (
              <SectionWrapper sectionKey="skills">
              <div style={{ flex: 1, minWidth: 0 }}>
                <SectionTitle title="Skills" color={CORAL} />
                {sections.skills.map((group, i) => (
                  <div key={group.id || i} style={{ marginBottom: '8px' }}>
                    {group.category && (
                      <div style={{ fontSize: '8pt', fontWeight: 700, color: '#44403c', marginBottom: '4px' }}>{group.category}</div>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                      {(group.items || []).map((skill, si) => (
                        <span key={si} style={{
                          padding: '2px 9px', borderRadius: '100px',
                          background: CORAL_PALE, color: CORAL_DARK,
                          fontSize: '7.5pt', fontWeight: 500,
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              </SectionWrapper>
            )}

            {(sections.education || []).length > 0 && (
              <SectionWrapper sectionKey="education">
              <div style={{ flex: 1, minWidth: 0 }}>
                <SectionTitle title="Education" color={CORAL} />
                {sections.education.map((edu, i) => (
                  <div key={edu.id || i} style={{ marginBottom: '10px' }}>
                    <div style={{ fontWeight: 700, fontSize: '9pt', color: '#1c1917' }}>
                      {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
                    </div>
                    <div style={{ fontSize: '8.5pt', color: CORAL, fontWeight: 500 }}>{edu.institution}</div>
                    {edu.location && <div style={{ fontSize: '7.5pt', color: '#78716c' }}>{edu.location}</div>}
                    <div style={{ fontSize: '7.5pt', color: '#78716c' }}><DateRange start={edu.startDate} end={edu.endDate} /></div>
                    {edu.gpa && <div style={{ fontSize: '7.5pt', color: '#78716c' }}>GPA: {edu.gpa}</div>}
                    {edu.description && <div style={{ fontSize: '7.5pt', color: '#78716c', marginTop: '2px' }}>{edu.description}</div>}
                  </div>
                ))}
              </div>
              </SectionWrapper>
            )}
          </div>
        )}

        {/* Projects */}
        {(sections.projects || []).length > 0 && (
          <SectionWrapper sectionKey="projects">
          <div>
            <SectionTitle title="Projects" color={CORAL} />
            {sections.projects.map((proj, i) => (
              <div key={proj.id || i} style={{ marginBottom: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '9.5pt', color: '#1c1917' }}>{proj.name}</span>
                  <span style={{ fontSize: '7.5pt', color: '#78716c' }}><DateRange start={proj.startDate} end={proj.endDate} /></span>
                </div>
                {proj.url && <div style={{ fontSize: '7.5pt', color: CORAL }}>{proj.url}</div>}
                {proj.description && <p style={{ fontSize: '8.5pt', color: '#57534e', marginTop: '3px', lineHeight: 1.55 }}>{proj.description}</p>}
                {(proj.technologies || []).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '4px' }}>
                    {proj.technologies.map((tech, ti) => (
                      <span key={ti} style={{ padding: '1px 7px', background: CORAL_LIGHT, color: CORAL_DARK, borderRadius: '4px', fontSize: '7pt', border: `1px solid ${CORAL_PALE}` }}>{tech}</span>
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

function SectionTitle({ title, color }) {
  return (
    <div style={{
      fontSize: '8pt', fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '1.5px', color,
      borderBottom: `2px solid ${color}`,
      paddingBottom: '3px', marginBottom: '10px',
    }}>
      {title}
    </div>
  );
}
