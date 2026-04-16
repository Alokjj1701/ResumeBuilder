import { useState, useRef, useEffect, useCallback } from 'react';
import { sendChatMessage } from '../../services/aiApi';

const QUICK_ACTIONS = [
  'How can I improve my summary?',
  'Make my bullets more impactful',
  'What keywords am I missing?',
  'How does my resume score for ATS?',
];

// ── Suggestion block parser ────────────────────────────────────────────────────
// Splits a message string into alternating plain-text / suggestion segments.
function parseSegments(content) {
  const regex = /```suggestion\n([\s\S]*?)\n```/g;
  const segments = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: content.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'suggestion', value: match[1] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < content.length) {
    segments.push({ type: 'text', value: content.slice(lastIndex) });
  }
  return segments;
}

// Build the list of applyable text fields from the resume sections
function buildFieldOptions(sections) {
  const opts = [];
  if (sections?.summary !== undefined && sections.summary !== null) {
    opts.push({ value: 'summary', label: 'Summary' });
  }
  (sections?.experience || []).forEach((e, i) => {
    opts.push({
      value: `experience.${i}.description`,
      label: `Experience: ${e.title || e.company || `Job ${i + 1}`}`,
    });
  });
  (sections?.projects || []).forEach((p, i) => {
    opts.push({
      value: `projects.${i}.description`,
      label: `Project: ${p.name || `Project ${i + 1}`}`,
    });
  });
  (sections?.education || []).forEach((e, i) => {
    opts.push({
      value: `education.${i}.description`,
      label: `Education: ${e.institution || `School ${i + 1}`}`,
    });
  });
  return opts;
}

