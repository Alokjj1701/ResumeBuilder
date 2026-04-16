import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { buildResume as apiBuildResume } from '../../services/aiApi';

// ── Config ────────────────────────────────────────────────────────────────────

const TOTAL_WIZARD_STEPS = 9; // steps 1–9, step 0 is the intro

const EXPERIENCE_LEVELS = [
  { id: 'fresher',   label: 'Fresher',    sub: '0–1 year',   icon: '🌱' },
  { id: 'junior',    label: 'Junior',     sub: '1–3 years',  icon: '🚀' },
  { id: 'mid',       label: 'Mid-Level',  sub: '3–6 years',  icon: '⚡' },
  { id: 'senior',    label: 'Senior',     sub: '6–10 years', icon: '🏆' },
  { id: 'executive', label: 'Executive',  sub: '10+ years',  icon: '💎' },
];

const TONE_OPTIONS = [
  { id: 'professional', label: 'Professional', desc: 'Polished, formal, corporate-ready',          icon: '👔' },
  { id: 'technical',    label: 'Technical',    desc: 'Metrics-driven, stack-precise, engineering', icon: '⚙️' },
  { id: 'creative',     label: 'Creative',     desc: 'Dynamic, distinctive, personality-forward',  icon: '🎨' },
  { id: 'executive',    label: 'Executive',    desc: 'Strategic, leadership-forward, C-suite',     icon: '📊' },
];

const BUILD_STAGES = [
  { label: 'Analyzing your experience…',            pct: 12  },
  { label: 'Identifying key achievements…',         pct: 26  },
  { label: 'Matching keywords to your target role…', pct: 42 },
  { label: 'Writing strong bullet points…',         pct: 58  },
  { label: 'Optimizing for ATS…',                   pct: 72  },
  { label: 'Tailoring your professional summary…',  pct: 84  },
  { label: 'Assembling your resume…',               pct: 93  },
  { label: 'Final polish — almost there…',          pct: 100 },
];

const STAGE_MS = 950; // ms per stage → total ≈ 7.6 s

const emptyWork = () => ({ company: '', title: '', duration: '', description: '' });
const emptyEdu  = () => ({ institution: '', degree: '', year: '', gpa: '' });

// ── Tiny helpers ──────────────────────────────────────────────────────────────

function TypedText({ text }) {
  const [shown, setShown] = useState('');
  useEffect(() => {
    setShown('');
    let i = 0;
    const iv = setInterval(() => {
      setShown(text.slice(0, ++i));
      if (i >= text.length) clearInterval(iv);
    }, 20);
    return () => clearInterval(iv);
  }, [text]);
  return (
    <span>
      {shown}
      <span style={{ borderRight: '2px solid #a78bfa', marginLeft: '1px', animation: 'ail-blink 0.7s step-end infinite' }} />
    </span>
  );
}

function SkillTagInput({ skills, onChange }) {
  const [val, setVal] = useState('');
  const ref = useRef(null);

  const add = (raw) => {
    const s = raw.trim().replace(/,+$/, '');
    if (s && !skills.includes(s)) onChange([...skills, s]);
    setVal('');
  };
  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(val); }
    if (e.key === 'Backspace' && !val && skills.length) onChange(skills.slice(0, -1));
  };

  return (
    <div
      onClick={() => ref.current?.focus()}
      style={{
        minHeight: '56px', padding: '8px 10px',
        border: '1.5px solid #ddd6fe', borderRadius: '10px',
        display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center',
        cursor: 'text', background: '#fff',
      }}
    >
      {skills.map((s) => (
        <span key={s} style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '3px 6px 3px 10px', background: '#ede9fe',
          borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 500, color: '#6d28d9',
        }}>
          {s}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(skills.filter((x) => x !== s)); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', padding: '0 4px', fontSize: '1rem', lineHeight: 1 }}
          >×</button>
        </span>
      ))}
      <input
        ref={ref} value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={onKey}
        onBlur={() => { if (val.trim()) add(val); }}
        placeholder={skills.length === 0 ? 'Type a skill, press Enter or comma  (e.g. React, Python, AWS…)' : 'Add more…'}
        style={{
          flex: 1, minWidth: '160px', border: 'none', outline: 'none',
          fontSize: '0.875rem', color: '#1f2937', background: 'transparent', padding: '2px 4px',
        }}
      />
    </div>
  );
}

