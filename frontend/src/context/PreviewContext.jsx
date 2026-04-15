import { createContext } from 'react';

/**
 * PreviewContext — provides edit-mode capabilities to templates rendered inside the builder.
 *
 * When isEditMode is false (thumbnail previews in TemplatesGrid / TemplateSelector),
 * SectionWrapper is a transparent passthrough and no delete UI is shown.
 *
 * When isEditMode is true (live preview in the builder), SectionWrapper shows
 * a hover-to-delete button and dashed border highlight.
 */
export const PreviewContext = createContext(null);
