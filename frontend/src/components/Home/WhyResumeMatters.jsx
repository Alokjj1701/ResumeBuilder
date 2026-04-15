import { motion } from 'framer-motion';

const CARDS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    color: '#818cf8',
    bg: 'rgba(129,140,248,0.1)',
    border: 'rgba(129,140,248,0.2)',
    stat: '75%',
    statLabel: 'of resumes rejected',
    title: 'ATS Filters First',
    body: "Most companies run your resume through an Applicant Tracking System before a human ever sees it. A poorly formatted resume never makes it to the recruiter's desk.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: '#34d399',
    bg: 'rgba(52,211,153,0.1)',
    border: 'rgba(52,211,153,0.2)',
    stat: '6 sec',
    statLabel: 'average scan time',
    title: 'The 6-Second Rule',
    body: "Research shows recruiters spend an average of just 6 seconds scanning a resume. A clean, structured layout makes sure your key achievements are impossible to miss.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: '#f472b6',
    bg: 'rgba(244,114,182,0.1)',
    border: 'rgba(244,114,182,0.2)',
    stat: '250+',
    statLabel: 'applicants per job',
    title: 'Stand Out or Get Skipped',
    body: "The average corporate job posting receives 250+ applications. A professionally designed resume signals you take your career seriously — before they read a single word.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.1)',
    border: 'rgba(251,146,60,0.2)',
    stat: '3×',
    statLabel: 'more interview calls',
    title: 'Format Drives Results',
    body: "Job seekers who use optimized, professionally formatted resumes report up to 3× more interview callbacks than those using plain document templates.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function WhyResumeMatters() {
  return (
    <section style={{ padding: 'clamp(3.5rem,8vw,5.5rem) 2rem', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        {/* Section header */}
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
            background: 'rgba(129,140,248,0.12)',
            border: '1px solid rgba(129,140,248,0.25)',
            borderRadius: '100px',
            fontSize: '0.75rem', fontWeight: 700,
            color: '#818cf8', letterSpacing: '0.5px',
            textTransform: 'uppercase', marginBottom: '1rem',
          }}>
            Why It Matters
          </span>
          <h2 style={{
            fontSize: 'clamp(1.625rem, 4vw, 2.5rem)',
            fontWeight: 900, letterSpacing: '-0.75px',
            color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.15,
          }}>
            Your Resume Is Working<br />Even When You're Not
          </h2>
          <p style={{
            fontSize: '1rem', color: 'var(--text-light)',
            lineHeight: 1.7, maxWidth: '480px', margin: '0 auto',
          }}>
            The job market is competitive. Understanding what makes a great resume
            gives you a real edge over the competition.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {CARDS.map((card, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.22 } }}
              style={{
                background: 'var(--white)',
                border: `1px solid ${card.border}`,
                borderRadius: '18px',
                padding: '1.5rem',
                cursor: 'default',
                transition: 'box-shadow 0.22s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 12px 36px ${card.bg.replace('0.1', '0.35')}`; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Icon */}
              <div style={{
                width: '52px', height: '52px',
                borderRadius: '14px',
                background: card.bg,
                border: `1px solid ${card.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: card.color,
                marginBottom: '1.125rem',
              }}>
                {card.icon}
              </div>

              {/* Stat */}
              <div style={{ marginBottom: '0.625rem' }}>
                <span style={{
                  fontSize: '2rem', fontWeight: 900, color: card.color,
                  letterSpacing: '-0.5px', lineHeight: 1,
                }}>
                  {card.stat}
                </span>
                <span style={{
                  display: 'block', fontSize: '0.72rem',
                  color: 'var(--text-lighter)', textTransform: 'uppercase',
                  letterSpacing: '0.5px', marginTop: '2px',
                }}>
                  {card.statLabel}
                </span>
              </div>

              <h3 style={{
                fontSize: '0.9375rem', fontWeight: 700,
                color: 'var(--text)', marginBottom: '0.5rem',
              }}>
                {card.title}
              </h3>
              <p style={{
                fontSize: '0.8125rem', color: 'var(--text-light)',
                lineHeight: 1.65,
              }}>
                {card.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
