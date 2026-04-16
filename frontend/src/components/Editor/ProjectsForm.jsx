import { useState, useCallback, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import AiRewriteButton from '../AI/AiRewriteButton';

function DragHandle() {
  return (
    <div
      style={{
        cursor: 'grab',
        color: 'var(--text-lighter)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 4px',
        flexShrink: 0,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="5" r="1.5" />
        <circle cx="15" cy="5" r="1.5" />
        <circle cx="9" cy="12" r="1.5" />
        <circle cx="15" cy="12" r="1.5" />
        <circle cx="9" cy="19" r="1.5" />
        <circle cx="15" cy="19" r="1.5" />
      </svg>
    </div>
  );
}

function TechTagInput({ tags, onChange }) {
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

  return (
    <div
      className="tag-input-container"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <span key={tag} className="tag-item" style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>
          {tag}
          <button
            type="button"
            className="tag-remove"
            onClick={(e) => {
              e.stopPropagation();
              onChange(tags.filter((t) => t !== tag));
            }}
            style={{ color: '#166534' }}
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
        placeholder={tags.length === 0 ? 'React, TypeScript, Node.js...' : ''}
      />
    </div>
  );
}

function ProjectItem({ item, onChange, onDelete }) {
  const [expanded, setExpanded] = useState(!item.name);

  const handleField = useCallback((field, value) => {
    onChange({ ...item, [field]: value });
  }, [item, onChange]);

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      marginBottom: '0.75rem',
      background: 'var(--white)',
      // No overflow:hidden — it clips the AI rewrite dropdown
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem',
        background: expanded ? 'var(--bg)' : 'var(--white)',
        borderBottom: expanded ? '1px solid var(--border)' : 'none',
        gap: '0.5rem',
      }}>
        <DragHandle />

        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            minWidth: 0,
          }}
        >
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--text)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {item.name || 'New Project'}
          </span>
          {item.technologies && item.technologies.length > 0 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', flexShrink: 0 }}>
              {item.technologies.slice(0, 3).join(', ')}
              {item.technologies.length > 3 ? ` +${item.technologies.length - 3}` : ''}
            </span>
          )}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-light)"
            strokeWidth="2"
            style={{
              flexShrink: 0,
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform var(--transition)',
              marginLeft: 'auto',
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <button
          className="btn btn-ghost btn-sm btn-icon"
          onClick={() => onDelete(item.id)}
          title="Remove"
          style={{ flexShrink: 0, color: 'var(--danger)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div style={{ padding: '0.875rem' }}>
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label className="form-label">Project Name</label>
            <input
              className="form-input"
              type="text"
              value={item.name || ''}
              onChange={(e) => handleField('name', e.target.value)}
              placeholder="My Awesome Project"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Description</label>
              <AiRewriteButton
                content={item.description}
                sectionType="projects"
                onAccept={(rewritten) => handleField('description', rewritten)}
              />
            </div>
            <textarea
              className="form-textarea"
              value={item.description || ''}
              onChange={(e) => handleField('description', e.target.value)}
              placeholder="Describe what this project does, your role, and key accomplishments..."
              rows={4}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label className="form-label">Technologies</label>
            <TechTagInput
              tags={item.technologies || []}
              onChange={(tags) => handleField('technologies', tags)}
            />
            <p className="form-hint" style={{ marginTop: '0.375rem', fontSize: '0.725rem' }}>
              Press Enter or comma after each technology
            </p>
          </div>

          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label className="form-label">Project URL</label>
            <input
              className="form-input"
              type="url"
              value={item.url || ''}
              onChange={(e) => handleField('url', e.target.value)}
              placeholder="https://github.com/user/project"
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Start Date</label>
              <input
                className="form-input"
                type="month"
                value={item.startDate || ''}
                onChange={(e) => handleField('startDate', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">End Date</label>
              <input
                className="form-input"
                type="month"
                value={item.endDate || ''}
                onChange={(e) => handleField('endDate', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectsForm({ items, onChange }) {
  const handleItemChange = useCallback((id, updatedItem) => {
    onChange(items.map((item) => (item.id === id ? updatedItem : item)));
  }, [items, onChange]);

  const handleDelete = useCallback((id) => {
    onChange(items.filter((item) => item.id !== id));
  }, [items, onChange]);

  const handleAdd = useCallback(() => {
    const newItem = {
      id: uuidv4(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      startDate: '',
      endDate: '',
    };
    onChange([...items, newItem]);
  }, [items, onChange]);

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;
    const list = Array.from(items);
    const [removed] = list.splice(result.source.index, 1);
    list.splice(result.destination.index, 0, removed);
    onChange(list);
  }, [items, onChange]);

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="projects-list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.8 : 1,
                      }}
                    >
                      <ProjectItem
                        item={item}
                        onChange={(updated) => handleItemChange(item.id, updated)}
                        onDelete={handleDelete}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

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
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>No projects added yet</p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-lighter)' }}>
            Showcase your personal and professional projects
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
        Add Project
      </button>
    </div>
  );
}
