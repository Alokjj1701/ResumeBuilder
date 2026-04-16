import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
});

const STATS = [
  { value: '17',   label: 'Templates' },
  { value: 'ATS',  label: 'Optimized' },
  { value: 'Live', label: 'Preview' },
  { value: '1-Click', label: 'PDF Export' },
];

export default function HeroSection({ onCreateResume, onViewTemplates, onAiBuilder }) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: '#06040f' }}>
      {/* Animated gradient orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      {/* Noise overlay */}
      <div className="hero-noise" />

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: '1160px', margin: '0 auto',
        padding: 'clamp(4rem,10vh,7rem) 2rem clamp(3rem,7vh,5rem)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center',
      }}>
        {/* Eyebrow badge */}
        <motion.div {...fadeUp(0)} style={{ marginBottom: '1.5rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.3rem 1rem',
            background: 'rgba(167,139,250,0.12)',
            border: '1px solid rgba(167,139,250,0.3)',
            borderRadius: '100px',
            fontSize: '0.8rem', fontWeight: 600,
            color: '#c4b5fd', letterSpacing: '0.3px',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#a78bfa', boxShadow: '0 0 8px #a78bfa',
              animation: 'pulse-dot 2s ease infinite',
            }} />
            ✦ ATS-Optimized Resumes — Built for 2025
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 {...fadeUp(0.08)} style={{
          fontSize: 'clamp(2.25rem, 6vw, 4rem)',
          fontWeight: 900,
          lineHeight: 1.08,
          letterSpacing: '-1.5px',
          color: '#fff',
          marginBottom: '1rem',
          maxWidth: '760px',
        }}>
          Build ATS-Friendly Resumes
          <span style={{
            display: 'block',
            background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 60%, #fb923c 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            That Get You Hired
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p {...fadeUp(0.16)} style={{
          fontSize: 'clamp(1rem, 2vw, 1.125rem)',
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.7, maxWidth: '520px',
          marginBottom: '2.5rem',
        }}>
          Create a polished, recruiter-ready resume in minutes. Pick a template,
          fill in your details, and export a pixel-perfect PDF — no design skills needed.
        </motion.p>

        {/* CTA row */}
        <motion.div {...fadeUp(0.24)} style={{
          display: 'flex', gap: '0.875rem', flexWrap: 'wrap', justifyContent: 'center',
          marginBottom: '3.5rem',
          width: '100%', maxWidth: '480px',
        }}>
          {/* AI Builder — premium CTA */}
          <button
            onClick={onAiBuilder}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #7c3aed 0%, #a21caf 100%)',
              color: '#fff', border: 'none', borderRadius: '100px',
              fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 0 0 1px rgba(167,139,250,0.3), 0 8px 24px rgba(124,58,237,0.5)',
              transition: 'opacity 0.15s, transform 0.15s',
              letterSpacing: '-0.1px',
              position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.92'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {/* Shimmer sweep */}
            <span style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)',
              backgroundSize: '200% 100%',
              animation: 'hero-shimmer 2.4s ease infinite',
            }} />
            <span style={{ fontSize: '1.1rem', position: 'relative', zIndex: 1 }}>✨</span>
            <span style={{ position: 'relative', zIndex: 1 }}>Create Resume with AI</span>
          </button>

          <button
            onClick={onCreateResume}
            className="hero-cta-primary"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Start from Template
          </button>
          <button
            onClick={onViewTemplates}
            className="hero-cta-ghost"
          >
            Browse Templates
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            display: 'flex', gap: '0', flexWrap: 'wrap', justifyContent: 'center',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            backdropFilter: 'blur(8px)',
            overflow: 'hidden',
          }}
        >
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: '0.875rem 1.75rem',
              borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
        background: 'linear-gradient(to bottom, transparent, var(--bg))',
        pointerEvents: 'none',
      }} />

      <style>{`
        @keyframes hero-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </section>
  );
}
