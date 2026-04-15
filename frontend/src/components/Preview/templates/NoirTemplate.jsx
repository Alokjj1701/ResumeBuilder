// Noir Template — dark slate header with rose/crimson accent, elegant monochrome body
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

const SLATE = '#1e293b';
const SLATE_DEEP = '#0f172a';
const SLATE_MID = '#334155';
const ROSE = '#e11d48';
const ROSE_LIGHT = '#fff1f2';
const ROSE_PALE = '#fecdd3';

export default function NoirTemplate({ resume }) {
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
      fontSize: '9.5pt', color: '#1e293b',
      background: '#fff', minHeight: '100%',
      overflowWrap: 'break-word', wordBreak: 'break-word',
    }}>
      {/* ── Header ── */}
      <div style={{
        background: `linear-gradient(135deg, ${SLATE_DEEP} 0%, ${SLATE} 70%, ${SLATE_MID} 100%)`,
        padding: '0',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Rose accent bar at top */}
        <div style={{ height: '4px', background: `linear-gradient(90deg, ${ROSE}, #fb7185, ${ROSE})` }} />

        {/* Subtle grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        <div style={{ padding: '24px 36px 22px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            {/* Avatar */}
            <div style={{
              width: '64px', height: '64px', borderRadius: '12px',
              background: `linear-gradient(135deg, ${ROSE} 0%, #fb7185 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18pt', fontWeight: 900, color: '#fff',
              flexShrink: 0, boxShadow: '0 4px 20px rgba(225,29,72,0.4)',
              letterSpacing: '-1px',
            }}>
              {initials}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '22pt', fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.5px', marginBottom: '2px' }}>
                {fullName}
              </div>
              {headline && (
                <div style={{ fontSize: '9.5pt', color: '#fb7185', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.3px' }}>
                  {headline}
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 0' }}>
                {contactItems.map((item, i) => (
                  <span key={i} style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.65)', marginRight: '14px' }}>
                    {item}
                  </span>
                ))}
                {linkItems.map((item, i) => (
                  <span key={i} style={{ fontSize: '7.5pt', color: 'rgba(251,113,133,0.75)', marginRight: '14px' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rose accent bar at bottom */}
        <div style={{ height: '2px', background: `linear-gradient(90deg, ${ROSE}80, transparent)` }} />
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '20px 36px 28px' }}>
        {/* Summary */}
        {sections.summary && (
          <SectionWrapper sectionKey="summary">
          <div style={{ marginBottom: '18px' }}>
            <SectionTitle title="Profile" color={ROSE} />
            <p style={{ fontSize: '9pt', color: '#475569', lineHeight: 1.7 }}>{sections.summary}</p>
          </div>
          </SectionWrapper>
        )}

        {/* Experience */}
        {(sections.experience || []).length > 0 && (
          <SectionWrapper sectionKey="experience">
          <div style={{ marginBottom: '18px' }}>
            <SectionTitle title="Experience" color={ROSE} />
            {sections.experience.map((exp, i) => (
              <div key={exp.id || i} style={{ marginBottom: '14px', position: 'relative', paddingLeft: '14px' }}>
                {/* Rose dot */}
                <div style={{
                  position: 'absolute', left: '0', top: '6px',
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: ROSE, flexShrink: 0,
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '10pt', color: SLATE_DEEP }}>{exp.title}</div>
                    <div style={{ fontSize: '8.5pt', color: SLATE_MID, fontWeight: 600 }}>
                      {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '7.5pt', color: ROSE,
                    background: ROSE_LIGHT, border: `1px solid ${ROSE_PALE}`,
                    padding: '2px 8px', borderRadius: '6px', flexShrink: 0, fontWeight: 600,
                  }}>
                    <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
                  </div>
                </div>
                {exp.description && (
                  <div style={{ fontSize: '8.5pt', color: '#64748b', whiteSpace: 'pre-line', lineHeight: 1.6, marginTop: '4px' }}>
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
          <div style={{ display: 'flex', gap: '24px', marginBottom: '18px' }}>
            {(sections.skills || []).length > 0 && (
              <SectionWrapper sectionKey="skills">
              <div style={{ flex: 1, minWidth: 0 }}>
                <SectionTitle title="Skills" color={ROSE} />
                {sections.skills.map((group, i) => (
                  <div key={group.id || i} style={{ marginBottom: '8px' }}>
                    {group.category && (
                      <div style={{ fontSize: '7.5pt', fontWeight: 700, color: SLATE_MID, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {group.category}
                      </div>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                      {(group.items || []).map((skill, si) => (
                        <span key={si} style={{
                          padding: '2px 9px', borderRadius: '4px',
                          background: '#f1f5f9',
                          border: '1px solid #e2e8f0',
                          color: SLATE,
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
                <SectionTitle title="Education" color={ROSE} />
                {sections.education.map((edu, i) => (
                  <div key={edu.id || i} style={{ marginBottom: '10px' }}>
                    <div style={{ fontWeight: 700, fontSize: '9pt', color: SLATE_DEEP }}>
                      {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
                    </div>
                    <div style={{ fontSize: '8.5pt', color: ROSE, fontWeight: 500 }}>{edu.institution}</div>
                    {edu.location && <div style={{ fontSize: '7.5pt', color: '#94a3b8' }}>{edu.location}</div>}
                    <div style={{ fontSize: '7.5pt', color: '#94a3b8' }}><DateRange start={edu.startDate} end={edu.endDate} /></div>
                    {edu.gpa && <div style={{ fontSize: '7.5pt', color: '#94a3b8' }}>GPA: {edu.gpa}</div>}
                    {edu.description && <div style={{ fontSize: '7.5pt', color: '#94a3b8', marginTop: '2px' }}>{edu.description}</div>}
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
            <SectionTitle title="Projects" color={ROSE} />
            {sections.projects.map((proj, i) => (
              <div key={proj.id || i} style={{ marginBottom: '12px', paddingLeft: '14px', position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: '0', top: '6px',
                  width: '6px', height: '6px', borderRadius: '2px',
                  background: ROSE,
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '9.5pt', color: SLATE_DEEP }}>{proj.name}</span>
                  <span style={{ fontSize: '7.5pt', color: '#94a3b8' }}><DateRange start={proj.startDate} end={proj.endDate} /></span>
                </div>
                {proj.url && <div style={{ fontSize: '7.5pt', color: ROSE }}>{proj.url}</div>}
                {proj.description && <p style={{ fontSize: '8.5pt', color: '#64748b', marginTop: '3px', lineHeight: 1.55 }}>{proj.description}</p>}
                {(proj.technologies || []).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '4px' }}>
                    {proj.technologies.map((tech, ti) => (
                      <span key={ti} style={{
                        padding: '1px 7px', background: ROSE_LIGHT, color: ROSE,
                        borderRadius: '4px', fontSize: '7pt', border: `1px solid ${ROSE_PALE}`,
                        fontWeight: 500,
                      }}>{tech}</span>
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
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
      <div style={{
        fontSize: '8pt', fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '1.5px', color, whiteSpace: 'nowrap',
      }}>
        {title}
      </div>
      <div style={{ flex: 1, height: '1.5px', background: `linear-gradient(to right, ${color}60, transparent)` }} />
    </div>
  );
}
