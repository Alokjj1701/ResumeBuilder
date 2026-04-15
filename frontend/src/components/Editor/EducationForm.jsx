import { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';

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

function EducationItem({ item, onChange, onDelete }) {
  const [expanded, setExpanded] = useState(!item.institution && !item.degree);

  const handleField = useCallback((field, value) => {
    onChange({ ...item, [field]: value });
  }, [item, onChange]);

  const headerText = [item.degree, item.institution].filter(Boolean).join(' — ') || 'New Education';

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      marginBottom: '0.75rem',
      background: 'var(--white)',
      // No overflow:hidden — it clips textarea content as it grows
    }}>
      {/* Header row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem',
        background: expanded ? 'var(--bg)' : 'var(--white)',
        borderBottom: expanded ? '1px solid var(--border)' : 'none',
        gap: '0.5rem',
        borderRadius: 'var(--radius) var(--radius) 0 0',
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
            {headerText}
          </span>
          {item.startDate && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', flexShrink: 0 }}>
              {item.startDate} – {item.endDate || 'Present'}
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
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label className="form-label">Institution</label>
            <input
              className="form-input"
              type="text"
              value={item.institution || ''}
              onChange={(e) => handleField('institution', e.target.value)}
              placeholder="University of California, Berkeley"
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Degree</label>
              <input
                className="form-input"
                type="text"
                value={item.degree || ''}
                onChange={(e) => handleField('degree', e.target.value)}
                placeholder="Bachelor of Science"
              />
            </div>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Field of Study</label>
              <input
                className="form-input"
                type="text"
                value={item.fieldOfStudy || ''}
                onChange={(e) => handleField('fieldOfStudy', e.target.value)}
                placeholder="Computer Science"
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
              placeholder="Berkeley, CA"
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
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label className="form-label">GPA (optional)</label>
            <input
              className="form-input"
              type="text"
              value={item.gpa || ''}
              onChange={(e) => handleField('gpa', e.target.value)}
              placeholder="3.8 / 4.0"
              style={{ maxWidth: '160px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Additional Details</label>
            <textarea
              className="form-textarea"
              value={item.description || ''}
              onChange={(e) => handleField('description', e.target.value)}
              placeholder="Relevant coursework, honors, activities, thesis title, etc."
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function EducationForm({ items, onChange }) {
  const handleItemChange = useCallback((id, updatedItem) => {
    onChange(items.map((item) => (item.id === id ? updatedItem : item)));
  }, [items, onChange]);

  const handleDelete = useCallback((id) => {
    onChange(items.filter((item) => item.id !== id));
  }, [items, onChange]);

  const handleAdd = useCallback(() => {
    const newItem = {
      id: uuidv4(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
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
        <Droppable droppableId="education-list">
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
                      <EducationItem
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
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
          <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>No education added yet</p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-lighter)' }}>
            Add your degrees, certifications, or courses
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
        Add Education
      </button>
    </div>
  );
}
