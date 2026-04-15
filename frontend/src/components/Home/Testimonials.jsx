import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer',
    location: 'Bangalore, India',
    company: 'Microsoft',
    avatar: 'PS',
    color: '#818cf8',
    stars: 5,
    text: "I had been applying for months with zero callbacks. Switched to the Modern template, added my projects section properly, and got 4 interview calls the very next week. Landed at Microsoft in 8 weeks. This tool is genuinely life-changing.",
  },
  {
    name: 'Rahul Gupta',
    role: 'Product Manager',
    location: 'Mumbai, India',
    company: 'Google',
    avatar: 'RG',
    color: '#34d399',
    stars: 5,
    text: "The live preview feature is incredible — I could see exactly how my resume would look before exporting. The ATS-optimized templates helped me get through screening rounds at 3 top companies. Ended up choosing Google.",
  },
  {
    name: 'Sarah Johnson',
    role: 'Marketing Manager',
    location: 'New York, USA',
    company: 'Spotify',
    avatar: 'SJ',
    color: '#f472b6',
    stars: 5,
    text: "I was using a basic Word template for years. Switched to the Creative template here and went from zero responses to 3× more interview requests in two weeks. The design quality is on par with paid tools that cost $30/month.",
  },
  {
    name: 'Divya Nair',
    role: 'Data Analyst',
    location: 'Chennai, India',
    company: 'Amazon',
    avatar: 'DN',
    color: '#fb923c',
    stars: 5,
    text: "The drag-and-drop reordering for experience sections saved me so much time. I customized multiple versions for different roles in under 30 minutes. Got shortlisted at Amazon Web Services within a week of applying.",
  },
  {
    name: 'Alex Chen',
    role: 'Data Scientist',
    location: 'San Francisco, USA',
    company: 'Meta',
    avatar: 'AC',
    color: '#38bdf8',
    stars: 5,
    text: "The Tech template is perfect for engineers. Projects front and center, clean code-style tags for tech stacks, GitHub link prominently placed. My interview rate improved by 60%. Exactly what the engineering job market needs.",
  },
  {
    name: 'Arjun Mehta',
    role: 'Frontend Developer',
    location: 'Hyderabad, India',
    company: 'Flipkart',
    avatar: 'AM',
    color: '#a78bfa',
    stars: 5,
    text: "The PDF export quality is outstanding — crisp, professional, exactly A4. No weird formatting breaks that I used to get with other tools. The Gradient template stood out in my recruiter's inbox. Got the Flipkart offer in 3 weeks!",
  },
];

function StarRating({ count = 5 }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(TESTIMONIALS.length / perPage);
  const visible = TESTIMONIALS.slice(active * perPage, active * perPage + perPage);

  return (
    <section style={{
      padding: 'clamp(3.5rem,8vw,5.5rem) 2rem',
      background: 'var(--bg)',
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
            background: 'rgba(251,191,36,0.12)',
            border: '1px solid rgba(251,191,36,0.25)',
            borderRadius: '100px',
            fontSize: '0.75rem', fontWeight: 700,
            color: '#d97706', letterSpacing: '0.5px',
            textTransform: 'uppercase', marginBottom: '1rem',
          }}>
            ★ Success Stories
          </span>
          <h2 style={{
            fontSize: 'clamp(1.625rem, 4vw, 2.5rem)',
            fontWeight: 900, letterSpacing: '-0.75px',
            color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.15,
          }}>
            Real People, Real Hires
          </h2>
          <p style={{
            fontSize: '1rem', color: 'var(--text-light)',
            lineHeight: 1.7, maxWidth: '440px', margin: '0 auto',
          }}>
            Join thousands of job seekers who built winning resumes and landed their dream roles.
          </p>
        </motion.div>

        {/* Testimonial cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            {visible.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--border)',
                  borderRadius: '18px',
                  padding: '1.5rem',
                  display: 'flex', flexDirection: 'column', gap: '0.75rem',
                  transition: 'box-shadow 0.22s, border-color 0.22s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 12px 32px ${t.color}22`;
                  e.currentTarget.style.borderColor = `${t.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                {/* Stars */}
                <StarRating count={t.stars} />

                {/* Quote */}
                <p style={{
                  fontSize: '0.875rem', color: 'var(--text)',
                  lineHeight: 1.7, flex: 1,
                  fontStyle: 'italic',
                }}>
                  "{t.text}"
                </p>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: `linear-gradient(135deg, ${t.color}cc, ${t.color}66)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8125rem', fontWeight: 800, color: '#fff',
                    flexShrink: 0,
                  }}>
                    {t.avatar}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      {t.role} · {t.location}
                    </div>
                  </div>
                  {/* Company badge */}
                  <div style={{
                    marginLeft: 'auto',
                    padding: '3px 10px',
                    background: `${t.color}14`,
                    color: t.color,
                    borderRadius: '100px',
                    fontSize: '0.7rem', fontWeight: 700,
                    whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                    → {t.company}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination dots */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  width: i === active ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '100px',
                  border: 'none',
                  background: i === active ? '#7c3aed' : 'var(--border-dark)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