// ── Resume skeleton shown during building ─────────────────────────────────────

function ResumeSkeleton({ stageIdx }) {
  const vis = stageIdx + 1;
  const BARS = [
    { w: '54%',  h: '11px', bg: '#1f2937', mt: 0      },
    { w: '38%',  h: '7px',  bg: '#9ca3af', mt: '5px'  },
    { w: '100%', h: '1px',  bg: '#e5e7eb', mt: '10px' },
    { w: '100%', h: '4px',  bg: '#e5e7eb', mt: '8px'  },
    { w: '88%',  h: '4px',  bg: '#f3f4f6', mt: '4px'  },
    { w: '72%',  h: '4px',  bg: '#f3f4f6', mt: '4px'  },
    { w: '30%',  h: '7px',  bg: '#7c3aed', mt: '12px' },
    { w: '95%',  h: '4px',  bg: '#e5e7eb', mt: '6px'  },
    { w: '80%',  h: '4px',  bg: '#f3f4f6', mt: '4px'  },
    { w: '65%',  h: '4px',  bg: '#f3f4f6', mt: '4px'  },
    { w: '28%',  h: '7px',  bg: '#7c3aed', mt: '10px' },
    { w: '90%',  h: '4px',  bg: '#e5e7eb', mt: '6px'  },
  ];
  return (
    <div style={{
      background: '#fff', borderRadius: '10px',
      padding: '18px 20px',
      boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
      width: '200px', overflow: 'hidden',
    }}>
      {BARS.map((b, i) => (
        <div key={i} style={{
          height: b.h, width: b.w, background: b.bg, borderRadius: '4px',
          marginTop: b.mt,
          opacity: i <= vis + 2 ? 1 : 0.12,
          transition: 'opacity 0.5s ease',
        }} />
      ))}
    </div>
  );
}

// ── ATS bar that fills as stages progress ──────────────────────────────────────

