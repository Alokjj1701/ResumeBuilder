// Sage Template — inspired by "IT Manager CV Resume" (Catrine Ziv)
import SectionWrapper from '../SectionWrapper';
// Sage/olive left sidebar with photo + profile/skills/awards · Large display name top-right · Footer contact bar

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

const SAGE = '#6b7c6e';
const SAGE_DARK = '#4a5c4d';
const SAGE_LIGHT = '#f2f4f2';
const SAGE_MID = '#7d917f';

function SidebarSection({ title }) {
  return (
    <div style={{
      fontSize: '7pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px',
      color: 'rgba(255,255,255,0.55)', marginBottom: '7px',
      borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '4px',
    }}>
      {title}
    </div>
  );
}

function MainSection({ title }) {
  return (
    <div style={{ marginBottom: '11px' }}>
      <div style={{
        fontSize: '9.5pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px',
        color: SAGE_DARK, marginBottom: '4px',
      }}>
        {title}
      </div>
      <div style={{ height: '1.5px', background: SAGE_DARK }} />
    </div>
  );
}

export default function SageTemplate({ resume }) {
  const sections = resume?.sections || {};
  const info = sections.personalInfo || {};
  const fullName = [info.firstName, info.lastName].filter(Boolean).join(' ') || 'Your Name';
  const initials = [info.firstName?.[0], info.lastName?.[0]].filter(Boolean).join('') || '?';
  const mostRecentJob = (sections.experience || [])[0];
  const headline = mostRecentJob?.title || info.email?.split('@')[0] || '';

  const contactItems = [
    info.phone && { icon: '☎', val: info.phone },
    info.email && { icon: '✉', val: info.email },
    info.website && { icon: '🌐', val: info.website },
    info.linkedin && { icon: '🔗', val: info.linkedin },
    info.github && { icon: '⌨', val: info.github },
    info.location && { icon: '⌖', val: info.location },
  ].filter(Boolean);

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
      fontSize: '9.5pt', color: '#1f2937',
      background: '#fff', minHeight: '100%',
      display: 'flex', flexDirection: 'column',
      overflowWrap: 'break-word', wordBreak: 'break-word',
    }}>
      <div style={{ display: 'flex', flex: 1 }}>
        {/* ── Sidebar ── */}
        <div style={{
          width: '200px', flexShrink: 0,
          background: `linear-gradient(175deg, ${SAGE_DARK} 0%, ${SAGE} 60%, ${SAGE_MID} 100%)`,
          display: 'flex', flexDirection: 'column',
          position: 'relative',
        }}>
          {/* Photo area */}
          <div style={{
            width: '100%', aspectRatio: '1 / 1',
            maxHeight: '200px',
            overflow: 'hidden', flexShrink: 0,
            background: 'rgba(0,0,0,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {info.photo ? (
              <img src={info.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
            ) : (
              <span style={{ fontSize: '36pt', fontWeight: 900, color: 'rgba(255,255,255,0.4)' }}>{initials}</span>
            )}
          </div>

          <div style={{ padding: '18px 16px 24px', flex: 1 }}>
            {/* Profile / Summary in sidebar */}
            {sections.summary && (
              <SectionWrapper sectionKey="summary">
              <div style={{ marginBottom: '18px' }}>
                <SidebarSection title="Profile" />
                <p style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7 }}>
                  {sections.summary}
                </p>
              </div>
              </SectionWrapper>
            )}

            {/* Skills */}
            {(sections.skills || []).length > 0 && (
              <SectionWrapper sectionKey="skills">
              <div style={{ marginBottom: '18px' }}>
                <SidebarSection title="Skills" />
                {sections.skills.map((group, i) => (
                  <div key={group.id || i} style={{ marginBottom: '6px' }}>
                    {group.category && (
                      <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', marginBottom: '3px' }}>{group.category}</div>
                    )}
                    {(group.items || []).map((skill, si) => (
                      <div key={si} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.6)', flexShrink: 0, display: 'block' }} />
                        <span style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.85)' }}>{skill}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              </SectionWrapper>
            )}

            {/* Education in sidebar (compact) */}
            {(sections.education || []).length > 0 && (
              <SectionWrapper sectionKey="education">
              <div>
                <SidebarSection title="Education" />
                {sections.education.map((edu, i) => (
                  <div key={edu.id || i} style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '7.5pt', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
                      {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
                    </div>
                    <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.72)', fontStyle: 'italic' }}>
                      {edu.institution}
                      {(edu.startDate || edu.endDate) && (
                        <> · <DateRange start={edu.startDate} end={edu.endDate} /></>
                      )}
                    </div>
                    {edu.gpa && <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.5)' }}>GPA: {edu.gpa}</div>}
                  </div>
                ))}
              </div>
              </SectionWrapper>
            )}
          </div>
        </div>

        {/* ── Main Content ── */}
        <div style={{ flex: 1, minWidth: 0, padding: '28px 28px 24px 24px', display: 'flex', flexDirection: 'column' }}>
          {/* Name block — large display */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '28pt', fontWeight: 900, color: '#1f2937', lineHeight: 1, letterSpacing: '-1px', marginBottom: '4px' }}>
              {fullName}
            </div>
            {headline && (
              <div style={{ fontSize: '9pt', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2.5px', color: SAGE, marginBottom: '0' }}>
                {headline}
              </div>
            )}
          </div>

          {/* Experience */}
          {(sections.experience || []).length > 0 && (
            <SectionWrapper sectionKey="experience">
            <div style={{ marginBottom: '18px' }}>
              <MainSection title="Work Experience" />
              {sections.experience.map((exp, i) => (
                <div key={exp.id || i} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ fontWeight: 700, fontSize: '10pt', color: '#111827' }}>{exp.title}</div>
                    <div style={{ fontSize: '8pt', color: '#6b7280', flexShrink: 0, fontStyle: 'italic' }}>
                      <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
                    </div>
                  </div>
                  <div style={{ fontSize: '8.5pt', color: SAGE, fontWeight: 600, marginBottom: '3px' }}>
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
            </SectionWrapper>
          )}

          {/* Projects */}
          {(sections.projects || []).length > 0 && (
            <SectionWrapper sectionKey="projects">
            <div style={{ marginBottom: '18px' }}>
              <MainSection title="Projects" />
              {sections.projects.map((proj, i) => (
                <div key={proj.id || i} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '9.5pt', color: '#111827' }}>{proj.name}</span>
                    <span style={{ fontSize: '8pt', color: '#6b7280', fontStyle: 'italic' }}><DateRange start={proj.startDate} end={proj.endDate} /></span>
                  </div>
                  {proj.url && <div style={{ fontSize: '7.5pt', color: SAGE }}>{proj.url}</div>}
                  {proj.description && <p style={{ fontSize: '8.5pt', color: '#4b5563', lineHeight: 1.6, marginTop: '2px' }}>{proj.description}</p>}
                  {(proj.technologies || []).length > 0 && (
                    <div style={{ fontSize: '7.5pt', color: '#6b7280', marginTop: '3px' }}>
                      {proj.technologies.join(' · ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
            </SectionWrapper>
          )}
        </div>
      </div>

      {/* ── Footer contact bar ── */}
      {contactItems.length > 0 && (
        <div style={{
          background: SAGE_DARK,
          padding: '10px 28px',
          display: 'flex', flexWrap: 'wrap', gap: '4px 20px', alignItems: 'center',
        }}>
          {contactItems.map((c, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '7.5pt', color: 'rgba(255,255,255,0.78)' }}>
              <span style={{ fontSize: '8pt' }}>{c.icon}</span>
              {c.val}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
