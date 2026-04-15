// Slate Template — inspired by "Black and White Simple Infographic Resume" (Daniel Gallego)
import SectionWrapper from '../SectionWrapper';
// Clean header · light gray rounded-rectangle section bands · 3-col skills grid · italic section labels

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

const BAND_BG = '#e8e8e8';
const BAND_TEXT = '#374151';
const ACCENT = '#1f2937';

function SectionBand({ title }) {
  return (
    <div style={{
      background: BAND_BG,
      borderRadius: '6px',
      padding: '5px 14px',
      marginBottom: '12px',
      display: 'inline-block',
    }}>
      <span style={{
        fontSize: '8.5pt', fontStyle: 'italic', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '1px',
        color: BAND_TEXT,
      }}>
        {title}
      </span>
    </div>
  );
}

export default function SlateTemplate({ resume }) {
  const sections = resume?.sections || {};
  const info = sections.personalInfo || {};
  const fullName = [info.firstName, info.lastName].filter(Boolean).join(' ') || 'Your Name';
  const initials = [info.firstName?.[0], info.lastName?.[0]].filter(Boolean).join('') || '?';
  const mostRecentJob = (sections.experience || [])[0];
  const headline = mostRecentJob?.title || '';

  const contactParts = [info.location, info.email, info.phone, info.website, info.linkedin].filter(Boolean);

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
      fontSize: '9.5pt', color: '#1f2937',
      background: '#fff', minHeight: '100%',
      padding: '36px 40px',
      overflowWrap: 'break-word', wordBreak: 'break-word',
    }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '2px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '22pt', fontWeight: 900, color: ACCENT, lineHeight: 1, letterSpacing: '-0.5px', marginBottom: '4px' }}>
              {fullName}
            </div>
            {headline && (
              <div style={{ fontSize: '9pt', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                {headline}
              </div>
            )}
          </div>
          {/* Photo or initials circle */}
          {info.photo ? (
            <div style={{
              width: '70px', height: '70px', borderRadius: '50%',
              overflow: 'hidden', flexShrink: 0,
              border: '2px solid #e5e7eb',
            }}>
              <img src={info.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{
              width: '70px', height: '70px', borderRadius: '50%',
              background: '#e5e7eb', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18pt', fontWeight: 700, color: '#9ca3af',
            }}>
              {initials}
            </div>
          )}
        </div>

        {/* Contact strip */}
        {contactParts.length > 0 && (
          <div style={{ fontSize: '8pt', color: '#6b7280', marginTop: '6px' }}>
            {contactParts.join('  |  ')}
          </div>
        )}
      </div>

      {/* ── Summary ── */}
      {sections.summary && (
        <SectionWrapper sectionKey="summary">
        <div style={{ marginBottom: '16px' }}>
          <SectionBand title="Summary" />
          <p style={{ fontSize: '9pt', color: '#374151', lineHeight: 1.75 }}>{sections.summary}</p>
        </div>
        </SectionWrapper>
      )}

      {/* ── Skills — 3-column grid ── */}
      {(sections.skills || []).length > 0 && (
        <SectionWrapper sectionKey="skills">
        <div style={{ marginBottom: '16px' }}>
          <SectionBand title="Technical Skills" />
          {sections.skills.map((group, gi) => (
            <div key={group.id || gi} style={{ marginBottom: '8px' }}>
              {group.category && (
                <div style={{ fontSize: '8pt', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>{group.category}</div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px 16px' }}>
                {(group.items || []).map((skill, si) => (
                  <div key={si} style={{ fontSize: '8.5pt', color: '#374151', display: 'flex', alignItems: 'center', gap: '5px', padding: '1px 0' }}>
                    <span style={{ color: '#9ca3af', fontSize: '9pt', flexShrink: 0 }}>•</span> {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        </SectionWrapper>
      )}

      {/* ── Experience ── */}
      {(sections.experience || []).length > 0 && (
        <SectionWrapper sectionKey="experience">
        <div style={{ marginBottom: '16px' }}>
          <SectionBand title="Professional Experience" />
          {sections.experience.map((exp, i) => (
            <div key={exp.id || i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px', marginBottom: '1px' }}>
                <span style={{ fontWeight: 700, fontSize: '10pt', color: ACCENT }}>{exp.company ? `${exp.company}` : ''}</span>
                <span style={{ fontSize: '8pt', color: '#6b7280', flexShrink: 0 }}>
                  <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
                </span>
              </div>
              <div style={{ fontSize: '9pt', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                {exp.title}{exp.location ? ` · ${exp.location}` : ''}
              </div>
              {exp.description && (
                <div style={{ fontSize: '8.5pt', color: '#4b5563', whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                  {/* Render each line as a bullet if starts with - or • */}
                  {exp.description.split('\n').map((line, li) => {
                    const clean = line.replace(/^[-•]\s*/, '').trim();
                    if (!clean) return null;
                    return (
                      <div key={li} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '2px' }}>
                        <span style={{ color: '#9ca3af', flexShrink: 0, marginTop: '1px' }}>•</span>
                        <span>{clean}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
        </SectionWrapper>
      )}

      {/* ── Education ── */}
      {(sections.education || []).length > 0 && (
        <SectionWrapper sectionKey="education">
        <div style={{ marginBottom: '16px' }}>
          <SectionBand title="Education" />
          {sections.education.map((edu, i) => (
            <div key={edu.id || i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '9.5pt', color: ACCENT }}>
                  {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
                </span>
                <span style={{ fontSize: '8pt', color: '#6b7280', flexShrink: 0 }}>
                  <DateRange start={edu.startDate} end={edu.endDate} />
                </span>
              </div>
              <div style={{ fontSize: '8.5pt', color: '#6b7280' }}>
                {edu.institution}{edu.location ? ` · ${edu.location}` : ''}
              </div>
              {edu.gpa && <div style={{ fontSize: '8pt', color: '#6b7280', fontStyle: 'italic' }}>GPA: {edu.gpa}</div>}
              {edu.description && (
                <div style={{ fontSize: '8.5pt', color: '#4b5563', lineHeight: 1.6, marginTop: '3px' }}>
                  {edu.description.split('\n').map((line, li) => {
                    const clean = line.replace(/^[-•]\s*/, '').trim();
                    if (!clean) return null;
                    return (
                      <div key={li} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '2px' }}>
                        <span style={{ color: '#9ca3af', flexShrink: 0, marginTop: '1px' }}>•</span>
                        <span>{clean}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
        </SectionWrapper>
      )}

      {/* ── Projects ── */}
      {(sections.projects || []).length > 0 && (
        <SectionWrapper sectionKey="projects">
        <div style={{ marginBottom: '16px' }}>
          <SectionBand title="Projects" />
          {sections.projects.map((proj, i) => (
            <div key={proj.id || i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '9.5pt', color: ACCENT }}>{proj.name}</span>
                <span style={{ fontSize: '8pt', color: '#6b7280', flexShrink: 0 }}><DateRange start={proj.startDate} end={proj.endDate} /></span>
              </div>
              {proj.url && <div style={{ fontSize: '7.5pt', color: '#6b7280' }}>{proj.url}</div>}
              {proj.description && <p style={{ fontSize: '8.5pt', color: '#4b5563', lineHeight: 1.65, marginTop: '3px' }}>{proj.description}</p>}
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
  );
}
