// Emerald Template — Canva-style wide teal sidebar with large avatar circle
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

const TEAL = '#047857';
const TEAL_DARK = '#065f46';
const TEAL_MID = '#059669';
const TEAL_LIGHT = 'rgba(255,255,255,0.13)';

export default function EmeraldTemplate({ resume }) {
  const sections = resume?.sections || {};
  const info = sections.personalInfo || {};
  const fullName = [info.firstName, info.lastName].filter(Boolean).join(' ') || 'Your Name';
  const initials = [info.firstName?.[0], info.lastName?.[0]].filter(Boolean).join('') || '?';
  const mostRecentJob = (sections.experience || [])[0];
  const headline = mostRecentJob ? `${mostRecentJob.title || ''}${mostRecentJob.company ? ` · ${mostRecentJob.company}` : ''}` : '';

  const contactFields = [
    info.email && { icon: '✉', val: info.email },
    info.phone && { icon: '☎', val: info.phone },
    info.location && { icon: '⌖', val: info.location },
    info.linkedin && { icon: 'in', val: info.linkedin },
    info.github && { icon: 'gh', val: info.github },
    info.website && { icon: '🌐', val: info.website },
  ].filter(Boolean);

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
      fontSize: '9.5pt', display: 'flex', minHeight: '100%',
      background: '#fff', overflowWrap: 'break-word', wordBreak: 'break-word',
    }}>
      {/* ── Sidebar ── */}
      <div style={{
        width: '210px', flexShrink: 0,
        background: `linear-gradient(175deg, ${TEAL_DARK} 0%, ${TEAL} 55%, ${TEAL_MID} 100%)`,
        padding: '28px 18px 28px',
        display: 'flex', flexDirection: 'column',
        color: '#ecfdf5', minWidth: 0,
      }}>
        {/* Avatar circle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{
            width: '76px', height: '76px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)',
            border: '3px solid rgba(255,255,255,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22pt', fontWeight: 900, color: '#fff',
            letterSpacing: '-1px', flexShrink: 0,
            marginBottom: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          }}>
            {initials}
          </div>
          <div style={{ fontSize: '13pt', fontWeight: 800, color: '#fff', textAlign: 'center', lineHeight: 1.2, marginBottom: '4px' }}>
            {fullName}
          </div>
          {headline && (
            <div style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.72)', textAlign: 'center', lineHeight: 1.35 }}>
              {headline}
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.2)', marginBottom: '16px' }} />

        {/* Contact */}
        {contactFields.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '7pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.55)', marginBottom: '8px' }}>
              Contact
            </div>
            {contactFields.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '5px' }}>
                <span style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.5)', flexShrink: 0, width: '14px', marginTop: '1px', textAlign: 'center' }}>{c.icon}</span>
                <span style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, wordBreak: 'break-all' }}>{c.val}</span>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {(sections.skills || []).length > 0 && (
          <SectionWrapper sectionKey="skills">
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '7pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.55)', marginBottom: '8px' }}>
              Skills
            </div>
            {sections.skills.map((group, i) => (
              <div key={group.id || i} style={{ marginBottom: '8px' }}>
                {group.category && (
                  <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', fontStyle: 'italic' }}>{group.category}</div>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                  {(group.items || []).map((skill, si) => (
                    <span key={si} style={{
                      padding: '2px 8px', borderRadius: '100px',
                      background: 'rgba(255,255,255,0.14)',
                      border: '1px solid rgba(255,255,255,0.22)',
                      fontSize: '7pt', color: '#d1fae5', fontWeight: 500,
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

        {/* Education */}
        {(sections.education || []).length > 0 && (
          <SectionWrapper sectionKey="education">
          <div>
            <div style={{ fontSize: '7pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.55)', marginBottom: '8px' }}>
              Education
            </div>
            {sections.education.map((edu, i) => (
              <div key={edu.id || i} style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '8pt', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
                  {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
                </div>
                <div style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.7)' }}>{edu.institution}</div>
                {edu.location && <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.5)' }}>{edu.location}</div>}
                <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.5)' }}>
                  <DateRange start={edu.startDate} end={edu.endDate} />
                </div>
                {edu.gpa && <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.5)' }}>GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
          </SectionWrapper>
        )}
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, padding: '28px 26px 28px 22px', minWidth: 0 }}>
        {/* Summary */}
        {sections.summary && (
          <SectionWrapper sectionKey="summary">
          <div style={{ marginBottom: '18px' }}>
            <div style={{
              fontSize: '7.5pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px',
              color: TEAL, marginBottom: '6px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              About Me
              <div style={{ flex: 1, height: '1.5px', background: `linear-gradient(to right, ${TEAL}50, transparent)` }} />
            </div>
            <p style={{ fontSize: '9pt', color: '#374151', lineHeight: 1.7 }}>{sections.summary}</p>
          </div>
          </SectionWrapper>
        )}

        {/* Experience */}
        {(sections.experience || []).length > 0 && (
          <SectionWrapper sectionKey="experience">
          <div style={{ marginBottom: '18px' }}>
            <div style={{
              fontSize: '7.5pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px',
              color: TEAL, marginBottom: '10px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              Experience
              <div style={{ flex: 1, height: '1.5px', background: `linear-gradient(to right, ${TEAL}50, transparent)` }} />
            </div>
            {sections.experience.map((exp, i) => (
              <div key={exp.id || i} style={{ marginBottom: '13px', paddingLeft: '10px', borderLeft: `2px solid ${TEAL}40` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px', marginBottom: '2px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '10pt', color: '#111827' }}>{exp.title}</div>
                    <div style={{ fontSize: '8.5pt', color: TEAL, fontWeight: 600 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                  </div>
                  <div style={{ fontSize: '7.5pt', color: '#6b7280', flexShrink: 0 }}>
                    <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
                  </div>
                </div>
                {exp.description && (
                  <div style={{ fontSize: '8.5pt', color: '#4b5563', whiteSpace: 'pre-line', lineHeight: 1.6, marginTop: '3px' }}>
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
          </SectionWrapper>
        )}

        {/* Projects */}
        {(sections.projects || []).length > 0 && (
          <SectionWrapper sectionKey="projects">
          <div style={{ marginBottom: '18px' }}>
            <div style={{
              fontSize: '7.5pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px',
              color: TEAL, marginBottom: '10px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              Projects
              <div style={{ flex: 1, height: '1.5px', background: `linear-gradient(to right, ${TEAL}50, transparent)` }} />
            </div>
            {sections.projects.map((proj, i) => (
              <div key={proj.id || i} style={{ marginBottom: '11px', paddingLeft: '10px', borderLeft: `2px solid ${TEAL}40` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '9.5pt', color: '#111827' }}>{proj.name}</span>
                  <span style={{ fontSize: '7.5pt', color: '#6b7280' }}><DateRange start={proj.startDate} end={proj.endDate} /></span>
                </div>
                {proj.url && <div style={{ fontSize: '7.5pt', color: TEAL_MID }}>{proj.url}</div>}
                {proj.description && <p style={{ fontSize: '8.5pt', color: '#4b5563', marginTop: '3px', lineHeight: 1.55 }}>{proj.description}</p>}
                {(proj.technologies || []).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '4px' }}>
                    {proj.technologies.map((tech, ti) => (
                      <span key={ti} style={{ padding: '1px 7px', background: '#ecfdf5', color: TEAL_DARK, borderRadius: '4px', fontSize: '7pt', border: `1px solid ${TEAL}30` }}>{tech}</span>
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
