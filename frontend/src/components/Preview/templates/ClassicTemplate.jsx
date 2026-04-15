// Classic Template — inspired by "Black & White Clean Professional A4 Resume"
import SectionWrapper from '../SectionWrapper';
// Photo top-left · bold name + subtitle · icon contact row · date-column sections

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

// Tiny icon components (inline SVG paths)
function PhoneIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16" /></svg>;
}
function MailIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
}
function GlobeIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
}

function Hr() {
  return <div style={{ height: '1px', background: '#d1d5db', margin: '10px 0' }} />;
}

function SectionTitle({ title }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ fontSize: '9.5pt', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>{title}</div>
      <div style={{ height: '1.5px', background: '#111827' }} />
    </div>
  );
}

export default function ClassicTemplate({ resume }) {
  const sections = resume?.sections || {};
  const info = sections.personalInfo || {};
  const fullName = [info.firstName, info.lastName].filter(Boolean).join(' ') || 'Your Name';
  const initials = [info.firstName?.[0], info.lastName?.[0]].filter(Boolean).join('') || '?';
  const mostRecentJob = (sections.experience || [])[0];
  const headline = mostRecentJob?.title || '';

  return (
    <div style={{
      fontFamily: '"Georgia", "Times New Roman", serif',
      fontSize: '9.5pt', color: '#111827',
      background: '#fff', minHeight: '100%',
      overflowWrap: 'break-word', wordBreak: 'break-word',
      padding: '36px 40px',
    }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '18px', alignItems: 'flex-start' }}>
        {/* Photo */}
        <div style={{
          width: '90px', height: '90px', flexShrink: 0,
          borderRadius: '4px', overflow: 'hidden',
          background: '#e5e7eb',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {info.photo ? (
            <img src={info.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '20pt', fontWeight: 700, color: '#9ca3af' }}>{initials}</span>
          )}
        </div>

        {/* Name + contact */}
        <div style={{ flex: 1, paddingTop: '4px' }}>
          <div style={{ fontSize: '24pt', fontWeight: 900, color: '#111827', lineHeight: 1, letterSpacing: '-0.5px', marginBottom: '4px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {fullName}
          </div>
          {headline && (
            <div style={{ fontSize: '10pt', color: '#4b5563', marginBottom: '10px', fontFamily: 'system-ui, sans-serif', fontWeight: 400 }}>
              {headline}
            </div>
          )}
          <div style={{ height: '1px', background: '#d1d5db', marginBottom: '8px' }} />
          {/* Contact icons row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', alignItems: 'center' }}>
            {info.phone && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '8pt', color: '#374151', fontFamily: 'system-ui, sans-serif' }}>
                <PhoneIcon /> {info.phone}
              </span>
            )}
            {info.email && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '8pt', color: '#374151', fontFamily: 'system-ui, sans-serif' }}>
                <MailIcon /> {info.email}
              </span>
            )}
            {(info.website || info.linkedin || info.github) && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '8pt', color: '#374151', fontFamily: 'system-ui, sans-serif' }}>
                <GlobeIcon /> {info.website || info.linkedin || info.github}
              </span>
            )}
            {info.location && (
              <span style={{ fontSize: '8pt', color: '#374151', fontFamily: 'system-ui, sans-serif' }}>
                {info.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Summary / About Me ── */}
      {sections.summary && (
        <SectionWrapper sectionKey="summary">
        <div style={{ marginBottom: '16px' }}>
          <SectionTitle title="About Me" />
          <p style={{ fontSize: '9pt', color: '#374151', lineHeight: 1.75, fontFamily: 'system-ui, sans-serif' }}>
            {sections.summary}
          </p>
        </div>
        </SectionWrapper>
      )}

      {/* ── Education ── */}
      {(sections.education || []).length > 0 && (
        <SectionWrapper sectionKey="education">
        <div style={{ marginBottom: '16px' }}>
          <SectionTitle title="Education" />
          {sections.education.map((edu, i) => (
            <div key={edu.id || i} style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
              {/* Date + institution column */}
              <div style={{ width: '130px', flexShrink: 0 }}>
                <div style={{ fontSize: '8pt', color: '#6b7280', fontFamily: 'system-ui, sans-serif', lineHeight: 1.4 }}>
                  <DateRange start={edu.startDate} end={edu.endDate} />
                </div>
                <div style={{ fontSize: '8pt', color: '#6b7280', fontFamily: 'system-ui, sans-serif', lineHeight: 1.4 }}>
                  {edu.institution}
                </div>
              </div>
              {/* Content column */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9.5pt', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>
                  {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
                </div>
                {edu.gpa && <div style={{ fontSize: '8pt', color: '#6b7280', fontFamily: 'system-ui, sans-serif' }}>GPA: {edu.gpa}</div>}
                {edu.description && (
                  <div style={{ fontSize: '8.5pt', color: '#4b5563', fontFamily: 'system-ui, sans-serif', lineHeight: 1.65, marginTop: '3px' }}>
                    {edu.description}
                  </div>
                )}
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
          <SectionTitle title="Experience" />
          {sections.experience.map((exp, i) => (
            <div key={exp.id || i} style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
              {/* Date + company column */}
              <div style={{ width: '130px', flexShrink: 0 }}>
                <div style={{ fontSize: '8pt', color: '#6b7280', fontFamily: 'system-ui, sans-serif', lineHeight: 1.4 }}>
                  <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
                </div>
                <div style={{ fontSize: '8pt', color: '#6b7280', fontFamily: 'system-ui, sans-serif', lineHeight: 1.4 }}>
                  {exp.company}
                </div>
                {exp.location && (
                  <div style={{ fontSize: '7.5pt', color: '#9ca3af', fontFamily: 'system-ui, sans-serif' }}>{exp.location}</div>
                )}
              </div>
              {/* Content column */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9.5pt', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>{exp.title}</div>
                {exp.description && (
                  <div style={{ fontSize: '8.5pt', color: '#4b5563', fontFamily: 'system-ui, sans-serif', whiteSpace: 'pre-line', lineHeight: 1.65 }}>
                    {exp.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        </SectionWrapper>
      )}

      {/* ── Skills ── */}
      {(sections.skills || []).length > 0 && (
        <SectionWrapper sectionKey="skills">
        <div style={{ marginBottom: '16px' }}>
          <SectionTitle title="Skills" />
          {sections.skills.map((group, i) => (
            <div key={group.id || i} style={{ marginBottom: '8px' }}>
              {group.category && (
                <div style={{ fontSize: '8pt', fontWeight: 700, color: '#374151', marginBottom: '4px', fontFamily: 'system-ui, sans-serif' }}>{group.category}</div>
              )}
              {/* 4-column bullet grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px 8px' }}>
                {(group.items || []).map((skill, si) => (
                  <div key={si} style={{ fontSize: '8.5pt', color: '#374151', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ color: '#6b7280', fontSize: '9pt' }}>•</span> {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        </SectionWrapper>
      )}

      {/* ── Projects ── */}
      {(sections.projects || []).length > 0 && (
        <SectionWrapper sectionKey="projects">
        <div style={{ marginBottom: '16px' }}>
          <SectionTitle title="Projects" />
          {sections.projects.map((proj, i) => (
            <div key={proj.id || i} style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
              <div style={{ width: '130px', flexShrink: 0 }}>
                <div style={{ fontSize: '8pt', color: '#6b7280', fontFamily: 'system-ui, sans-serif' }}>
                  <DateRange start={proj.startDate} end={proj.endDate} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9.5pt', fontWeight: 700, color: '#111827' }}>{proj.name}</div>
                {proj.url && <div style={{ fontSize: '7.5pt', color: '#6b7280', fontFamily: 'system-ui, sans-serif' }}>{proj.url}</div>}
                {proj.description && <p style={{ fontSize: '8.5pt', color: '#4b5563', fontFamily: 'system-ui, sans-serif', lineHeight: 1.65, marginTop: '2px' }}>{proj.description}</p>}
                {(proj.technologies || []).length > 0 && (
                  <div style={{ fontSize: '8pt', color: '#6b7280', fontFamily: 'system-ui, sans-serif', marginTop: '2px' }}>
                    {proj.technologies.join(' · ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        </SectionWrapper>
      )}
    </div>
  );
}
