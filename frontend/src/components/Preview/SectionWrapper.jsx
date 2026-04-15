import { useState, useContext } from 'react';
import { PreviewContext } from '../../context/PreviewContext';

// Sections that cannot be removed (header / contact info)
const PROTECTED_KEYS = new Set(['personalInfo']);

/**
 * SectionWrapper — wraps a resume section in the live builder preview.
 *
 * - Not in edit mode (thumbnail): renders children as-is, zero overhead.
 * - In edit mode: shows a red trash icon on hover + dashed border highlight.
 *   Clicking the trash icon triggers a fade-out then calls onDeleteSection.
 */
export default function SectionWrapper({ sectionKey, children }) {
  const ctx = useContext(PreviewContext);
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Transparent passthrough outside the builder (thumbnail grids)
  if (!ctx?.isEditMode) return <>{children}</>;

  const canDelete = !PROTECTED_KEYS.has(sectionKey);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (!canDelete || deleting) return;
    setDeleting(true);
    // Let the CSS transition finish before removing from state
    setTimeout(() => {
      ctx.onDeleteSection(sectionKey);
    }, 280);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        transition: 'opacity 0.28s ease, transform 0.28s ease',
        opacity: deleting ? 0 : 1,
        transform: deleting ? 'translateX(10px)' : 'translateX(0)',
        borderRadius: '4px',
        outline: hovered && canDelete && !deleting
          ? '1.5px dashed rgba(239, 68, 68, 0.4)'
          : '1.5px dashed transparent',
        outlineOffset: '2px',
      }}
    >
      {children}

      {/* Delete button — only visible on hover in edit mode */}
      {hovered && canDelete && !deleting && (
        <button
          title="Delete Section"
          onClick={handleDelete}
          style={{
            position: 'absolute',
            top: '-9px',
            right: '-9px',
            zIndex: 200,
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            background: '#ef4444',
            border: '2px solid #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(239,68,68,0.45)',
            padding: 0,
            lineHeight: 1,
          }}
        >
          {/* Trash icon */}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      )}
    </div>
  );
}
