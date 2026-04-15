import { motion } from 'framer-motion';

export default function CtaSection({ onCreateResume }) {
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      padding: 'clamp(3.5rem,9vw,6rem) 2rem',
      background: '#06040f',
    }}>
      {/* Background orbs */}
      <div style={{
        position: 'absolute', top: '-80px', left: '-80px',
        width: '360px', height: '360px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,70,229,0.3) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', right: '-60px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div className="hero-noise" style={{ opacity: 0.4 }} />

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: '680px', margin: '0 auto',
        textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.3rem 1rem',
            background: 'rgba(167,139,250,0.1)',
            border: '1px solid rgba(167,139,250,0.25)',
            borderRadius: '100px',
            fontSize: '0.75rem', fontWeight: 700,
            color: '#c4b5fd', letterSpacing: '0.3px',
            marginBottom: '1.5rem',
          }}>
            🚀 Your Next Job Starts Here
          </div>

          <h2 style={{
            fontSize: 'clamp(1.875rem, 5vw, 3rem)',
            fontWeight: 900, color: '#fff',
            lineHeight: 1.1, letterSpacing: '-1px',
            marginBottom: '1rem',
          }}>
            Ready to Land Your
            <span style={{
              display: 'block',
              background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 60%, #fb923c 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Dream Job?
            </span>
          </h2>

          <p style={{
            fontSize: '1.0625rem',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.7, marginBottom: '2.5rem',
            maxWidth: '460px', margin: '0 auto 2.5rem',
          }}>
            Join thousands of professionals who built interview-winning resumes.
            It's free, fast, and no signup required.
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onCreateResume}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.875rem 2.25rem',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: '#fff', border: 'none', borderRadius: '100px',
                fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
                boxShadow: '0 6px 28px rgba(79,70,229,0.55)',
                letterSpacing: '-0.2px',
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Start Building Now — Free
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('templates-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.875rem 1.875rem',
                background: 'rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '100px',
                fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                backdropFilter: 'blur(8px)',
              }}
            >
              View Templates
            </motion.button>
          </div>

          {/* Social proof strip */}
          <div style={{
            marginTop: '2.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            color: 'rgba(255,255,255,0.38)',
            fontSize: '0.8rem',
          }}>
            <div style={{ display: 'flex', gap: '-6px' }}>
              {['#818cf8','#34d399','#f472b6','#fb923c','#38bdf8'].map((c, i) => (
                <div key={i} style={{
                  width: '26px', height: '26px', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${c}, ${c}88)`,
                  border: '2px solid #06040f',
                  marginLeft: i > 0 ? '-8px' : '0',
                  fontSize: '0.6rem', fontWeight: 800, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {['P','R','S','D','A'][i]}
                </div>
              ))}
            </div>
            <span>Trusted by job seekers worldwide</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