// ── SuggestionCard ─────────────────────────────────────────────────────────────
function SuggestionCard({ text, sections, onApply }) {
  const fieldOptions = buildFieldOptions(sections);
  const [selected, setSelected]   = useState(fieldOptions[0]?.value || '');
  const [applied, setApplied]     = useState(false);
  const [copied, setCopied]       = useState(false);

  const handleApply = () => {
    if (!selected) return;
    onApply(selected, text);
    setApplied(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div style={{
      marginTop: '6px',
      background: '#faf5ff',
      border: '1px solid #ddd6fe',
      borderRadius: '10px',
      padding: '10px 12px',
    }}>
      <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#7c3aed', marginBottom: '6px', letterSpacing: '0.02em' }}>
        ✨ SUGGESTED REWRITE
      </p>
      <pre style={{
        fontFamily: 'inherit',
        fontSize: '0.8rem',
        color: '#1f2937',
        whiteSpace: 'pre-wrap',
        margin: '0 0 10px',
        lineHeight: 1.6,
        background: '#f5f3ff',
        borderRadius: '6px',
        padding: '8px 10px',
        border: '1px solid #ede9fe',
      }}>
        {text}
      </pre>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
        {fieldOptions.length > 0 && (
          <select
            value={selected}
            onChange={(e) => { setSelected(e.target.value); setApplied(false); }}
            style={{
              flex: 1,
              minWidth: '120px',
              padding: '4px 6px',
              borderRadius: '6px',
              border: '1px solid #ddd6fe',
              fontSize: '0.72rem',
              color: '#374151',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            {fieldOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        )}

        <button
          type="button"
          onClick={handleApply}
          disabled={applied || !selected}
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            border: 'none',
            background: applied ? '#ecfdf5' : '#7c3aed',
            color: applied ? '#059669' : '#fff',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: applied || !selected ? 'default' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {applied ? '✓ Applied' : 'Apply'}
        </button>

        <button
          type="button"
          onClick={handleCopy}
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid #ddd6fe',
            background: '#fff',
            color: copied ? '#059669' : '#6b7280',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

// ── MessageBubble ──────────────────────────────────────────────────────────────
function MessageBubble({ msg, sections, onApply }) {
  if (msg.role === 'user') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{
          maxWidth: '85%',
          padding: '8px 12px',
          borderRadius: '12px 12px 2px 12px',
          background: '#7c3aed',
          color: '#fff',
          fontSize: '0.8125rem',
          lineHeight: 1.55,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          {msg.content}
        </div>
      </div>
    );
  }

  const segments = parseSegments(msg.content);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div style={{
        maxWidth: '92%',
        padding: '8px 12px',
        borderRadius: '12px 12px 12px 2px',
        background: '#f3f4f6',
        color: '#374151',
        fontSize: '0.8125rem',
        lineHeight: 1.55,
        wordBreak: 'break-word',
      }}>
        {segments.map((seg, i) =>
          seg.type === 'suggestion' ? (
            <SuggestionCard key={i} text={seg.value} sections={sections} onApply={onApply} />
          ) : (
            <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{seg.value}</span>
          )
        )}
      </div>
    </div>
  );
}

// ── Main panel ─────────────────────────────────────────────────────────────────

/**
 * Floating AI Chat sidebar.
 * Props:
 *   sections  {object}   — current resume sections (context + apply targets)
 *   onApply   {function} — (fieldPath, text) => void  e.g. 'experience.0.description'
 *   onClose   {function}
 */
export default function AiChatPanel({ sections, onApply, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI resume coach. I have your full resume — ask me anything, or request a rewrite and I'll give you copy-ready text you can apply instantly.",
    },
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = useCallback(async (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || loading) return;
    setInput('');

    const userMsg  = { role: 'user', content: trimmed };
    // history = everything except the initial greeting
    const history  = messages.slice(1).map(({ role, content }) => ({ role, content }));
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const reply = await sendChatMessage(trimmed, history, sections);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, sections]);

  return (
    <div style={{
      position: 'fixed',
      top: '56px',
      right: 0,
      bottom: 0,
      width: '380px',
      background: '#fff',
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      boxShadow: '-4px 0 24px rgba(0,0,0,0.08)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 14px',
        borderBottom: '1px solid var(--border)',
        background: '#faf5ff',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '1rem' }}>✨</span>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#7c3aed', flex: 1 }}>AI Resume Coach</span>
        <button
          type="button"
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '2px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} sections={sections} onApply={onApply} />
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '8px 14px',
              borderRadius: '12px 12px 12px 2px',
              background: '#f3f4f6',
              display: 'flex',
              gap: '4px',
              alignItems: 'center',
            }}>
              {[0, 1, 2].map((n) => (
                <span key={n} style={{
                  width: '6px', height: '6px',
                  borderRadius: '50%',
                  background: '#9ca3af',
                  animation: `chatBounce 1.2s ease-in-out ${n * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick actions — only shown before first user message */}
      {messages.length <= 1 && (
        <div style={{ padding: '0 14px 8px', display: 'flex', flexWrap: 'wrap', gap: '6px', flexShrink: 0 }}>
          {QUICK_ACTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => send(q)}
              style={{
                padding: '4px 10px',
                borderRadius: '20px',
                border: '1px solid #ddd6fe',
                background: '#faf5ff',
                color: '#7c3aed',
                fontSize: '0.72rem',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '10px 14px',
        borderTop: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask anything about your resume…"
          disabled={loading}
          style={{
            flex: 1,
            padding: '7px 10px',
            borderRadius: '8px',
            border: '1px solid #ddd6fe',
            fontSize: '0.8125rem',
            outline: 'none',
            background: loading ? '#fafafa' : '#fff',
          }}
        />
        <button
          type="button"
          onClick={() => send()}
          disabled={!input.trim() || loading}
          style={{
            padding: '7px 12px',
            borderRadius: '8px',
            border: 'none',
            background: input.trim() && !loading ? '#7c3aed' : '#e5e7eb',
            color: input.trim() && !loading ? '#fff' : '#9ca3af',
            cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            fontSize: '0.8125rem',
            fontWeight: 600,
            flexShrink: 0,
            transition: 'background 0.15s',
          }}
        >
          Send
        </button>
      </div>

      <style>{`
        @keyframes chatBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
