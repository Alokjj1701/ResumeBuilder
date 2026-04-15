import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

function TagInput({ tags, onChange, placeholder = 'Type and press Enter or comma...' }) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const addTag = useCallback((raw) => {
    const value = raw.trim().replace(/,+$/, '').trim();
    if (!value) return;
    if (!tags.includes(value)) {
      onChange([...tags, value]);
    }
    setInputValue('');
  }, [tags, onChange]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }, [inputValue, tags, addTag, onChange]);

  const handleChange = useCallback((e) => {
    const val = e.target.value;
    if (val.endsWith(',')) {
      addTag(val.slice(0, -1));
    } else {
      setInputValue(val);
    }
  }, [addTag]);

  const removeTag = useCallback((tag) => {
    onChange(tags.filter((t) => t !== tag));
  }, [tags, onChange]);

  return (
    <div
      className="tag-input-container"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <span key={tag} className="tag-item">
          {tag}
          <button
            type="button"
            className="tag-remove"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag);
            }}
            aria-label={`Remove ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        className="tag-input-field"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (inputValue.trim()) addTag(inputValue); }}
        placeholder={tags.length === 0 ? placeholder : ''}
      />
    </div>
  );
}

function SkillGroup({ group, onChange, onDelete }) {
  const handleCategoryChange = useCallback((e) => {
    onChange({ ...group, category: e.target.value });
  }, [group, onChange]);

  const handleSkillsChange = useCallback((items) => {
    onChange({ ...group, items });
  }, [group, onChange]);

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      marginBottom: '0.75rem',
      background: 'var(--white)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
      }}>
        <input
          className="form-input"
          type="text"
          value={group.category || ''}
          onChange={handleCategoryChange}
          placeholder="Category (e.g. Languages, Frameworks, Tools)"
          style={{ flex: 1, border: 'none', background: 'transparent', padding: '0', fontWeight: 600, fontSize: '0.875rem' }}
        />
        <button
          className="btn btn-ghost btn-sm btn-icon"
          onClick={() => onDelete(group.id)}
          title="Remove group"
          style={{ flexShrink: 0, color: 'var(--danger)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
      <div style={{ padding: '0.75rem' }}>
        <TagInput
          tags={group.items || []}
          onChange={handleSkillsChange}
          placeholder="Add skill and press Enter..."
        />
        <p className="form-hint" style={{ marginTop: '0.375rem', fontSize: '0.725rem' }}>
          Press Enter or comma to add each skill. Backspace to remove last.
        </p>
      </div>
    </div>
  );
}

export default function SkillsForm({ items, onChange }) {
  const handleGroupChange = useCallback((id, updatedGroup) => {
    onChange(items.map((g) => (g.id === id ? updatedGroup : g)));
  }, [items, onChange]);

  const handleDelete = useCallback((id) => {
    onChange(items.filter((g) => g.id !== id));
  }, [items, onChange]);

  const handleAdd = useCallback(() => {
    const newGroup = {
      id: uuidv4(),
      category: '',
      items: [],
    };
    onChange([...items, newGroup]);
  }, [items, onChange]);

  // Collect all skills for a preview
  const totalSkills = items.reduce((acc, g) => acc + (g.items || []).length, 0);

  return (
    <div>
      {items.map((group) => (
        <SkillGroup
          key={group.id}
          group={group}
          onChange={(updated) => handleGroupChange(group.id, updated)}
          onDelete={handleDelete}
        />
      ))}

      {items.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--text-light)',
          border: '2px dashed var(--border)',
          borderRadius: 'var(--radius)',
          marginBottom: '0.75rem',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 0.5rem', color: 'var(--border-dark)' }}>
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>No skill groups yet</p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-lighter)' }}>
            Organize skills by category (e.g., Languages, Frameworks, Tools)
          </p>
        </div>
      )}

      <button
        className="btn btn-secondary"
        onClick={handleAdd}
        style={{ width: '100%' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Skill Group
      </button>

      {totalSkills > 0 && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'var(--success-light)',
          borderRadius: 'var(--radius)',
          border: '1px solid #6ee7b7',
        }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--success-dark)', fontWeight: 500 }}>
            {totalSkills} skill{totalSkills !== 1 ? 's' : ''} across {items.length} categor{items.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
      )}
    </div>
  );
}
