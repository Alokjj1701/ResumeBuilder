import { useState, useCallback } from 'react';
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
      title="Drag to reorder"
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

function ExperienceItem({ item, index, onChange, onDelete }) {
  const [expanded, setExpanded] = useState(!item.company && !item.title);

  const handleField = useCallback((field, value) => {
    onChange({ ...item, [field]: value });
  }, [item, onChange]);

  const headerText = [item.title, item.company].filter(Boolean).join(' at ') || 'New Experience';

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      marginBottom: '0.75rem',
      background: 'var(--white)',
      // No overflow:hidden here — it clips textarea content as it grows
    }}>
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.75rem',
          background: expanded ? 'var(--bg)' : 'var(--white)',
          borderBottom: expanded ? '1px solid var(--border)' : 'none',
          gap: '0.5rem',
          // Keep rounded top corners on the header itself
          borderRadius: 'var(--radius) var(--radius) 0 0',
        }}
      >
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
            {headerText}
          </span>
          {item.startDate && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', flexShrink: 0 }}>
              {item.startDate} – {item.current ? 'Present' : (item.endDate || '')}
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

      {/* Expanded form */}
      {expanded && (
        <div style={{ padding: '0.875rem' }}>
          <div className="form-grid-2">
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Job Title</label>
              <input
                className="form-input"
                type="text"
                value={item.title || ''}
                onChange={(e) => handleField('title', e.target.value)}
                placeholder="Software Engineer"
              />
            </div>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Company</label>
              <input
                className="form-input"
                type="text"
                value={item.company || ''}
                onChange={(e) => handleField('company', e.target.value)}
                placeholder="Acme Corp"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label className="form-label">Location</label>
            <input
              className="form-input"
              type="text"
              value={item.location || ''}
              onChange={(e) => handleField('location', e.target.value)}
              placeholder="San Francisco, CA (or Remote)"
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Start Date</label>
              <input
                className="form-input"
                type="month"
                value={item.startDate || ''}
                onChange={(e) => handleField('startDate', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">End Date</label>
              <input
                className="form-input"
                type="month"
                value={item.endDate || ''}
                onChange={(e) => handleField('endDate', e.target.value)}
                disabled={!!item.current}
                placeholder={item.current ? 'Present' : ''}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={!!item.current}
                onChange={(e) => handleField('current', e.target.checked)}
              />
              I currently work here
            </label>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Description</label>
              <AiRewriteButton
                content={item.description}
                sectionType="experience"
                onAccept={(rewritten) => handleField('description', rewritten)}
              />
            </div>
            <textarea
              className="form-textarea"
              value={item.description || ''}
              onChange={(e) => handleField('description', e.target.value)}
              placeholder="• Describe your responsibilities and key achievements&#10;• Use bullet points starting with action verbs&#10;• Quantify achievements where possible (e.g., 'Increased performance by 40%')"
              rows={5}
            />
            <p className="form-hint">
              Use bullet points (•) for better readability. Start each with an action verb.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExperienceForm({ items, onChange }) {
  const handleItemChange = useCallback((id, updatedItem) => {
    onChange(items.map((item) => (item.id === id ? updatedItem : item)));
  }, [items, onChange]);

  const handleDelete = useCallback((id) => {
    onChange(items.filter((item) => item.id !== id));
  }, [items, onChange]);

  const handleAdd = useCallback(() => {
    const newItem = {
      id: uuidv4(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
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
        <Droppable droppableId="experience-list">
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
                      <ExperienceItem
                        item={item}
                        index={index}
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
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>No experience added yet</p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-lighter)' }}>
            Add your work history, internships, or freelance work
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
        Add Experience
      </button>
    </div>
  );
}