function AtsBar({ stageIdx }) {
  const targets = [0, 18, 34, 50, 64, 76, 85, 87, 88];
  const target  = targets[Math.min(stageIdx, targets.length - 1)];
  const [score, setScore] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => {
      setScore((p) => {
        const d = target - p;
        if (Math.abs(d) <= 1) { clearInterval(iv); return target; }
        return p + Math.ceil(d * 0.2);
      });
    }, 40);
    return () => clearInterval(iv);
  }, [target]);
  const color = score >= 80 ? '#10b981' : score >= 55 ? '#f59e0b' : '#6b7280';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', flexShrink: 0 }}>ATS Score</span>
      <div style={{ flex: 1, height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
        <div style={{ height: '100%', width: `${score}%`, borderRadius: '3px', background: color, transition: 'width 0.3s ease, background 0.5s ease' }} />
      </div>
      <span style={{ fontSize: '0.875rem', fontWeight: 700, color, minWidth: '28px', textAlign: 'right' }}>{score}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AiBuilderModal({ onClose, onComplete }) {
  // Phase: intro → wizard → building → result | error
  const [phase, setPhase]     = useState('intro');
  const [step, setStep]       = useState(0);
  const [dir, setDir]         = useState(1);   // +1 forward, -1 backward

  // Form data
  const [answers, setAnswers] = useState({
    firstName: '', lastName: '',
    experienceLevel: 'mid',
    targetRole: '',
    skills: [],
    workHistory: [emptyWork()],
    education: [emptyEdu()],
    achievements: '',
    jobDescription: '',
    tone: 'professional',
  });

  // Building state
  const [stageIdx,   setStageIdx]   = useState(0);
  const [progress,   setProgress]   = useState(0);
  const [apiResult,  setApiResult]  = useState(null);
  const [buildError, setBuildError] = useState(null);
  const animDone = useRef(false);
  const apiDone  = useRef(false);

  const set = (key, val) => setAnswers((a) => ({ ...a, [key]: val }));

  // ── Building orchestration ─────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== 'building') return;
    animDone.current = false;
    apiDone.current  = false;

    const checkBothDone = () => {
      if (animDone.current && apiDone.current) {
        setTimeout(() => setPhase('result'), 500);
      }
    };

    // Kick off API in parallel with animation
    apiBuildResume(answers)
      .then((res) => {
        setApiResult(res);
        apiDone.current = true;
        checkBothDone();
      })
      .catch((err) => {
        setBuildError(err?.response?.data?.message || err?.message || 'Generation failed. Please try again.');
        setPhase('error');
      });

    // Drive progress animation
    const timers = BUILD_STAGES.map((stage, i) =>
      setTimeout(() => {
        setStageIdx(i);
        setProgress(stage.pct);
        if (i === BUILD_STAGES.length - 1) {
          setTimeout(() => { animDone.current = true; checkBothDone(); }, 600);
        }
      }, i * STAGE_MS)
    );

    return () => timers.forEach(clearTimeout);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Navigation ─────────────────────────────────────────────────────────────

  const goNext = useCallback(() => {
    setDir(1);
    if (step === 0) { setStep(1); return; }
    if (step < TOTAL_WIZARD_STEPS) { setStep((s) => s + 1); return; }
    // last step → start generation
    setStageIdx(0);
    setProgress(0);
    setApiResult(null);
    setBuildError(null);
    setPhase('building');
  }, [step]);

  const goBack = useCallback(() => {
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const handleAccept = useCallback(() => {
    if (apiResult) {
      const { personalInfo } = apiResult;
      const title = personalInfo
        ? `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim() +
          (answers.targetRole ? ` — ${answers.targetRole}` : '')
        : 'AI Generated Resume';
      onComplete(apiResult, title.trim() || 'AI Generated Resume');
    }
  }, [apiResult, answers.targetRole, onComplete]);

  // ── Validation ─────────────────────────────────────────────────────────────

  const canNext = () => {
    if (step === 1) return answers.firstName.trim().length > 0;
    if (step === 3) return answers.targetRole.trim().length > 0;
    return true; // all other steps are optional
  };

  // ── Step variants ──────────────────────────────────────────────────────────

  const variants = {
    enter:  (d) => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
    center:       ({ x: 0, opacity: 1 }),
    exit:   (d) => ({ x: d > 0 ? -50 : 50, opacity: 0 }),
  };

  // ── Render helpers ─────────────────────────────────────────────────────────

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid #ddd6fe', borderRadius: '10px',
    fontSize: '0.9375rem', outline: 'none',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
  };

  const radioCardStyle = (selected) => ({
    border: `2px solid ${selected ? '#7c3aed' : '#e5e7eb'}`,
    borderRadius: '12px', padding: '12px 14px',
    cursor: 'pointer', background: selected ? '#faf5ff' : '#fff',
    transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '10px',
  });

  const labelStyle = {
    fontSize: '0.8125rem', fontWeight: 600, color: '#374151',
    display: 'block', marginBottom: '6px',
  };

  // ── Step content ───────────────────────────────────────────────────────────

  const renderStep = () => {
    // Step 0: intro
    if (step === 0) return (
      <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>✨</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1f2937', marginBottom: '8px', letterSpacing: '-0.4px' }}>
          Build your resume with AI
        </h2>
        <p style={{ fontSize: '0.9375rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>
          Answer 9 quick questions and get a complete, ATS-optimized resume in under 2 minutes — tailored to your target role.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px', margin: '0 auto 28px', textAlign: 'left' }}>
          {[
            ['⚡', 'Takes about 2 minutes'],
            ['🎯', 'Tailored to your target role & JD'],
            ['✅', 'ATS-optimized from day one'],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: '#374151' }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>
    );

    // Step 1: Name
    if (step === 1) return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>First Name <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              autoFocus
              style={inputStyle}
              type="text"
              value={answers.firstName}
              onChange={(e) => set('firstName', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && canNext() && goNext()}
              placeholder="Alex"
            />
          </div>
          <div>
            <label style={labelStyle}>Last Name</label>
            <input
              style={inputStyle}
              type="text"
              value={answers.lastName}
              onChange={(e) => set('lastName', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && canNext() && goNext()}
              placeholder="Johnson"
            />
          </div>
        </div>
        {answers.firstName && (
          <p style={{ marginTop: '14px', fontSize: '0.875rem', color: '#7c3aed', fontWeight: 500 }}>
            Nice to meet you, {answers.firstName}! 👋
          </p>
        )}
      </div>
    );

    // Step 2: Experience level
    if (step === 2) return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {EXPERIENCE_LEVELS.map((lvl) => {
          const sel = answers.experienceLevel === lvl.id;
          return (
            <div key={lvl.id} onClick={() => set('experienceLevel', lvl.id)} style={radioCardStyle(sel)}>
              <span style={{ fontSize: '1.375rem', flexShrink: 0 }}>{lvl.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: sel ? '#6d28d9' : '#1f2937' }}>{lvl.label}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{lvl.sub}</div>
              </div>
              {sel && (
                <div style={{ marginLeft: 'auto', width: '18px', height: '18px', background: '#7c3aed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );

    // Step 3: Target role
    if (step === 3) return (
      <div>
        <label style={labelStyle}>Role title <span style={{ color: '#ef4444' }}>*</span></label>
        <input
          autoFocus
          style={inputStyle}
          type="text"
          value={answers.targetRole}
          onChange={(e) => set('targetRole', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && canNext() && goNext()}
          placeholder="e.g. Senior Software Engineer, Product Manager, UX Designer…"
        />
        <p style={{ marginTop: '8px', fontSize: '0.775rem', color: '#9ca3af' }}>
          Be specific — the AI will tailor every bullet point, keyword, and summary to this exact role.
        </p>
      </div>
    );

    // Step 4: Skills
    if (step === 4) return (
      <div>
        <label style={labelStyle}>Top skills <span style={{ color: '#9ca3af', fontWeight: 400 }}>(type + Enter or comma)</span></label>
        <SkillTagInput skills={answers.skills} onChange={(v) => set('skills', v)} />
        <p style={{ marginTop: '8px', fontSize: '0.775rem', color: '#9ca3af' }}>
          Include technical skills, tools, frameworks, and soft skills. AI will group them for you.
        </p>
      </div>
    );

    // Step 5: Work history
    if (step === 5) return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {answers.workHistory.map((wh, i) => (
          <div key={i} style={{ border: '1.5px solid #ede9fe', borderRadius: '12px', padding: '14px 16px', background: '#faf5ff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#6d28d9' }}>Role {i + 1}</span>
              {i > 0 && (
                <button type="button"
                  onClick={() => set('workHistory', answers.workHistory.filter((_, j) => j !== i))}
                  style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.8125rem' }}>
                  Remove
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <input style={{ ...inputStyle, fontSize: '0.875rem', padding: '8px 12px' }} placeholder="Company name" value={wh.company}
                onChange={(e) => { const arr = [...answers.workHistory]; arr[i] = { ...arr[i], company: e.target.value }; set('workHistory', arr); }} />
              <input style={{ ...inputStyle, fontSize: '0.875rem', padding: '8px 12px' }} placeholder="Job title" value={wh.title}
                onChange={(e) => { const arr = [...answers.workHistory]; arr[i] = { ...arr[i], title: e.target.value }; set('workHistory', arr); }} />
            </div>
            <input style={{ ...inputStyle, fontSize: '0.875rem', padding: '8px 12px', marginBottom: '8px' }} placeholder="Duration (e.g. Jan 2021 – Mar 2023)" value={wh.duration}
              onChange={(e) => { const arr = [...answers.workHistory]; arr[i] = { ...arr[i], duration: e.target.value }; set('workHistory', arr); }} />
            <textarea
              style={{ ...inputStyle, fontSize: '0.875rem', padding: '8px 12px', resize: 'vertical', minHeight: '72px' }}
              placeholder="Key wins / responsibilities — the AI will turn these into strong bullets (e.g. Led team of 5, reduced load time 40%, shipped payments feature)"
              value={wh.description}
              onChange={(e) => { const arr = [...answers.workHistory]; arr[i] = { ...arr[i], description: e.target.value }; set('workHistory', arr); }}
            />
          </div>
        ))}
        {answers.workHistory.length < 3 && (
          <button type="button"
            onClick={() => set('workHistory', [...answers.workHistory, emptyWork()])}
            style={{ border: '1.5px dashed #ddd6fe', borderRadius: '10px', padding: '10px', background: 'transparent', color: '#7c3aed', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
            + Add another role
          </button>
        )}
        <p style={{ fontSize: '0.775rem', color: '#9ca3af', margin: 0 }}>Fresher? Skip this step — the AI will focus on your education and projects.</p>
      </div>
    );

    // Step 6: Education
    if (step === 6) return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {answers.education.map((edu, i) => (
          <div key={i} style={{ border: '1.5px solid #ede9fe', borderRadius: '12px', padding: '14px 16px', background: '#faf5ff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#6d28d9' }}>Education {i + 1}</span>
              {i > 0 && (
                <button type="button"
                  onClick={() => set('education', answers.education.filter((_, j) => j !== i))}
                  style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.8125rem' }}>
                  Remove
                </button>
              )}
            </div>
            <input style={{ ...inputStyle, fontSize: '0.875rem', padding: '8px 12px', marginBottom: '8px' }} placeholder="Institution (e.g. IIT Bombay, Stanford University)" value={edu.institution}
              onChange={(e) => { const arr = [...answers.education]; arr[i] = { ...arr[i], institution: e.target.value }; set('education', arr); }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input style={{ ...inputStyle, fontSize: '0.875rem', padding: '8px 12px' }} placeholder="Degree (e.g. B.Tech CS)" value={edu.degree}
                onChange={(e) => { const arr = [...answers.education]; arr[i] = { ...arr[i], degree: e.target.value }; set('education', arr); }} />
              <input style={{ ...inputStyle, fontSize: '0.875rem', padding: '8px 12px' }} placeholder="Year (e.g. 2018–2022)" value={edu.year}
                onChange={(e) => { const arr = [...answers.education]; arr[i] = { ...arr[i], year: e.target.value }; set('education', arr); }} />
            </div>
          </div>
        ))}
        {answers.education.length < 2 && (
          <button type="button"
            onClick={() => set('education', [...answers.education, emptyEdu()])}
            style={{ border: '1.5px dashed #ddd6fe', borderRadius: '10px', padding: '10px', background: 'transparent', color: '#7c3aed', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
            + Add another degree / certification
          </button>
        )}
      </div>
    );

    // Step 7: Achievements
    if (step === 7) return (
      <div>
        <label style={labelStyle}>Key achievements & highlights <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
        <textarea
          autoFocus
          style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
          placeholder={'Examples:\n• Won internal hackathon with AI productivity tool\n• Published paper in IEEE conference\n• Open-source project — 2k GitHub stars\n• Promoted twice in 18 months\n• Reduced cloud costs by $50k/year'}
          value={answers.achievements}
          onChange={(e) => set('achievements', e.target.value)}
        />
        <p style={{ marginTop: '8px', fontSize: '0.775rem', color: '#9ca3af' }}>
          Quantified wins have the biggest impact — numbers make bullets memorable.
        </p>
      </div>
    );

    // Step 8: Job description (optional)
    if (step === 8) return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Paste a job description <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
          <button type="button"
            onClick={goNext}
            style={{ background: 'none', border: 'none', color: '#7c3aed', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer', padding: 0 }}>
            Skip →
          </button>
        </div>
        <textarea
          autoFocus
          style={{ ...inputStyle, resize: 'vertical', minHeight: '140px', fontSize: '0.875rem' }}
          placeholder="Paste the full job posting here…&#10;&#10;This is optional but dramatically improves keyword matching — your resume will be tailored to exactly what the employer is looking for."
          value={answers.jobDescription}
          onChange={(e) => set('jobDescription', e.target.value)}
        />
        <p style={{ marginTop: '8px', fontSize: '0.775rem', color: '#9ca3af' }}>
          Tip: copy the entire JD including requirements and nice-to-haves.
        </p>
      </div>
    );

    // Step 9: Tone
    if (step === 9) return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {TONE_OPTIONS.map((t) => {
          const sel = answers.tone === t.id;
          return (
            <div key={t.id} onClick={() => set('tone', t.id)} style={radioCardStyle(sel)}>
              <span style={{ fontSize: '1.375rem', flexShrink: 0 }}>{t.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: sel ? '#6d28d9' : '#1f2937' }}>{t.label}</div>
                <div style={{ fontSize: '0.775rem', color: '#6b7280', marginTop: '1px' }}>{t.desc}</div>
              </div>
              {sel && (
                <div style={{ width: '18px', height: '18px', background: '#7c3aed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );

    return null;
  };

  // ── Building phase ─────────────────────────────────────────────────────────

  if (phase === 'building') return (
    <div style={overlayStyle}>
      <style>{KEYFRAMES}</style>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ ...cardStyle, background: '#0d0920', color: '#fff', textAlign: 'center', padding: '40px 32px', maxWidth: '520px' }}
      >
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '2rem', marginBottom: '6px', animation: 'ail-float 2s ease-in-out infinite' }}>✨</div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.3px', marginBottom: '6px' }}>
            Building your resume…
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
            Sit tight — this usually takes 10–20 seconds.
          </p>

          {/* Resume skeleton + ATS side by side */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ResumeSkeleton stageIdx={stageIdx} />
            </motion.div>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
              <div style={{
                height: '100%', borderRadius: '3px',
                background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
                width: `${progress}%`,
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 0 8px rgba(168,85,247,0.6)',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#c4b5fd', fontWeight: 500, textAlign: 'left' }}>
                <TypedText text={BUILD_STAGES[stageIdx]?.label || ''} />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>{progress}%</span>
            </div>
          </div>

          {/* ATS Score bar */}
          <AtsBar stageIdx={stageIdx} />
        </div>
      </motion.div>
    </div>
  );

  // ── Error phase ─────────────────────────────────────────────────────────────

  if (phase === 'error') return (
    <div style={overlayStyle}>
      <style>{KEYFRAMES}</style>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ ...cardStyle, textAlign: 'center', padding: '40px 32px', maxWidth: '480px' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>Generation failed</h2>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '24px', lineHeight: 1.6 }}>
          {buildError || 'Something went wrong. Please try again.'}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={onClose} style={btnSecondary}>Close</button>
          <button onClick={() => { setPhase('building'); }} style={btnPrimary}>↻ Try Again</button>
        </div>
      </motion.div>
    </div>
  );

  // ── Result phase ────────────────────────────────────────────────────────────

  if (phase === 'result' && apiResult) return (
    <div style={overlayStyle}>
      <style>{KEYFRAMES}</style>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ ...cardStyle, maxWidth: '640px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div style={{ padding: '22px 24px 16px', borderBottom: '1px solid #f3f4f6', background: 'linear-gradient(135deg, #faf5ff, #f5f3ff)', flexShrink: 0, borderRadius: '16px 16px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '1.75rem' }}>🎉</div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: '#4c1d95' }}>Your Resume is Ready!</h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#7c3aed' }}>
                AI-built, ATS-optimized, and tailored to <strong>{answers.targetRole || 'your target role'}</strong>
              </p>
            </div>
            <button type="button" onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        </div>

        {/* Scrollable preview */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <ResultPreview resume={apiResult} />
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '10px', justifyContent: 'flex-end', flexShrink: 0 }}>
          <button type="button" onClick={() => { setPhase('building'); }} style={btnSecondary}>↻ Regenerate</button>
          <button type="button" onClick={handleAccept} style={btnPrimary}>
            Open in Editor →
          </button>
        </div>
      </motion.div>
    </div>
  );

  // ── Wizard ──────────────────────────────────────────────────────────────────

  const stepTitles = [
    null,
    "What's your name?",
    'Your experience level',
    'What role are you targeting?',
    'What are your top skills?',
    'Your work experience',
    'Your education',
    'Your proudest achievements',
    'Have a job description?',
    'How should your resume sound?',
  ];

  const stepSubtitles = [
    null,
    "Let's personalize your resume",
    'Helps tailor tone, depth, and bullet style',
    'The more specific, the better the output',
    'Add technical and soft skills',
    "Tell us about your career so far",
    'Degrees, diplomas, certifications',
    'Quantified wins land interviews',
    'Optional — dramatically improves keyword matching',
    'Match your industry and personality',
  ];

  return (
    <div style={overlayStyle}>
      <style>{KEYFRAMES}</style>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ ...cardStyle, maxWidth: '560px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Top bar */}
        <div style={{
          padding: '16px 20px 14px',
          borderBottom: step > 0 ? '1px solid #f3f4f6' : 'none',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Logo pill */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '3px 10px', borderRadius: '100px',
              background: 'linear-gradient(135deg, #ede9fe, #fdf4ff)',
              border: '1px solid #ddd6fe', fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed',
            }}>
              ✨ AI Builder
            </span>

            {step > 0 && (
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: 'auto' }}>
                Step {step} of {TOTAL_WIZARD_STEPS}
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', marginLeft: step === 0 ? 'auto' : '0' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Progress bar — only visible after step 0 */}
          {step > 0 && (
            <div style={{ marginTop: '12px', height: '3px', background: '#f3f4f6', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '2px',
                background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
                width: `${((step - 1) / (TOTAL_WIZARD_STEPS - 1)) * 100}%`,
                transition: 'width 0.35s ease',
              }} />
            </div>
          )}
        </div>

        {/* Step header */}
        {step > 0 && (
          <div style={{ padding: '18px 24px 0', flexShrink: 0 }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1f2937', letterSpacing: '-0.3px' }}>
              {stepTitles[step]}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.8375rem', color: '#6b7280' }}>
              {stepSubtitles[step]}
            </p>
          </div>
        )}

        {/* Step content — animated */}
        <div style={{ flex: 1, overflowY: 'auto', padding: step === 0 ? '24px' : '16px 24px 8px', position: 'relative' }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        <div style={{
          display: 'flex', gap: '10px', justifyContent: step === 0 ? 'center' : 'flex-end',
          padding: '14px 24px', borderTop: '1px solid #f3f4f6', flexShrink: 0,
        }}>
          {step > 1 && (
            <button type="button" onClick={goBack} style={btnSecondary}>← Back</button>
          )}

          {step === 0 ? (
            <button type="button" onClick={goNext} style={{ ...btnPrimary, padding: '10px 32px', fontSize: '0.9375rem' }}>
              Let's go →
            </button>
          ) : step === TOTAL_WIZARD_STEPS ? (
            <button type="button" onClick={goNext} style={{ ...btnPrimary, background: 'linear-gradient(135deg, #6d28d9, #a21caf)' }}>
              ✨ Generate My Resume
            </button>
          ) : (
            <button type="button" onClick={goNext} disabled={!canNext()} style={{
              ...btnPrimary,
              opacity: canNext() ? 1 : 0.45,
              cursor: canNext() ? 'pointer' : 'not-allowed',
            }}>
              {step === 8 && answers.jobDescription === '' ? 'Skip & Continue →' : 'Continue →'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ── Result preview sub-component ──────────────────────────────────────────────

function ResultPreview({ resume }) {
  const pi = resume.personalInfo || {};
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Personal info */}
      <div style={previewCardStyle('#f0fdf4', '#bbf7d0')}>
        <div style={sectionLabelStyle('#16a34a')}>✓ Personal Info</div>
        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1f2937' }}>
          {[pi.firstName, pi.lastName].filter(Boolean).join(' ') || '—'}
        </div>
        <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '2px' }}>
          {[pi.email, pi.location].filter(Boolean).join(' · ') || 'No contact info provided'}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div style={previewCardStyle('#faf5ff', '#ede9fe')}>
          <div style={sectionLabelStyle('#7c3aed')}>✓ Professional Summary</div>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.65, margin: 0 }}>
            {resume.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {resume.experience?.length > 0 && (
        <div style={previewCardStyle('#eff6ff', '#bfdbfe')}>
          <div style={sectionLabelStyle('#1d4ed8')}>✓ Experience — {resume.experience.length} role{resume.experience.length !== 1 ? 's' : ''}</div>
          {resume.experience.slice(0, 2).map((exp, i) => (
            <div key={i} style={{ marginTop: i > 0 ? '10px' : '0', paddingTop: i > 0 ? '10px' : '0', borderTop: i > 0 ? '1px solid #dbeafe' : 'none' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e3a8a' }}>{exp.title} — {exp.company}</div>
              <div style={{ fontSize: '0.775rem', color: '#3b82f6', marginTop: '2px', whiteSpace: 'pre-line' }}>
                {exp.description?.slice(0, 160)}{exp.description?.length > 160 ? '…' : ''}
              </div>
            </div>
          ))}
          {resume.experience.length > 2 && (
            <div style={{ fontSize: '0.775rem', color: '#6b7280', marginTop: '6px' }}>+{resume.experience.length - 2} more role{resume.experience.length - 2 !== 1 ? 's' : ''}</div>
          )}
        </div>
      )}

      {/* Skills */}
      {resume.skills?.length > 0 && (
        <div style={previewCardStyle('#fff7ed', '#fed7aa')}>
          <div style={sectionLabelStyle('#c2410c')}>✓ Skills — {resume.skills.reduce((acc, g) => acc + (g.items?.length || 0), 0)} keywords</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
            {resume.skills.flatMap((g) => g.items || []).slice(0, 16).map((skill) => (
              <span key={skill} style={{ padding: '2px 10px', background: '#fff', border: '1px solid #fed7aa', borderRadius: '20px', fontSize: '0.775rem', fontWeight: 500, color: '#9a3412' }}>
                {skill}
              </span>
            ))}
            {resume.skills.flatMap((g) => g.items || []).length > 16 && (
              <span style={{ fontSize: '0.775rem', color: '#6b7280' }}>+{resume.skills.flatMap((g) => g.items || []).length - 16} more</span>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {resume.projects?.length > 0 && (
        <div style={previewCardStyle('#f0f9ff', '#bae6fd')}>
          <div style={sectionLabelStyle('#0369a1')}>✓ Projects — {resume.projects.length} listed</div>
          {resume.projects.slice(0, 1).map((p, i) => (
            <div key={i} style={{ marginTop: '6px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0c4a6e' }}>{p.name}</div>
              <div style={{ fontSize: '0.775rem', color: '#0369a1', marginTop: '2px' }}>
                {p.description?.slice(0, 120)}{p.description?.length > 120 ? '…' : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: '0.775rem', color: '#9ca3af', textAlign: 'center', margin: 0 }}>
        Open in editor to customise every section, switch templates, and export to PDF.
      </p>
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const overlayStyle = {
  position: 'fixed', inset: 0,
  background: 'rgba(6,4,15,0.7)',
  backdropFilter: 'blur(6px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 400, padding: '16px',
};

const cardStyle = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
};

const btnPrimary = {
  padding: '9px 22px', borderRadius: '8px', border: 'none',
  background: '#7c3aed', color: '#fff',
  fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  transition: 'opacity 0.15s',
};

const btnSecondary = {
  padding: '9px 18px', borderRadius: '8px',
  border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280',
  fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
};

const previewCardStyle = (bg, border) => ({
  padding: '12px 14px', borderRadius: '12px',
  background: bg, border: `1px solid ${border}`,
});

const sectionLabelStyle = (color) => ({
  fontSize: '0.72rem', fontWeight: 700, color,
  textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px',
});

const KEYFRAMES = `
  @keyframes ail-blink  { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes ail-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
`;
