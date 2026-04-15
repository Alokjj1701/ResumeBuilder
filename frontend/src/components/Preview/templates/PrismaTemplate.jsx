// Prisma Template — bold wide violet/indigo left panel with stacked info, clean white right
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

const VIOLET = '#7c3aed';
const VIOLET_DARK = '#5b21b6';
const VIOLET_MID = '#8b5cf6';
const VIOLET_LIGHT = '#f5f3ff';
const VIOLET_PALE = '#ddd6fe';

export default function PrismaTemplate({ resume }) {
  const sections = resume?.sections || {};
  const info = sections.personalInfo || {};
  const fullName = [info.firstName, info.lastName].filter(Boolean).join(' ') || 'Your Name';
  const initials = [info.firstName?.[0], info.lastName?.[0]].filter(Boolean).join('') || '?';
  const mostRecentJob = (sections.experience || [])[0];
  const headline = mostRecentJob?.title || '';

  const contactFields = [
    info.email && { label: 'Email', val: info.email },
    info.phone && { label: 'Phone', val: info.phone },
    info.location && { label: 'Location', val: info.location },
    info.linkedin && { label: 'LinkedIn', val: info.linkedin },
    info.github && { label: 'GitHub', val: info.github },
    info.website && { label: 'Website', val: info.website },
  ].filter(Boolean);

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
      fontSize: '9.5pt', display: 'flex', minHeight: '100%',
      background: '#fff', overflowWrap: 'break-word', wordBreak: 'break-word',
    }}>
      {/* ── Left Panel ── */}
      <div style={{
        width: '220px', flexShrink: 0,
        background: `linear-gradient(160deg, ${VIOLET_DARK} 0%, ${VIOLET} 50%, ${VIOLET_MID} 100%)`,
        padding: '0',
        display: 'flex', flexDirection: 'column',
        color: '#ede9fe', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative arc */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          position: 'absolute', bottom: '40px', left: '-40px',
          width: '120px', height: '120px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />

        {/* Top accent stripe */}
        <div style={{ height: '5px', background: 'rgba(255,255,255,0.25)' }} />

        <div style={{ padding: '24px 18px 28px', flex: 1, position: 'relative', zIndex: 1 }}>
          {/* Avatar + Name */}
          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              border: '3px solid rgba(255,255,255,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24pt', fontWeight: 900, color: '#fff',
              letterSpacing: '-1px', marginBottom: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            }}>
              {initials}
            </div>
            <div style={{ fontSize: '12pt', fontWeight: 800, color: '#fff', textAlign: 'center', lineHeight: 1.2, marginBottom: '4px' }}>
              {fullName}
            </div>
            {headline && (
              <div style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.68)', textAlign: 'center', lineHeight: 1.35 }}>
                {headline}
              </div>
            )}
          </div>

          <PanelDivider />

          {/* Contact */}
          {contactFields.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <PanelSection title="Contact" />
              {contactFields.map((c, i) => (
                <div key={i} style={{ marginBottom: '6px' }}>
                  <div style={{ fontSize: '6.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.45)', marginBottom: '1px' }}>
                    {c.label}
                  </div>
                  <div style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.82)', wordBreak: 'break-all', lineHeight: 1.4 }}>
                    {c.val}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {(sections.skills || []).length > 0 && (
            <SectionWrapper sectionKey="skills">
            <div style={{ marginBottom: '18px' }}>
              <PanelSection title="Skills" />
              {sections.skills.map((group, i) => (
                <div key={group.id || i} style={{ marginBottom: '9px' }}>
                  {group.category && (
                    <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', fontStyle: 'italic' }}>
                      {group.category}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                    {(group.items || []).map((skill, si) => (
                      <span key={si} style={{
                        padding: '2px 9px', borderRadius: '100px',
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        fontSize: '7pt', color: '#ede9fe', fontWeight: 500,
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
              <PanelSection title="Education" />
              {sections.education.map((edu, i) => (
                <div key={edu.id || i} style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '8pt', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
                  </div>
                  <div style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.72)' }}>{edu.institution}</div>
                  {edu.location && <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.48)' }}>{edu.location}</div>}
                  <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.48)' }}>
                    <DateRange start={edu.startDate} end={edu.endDate} />
                  </div>
                  {edu.gpa && <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.48)' }}>GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
            </SectionWrapper>
          )}
        </div>
      </div>

      {/* ── Right / Main Content ── */}
      <div style={{ flex: 1, padding: '28px 24px 28px 22px', minWidth: 0 }}>
        {/* Summary */}
        {sections.summary && (
          <SectionWrapper sectionKey="summary">
          <div style={{ marginBottom: '18px' }}>
            <MainSectionTitle title="About" color={VIOLET} />
            <div style={{
              padding: '10px 14px',
              background: VIOLET_LIGHT,
              borderRadius: '8px',
              borderLeft: `3px solid ${VIOLET}`,
            }}>
              <p style={{ fontSize: '9pt', color: '#374151', lineHeight: 1.7, margin: 0 }}>{sections.summary}</p>
            </div>
          </div>
          </SectionWrapper>
        )}

        {/* Experience */}
        {(sections.experience || []).length > 0 && (
          <SectionWrapper sectionKey="experience">
          <div style={{ marginBottom: '18px' }}>
            <MainSectionTitle title="Work Experience" color={VIOLET} />
            {sections.experience.map((exp, i) => (
              <div key={exp.id || i} style={{
                marginBottom: '14px',
                paddingLeft: '12px',
                borderLeft: `2px solid ${VIOLET_PALE}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '10pt', color: '#111827' }}>{exp.title}</div>
                    <div style={{ fontSize: '8.5pt', color: VIOLET, fontWeight: 600 }}>
                      {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '7.5pt', color: VIOLET_DARK,
                    background: VIOLET_LIGHT, border: `1px solid ${VIOLET_PALE}`,
                    padding: '2px 8px', borderRadius: '100px', flexShrink: 0, fontWeight: 600,
                  }}>
                    <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
                  </div>
                </div>
                {exp.description && (
                  <div style={{ fontSize: '8.5pt', color: '#4b5563', whiteSpace: 'pre-line', lineHeight: 1.6, marginTop: '4px' }}>
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
          <div>
            <MainSectionTitle title="Projects" color={VIOLET} />
            {sections.projects.map((proj, i) => (
              <div key={proj.id || i} style={{
                marginBottom: '12px',
                paddingLeft: '12px',
                borderLeft: `2px solid ${VIOLET_PALE}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '9.5pt', color: '#111827' }}>{proj.name}</span>
                  <span style={{ fontSize: '7.5pt', color: '#6b7280' }}><DateRange start={proj.startDate} end={proj.endDate} /></span>
                </div>
                {proj.url && <div style={{ fontSize: '7.5pt', color: VIOLET_MID }}>{proj.url}</div>}
                {proj.description && <p style={{ fontSize: '8.5pt', color: '#4b5563', marginTop: '3px', lineHeight: 1.55 }}>{proj.description}</p>}
                {(proj.technologies || []).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '4px' }}>
                    {proj.technologies.map((tech, ti) => (
                      <span key={ti} style={{
                        padding: '1px 7px', background: VIOLET_LIGHT, color: VIOLET_DARK,
                        borderRadius: '4px', fontSize: '7pt', border: `1px solid ${VIOLET_PALE}`,
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

function PanelDivider() {
  return <div style={{ height: '1px', background: 'rgba(255,255,255,0.18)', margin: '0 0 16px' }} />;
}

function PanelSection({ title }) {
  return (
    <div style={{ fontSize: '7pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
      {title}
    </div>
  );
}

function MainSectionTitle({ title, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
      <div style={{
        fontSize: '8pt', fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '1.5px', color, whiteSpace: 'nowrap',
      }}>
        {title}
      </div>
      <div style={{ flex: 1, height: '1.5px', background: `linear-gradient(to right, ${color}50, transparent)` }} />
    </div>
  );
}
