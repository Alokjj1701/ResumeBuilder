import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    color: '#818cf8',
    bg: 'linear-gradient(135deg, #ede9fe, #e0e7ff)',
    title: 'ATS-Friendly Templates',
    body: 'Every template is engineered to pass Applicant Tracking Systems. Clean structure, proper heading hierarchy, and keyword-friendly layouts guaranteed.',
    tag: 'Pass the bots',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    color: '#34d399',
    bg: 'linear-gradient(135deg, #d1fae5, #ecfdf5)',
    title: 'Real-Time Live Preview',
    body: 'Every keystroke instantly updates the preview. See exactly how your resume looks as a PDF — no guessing, no surprises at export time.',
    tag: 'WYSIWYG editing',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    color: '#f472b6',
    bg: 'linear-gradient(135deg, #fce7f3, #fdf2f8)',
    title: 'Easy Customization',
    body: "Fill in sections with an intuitive form editor. Drag to reorder sections, add or remove items, and customize everything without touching a line of code.",
    tag: 'No design skills needed',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    color: '#fb923c',
    bg: 'linear-gradient(135deg, #ffedd5, #fff7ed)',
    title: 'One-Click PDF Export',
    body: 'Export a pixel-perfect A4 PDF in seconds. Crisp typography, exact margins, and professional quality — ready to email or upload to any job portal.',
    tag: 'Print-ready quality',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    color: '#38bdf8',
    bg: 'linear-gradient(135deg, #e0f2fe, #f0f9ff)',
    title: '9 Stunning Templates',
    body: 'From clean minimal to bold creative — nine handcrafted templates to match every industry, level, and personal style. Switch anytime with one click.',
    tag: 'Every style covered',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    color: '#a78bfa',
    bg: 'linear-gradient(135deg, #ede9fe, #f5f3ff)',
    title: 'Auto-Save Built In',
    body: "Your work is saved automatically every few seconds. No more lost progress — pick up exactly where you left off, any time, from any device.",
    tag: 'Never lose your work',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function FeaturesSection() {
  return (
    <section style={{
      padding: 'clamp(3.5rem,8vw,5.5rem) 2rem',
      background: 'var(--white)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true, margin: '-60px' }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <span style={{
            display: 'inline-block',
            padding: '0.25rem 0.875rem',
            background: 'linear-gradient(135deg, #ede9fe, #fce7f3)',
            borderRadius: '100px',
            fontSize: '0.75rem', fontWeight: 700,
            color: '#7c3aed', letterSpacing: '0.5px',
            textTransform: 'uppercase', marginBottom: '1rem',
          }}>
            Everything You Need
          </span>
          <h2 style={{
            fontSize: 'clamp(1.625rem, 4vw, 2.5rem)',
            fontWeight: 900, letterSpacing: '-0.75px',
            color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.15,
          }}>
            Packed with Features.<br />Simple to Use.
          </h2>
          <p style={{
            fontSize: '1rem', color: 'var(--text-light)',
            lineHeight: 1.7, maxWidth: '460px', margin: '0 auto',
          }}>
            Everything a modern job seeker needs — in one fast, free tool.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {FEATURES.map((feat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              style={{
                display: 'flex', gap: '1rem',
                padding: '1.375rem',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                cursor: 'default',
                transition: 'border-color 0.22s, box-shadow 0.22s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${feat.color}50`;
                e.currentTarget.style.boxShadow = `0 8px 28px ${feat.color}18`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Icon box */}
              <div style={{
                width: '48px', height: '48px', flexShrink: 0,
                borderRadius: '12px',
                background: feat.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: feat.color,
              }}>
                {feat.icon}
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text)' }}>
                    {feat.title}
                  </h3>
                  <span style={{
                    padding: '1px 8px',
                    background: `${feat.color}15`,
                    color: feat.color,
                    borderRadius: '100px',
                    fontSize: '0.65rem', fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}>
                    {feat.tag}
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-light)', lineHeight: 1.65 }}>
                  {feat.body}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
