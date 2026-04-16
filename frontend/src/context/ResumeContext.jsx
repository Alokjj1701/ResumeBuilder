import { createContext, useReducer, useCallback } from 'react';
import { DUMMY_RESUME, DUMMY_TITLE } from '../data/dummyResume';
import * as api from '../services/api';

export const ResumeContext = createContext(null);

// ── Default sections for a new resume ────────────────────────────────────────
const DEFAULT_SECTIONS = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

// ── Initial state ─────────────────────────────────────────────────────────────
const initialState = {
  resumes: [],
  currentResume: null,
  templates: [],
  selectedTemplateId: 'modern',
  loading: false,
  error: null,
  isDirty: false,
  saveStatus: 'idle', // idle | saving | saved | error
};

// ── Action types ──────────────────────────────────────────────────────────────
export const ActionTypes = {
  FETCH_RESUMES_SUCCESS: 'FETCH_RESUMES_SUCCESS',
  SET_CURRENT_RESUME: 'SET_CURRENT_RESUME',
  UPDATE_SECTIONS: 'UPDATE_SECTIONS',
  UPDATE_TEMPLATE: 'UPDATE_TEMPLATE',
  SET_TEMPLATES: 'SET_TEMPLATES',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_DIRTY: 'SET_DIRTY',
  SAVE_SUCCESS: 'SAVE_SUCCESS',
  SAVE_ERROR: 'SAVE_ERROR',
  SAVING: 'SAVING',
  UPDATE_TITLE: 'UPDATE_TITLE',
  DELETE_SECTION: 'DELETE_SECTION',
  RESTORE_SECTION: 'RESTORE_SECTION',
};

// ── Reducer ───────────────────────────────────────────────────────────────────
function resumeReducer(state, action) {
  switch (action.type) {
    case ActionTypes.FETCH_RESUMES_SUCCESS:
      return { ...state, resumes: action.payload, loading: false, error: null };

    case ActionTypes.SET_CURRENT_RESUME:
      return {
        ...state,
        currentResume: action.payload,
        selectedTemplateId: action.payload?.templateId || 'modern',
        isDirty: false,
        saveStatus: 'idle',
        loading: false,
        error: null,
      };

    case ActionTypes.UPDATE_SECTIONS:
      return {
        ...state,
        currentResume: state.currentResume
          ? { ...state.currentResume, sections: action.payload }
          : null,
        isDirty: true,
      };

    case ActionTypes.UPDATE_TITLE:
      return {
        ...state,
        currentResume: state.currentResume
          ? { ...state.currentResume, title: action.payload }
          : null,
        isDirty: true,
      };

    case ActionTypes.DELETE_SECTION:
      if (!state.currentResume) return state;
      return {
        ...state,
        currentResume: {
          ...state.currentResume,
          sections: { ...state.currentResume.sections, [action.payload]: null },
        },
        isDirty: true,
      };

    case ActionTypes.RESTORE_SECTION: {
      if (!state.currentResume) return state;
      const defaults = { summary: '', experience: [], education: [], skills: [], projects: [] };
      return {
        ...state,
        currentResume: {
          ...state.currentResume,
          sections: {
            ...state.currentResume.sections,
            [action.payload]: defaults[action.payload] ?? [],
          },
        },
        isDirty: true,
      };
    }

    case ActionTypes.UPDATE_TEMPLATE:
      return {
        ...state,
        selectedTemplateId: action.payload,
        currentResume: state.currentResume
          ? { ...state.currentResume, templateId: action.payload }
          : null,
        isDirty: true,
      };

    case ActionTypes.SET_TEMPLATES:
      return { ...state, templates: action.payload };

    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ActionTypes.SET_DIRTY:
      return { ...state, isDirty: action.payload };

    case ActionTypes.SAVING:
      return { ...state, saveStatus: 'saving' };

    case ActionTypes.SAVE_SUCCESS:
      return {
        ...state,
        isDirty: false,
        saveStatus: 'saved',
        currentResume: action.payload || state.currentResume,
      };

    case ActionTypes.SAVE_ERROR:
      return { ...state, saveStatus: 'error' };

    default:
      return state;
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function ResumeProvider({ children }) {
  const [state, dispatch] = useReducer(resumeReducer, initialState);

  // Load all resumes
  const loadResumes = useCallback(async () => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    try {
      const response = await api.getAllResumes();
      dispatch({ type: ActionTypes.FETCH_RESUMES_SUCCESS, payload: response.data });
    } catch (err) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: err.displayMessage || 'Failed to load resumes',
      });
    }
  }, []);

  // Load a single resume by id
  const loadResume = useCallback(async (id) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    try {
      const response = await api.getResume(id);
      dispatch({ type: ActionTypes.SET_CURRENT_RESUME, payload: response.data });
    } catch (err) {
      dispatch({ type: ActionTypes.SET_CURRENT_RESUME, payload: null });
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: err.displayMessage || 'Failed to load resume',
      });
    }
  }, []);

  // Save current resume (create or update)
  const saveResume = useCallback(async () => {
    const { currentResume } = state;
    if (!currentResume) return;

    dispatch({ type: ActionTypes.SAVING });
    try {
      let response;
      if (currentResume.id) {
        response = await api.updateResume(currentResume.id, currentResume);
      } else {
        response = await api.createResume(currentResume);
      }
      dispatch({ type: ActionTypes.SAVE_SUCCESS, payload: response.data });
      return response.data;
    } catch (err) {
      dispatch({ type: ActionTypes.SAVE_ERROR });
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: err.displayMessage || 'Failed to save resume',
      });
      throw err;
    }
  }, [state]);

  // Create a resume from AI-generated sections (used by AiBuilderModal)
  const createResumeFromSections = useCallback((sections, title, templateId = 'modern') => {
    dispatch({
      type: ActionTypes.SET_CURRENT_RESUME,
      payload: {
        id: null,
        title: title || 'AI Generated Resume',
        templateId: templateId || 'modern',
        sections,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }, []);

  // Create a new resume — loads with realistic dummy data by default
  const createNewResume = useCallback((templateId = 'modern', withDummyData = true) => {
    const newResume = {
      id: null,
      title: withDummyData ? DUMMY_TITLE : 'Untitled Resume',
      templateId: templateId || 'modern',
      sections: withDummyData ? { ...DUMMY_RESUME } : { ...DEFAULT_SECTIONS },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: ActionTypes.SET_CURRENT_RESUME, payload: newResume });
  }, []);

  // Delete a resume by id
  const deleteResumeById = useCallback(async (id) => {
    try {
      await api.deleteResume(id);
      await loadResumes();
    } catch (err) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: err.displayMessage || 'Failed to delete resume',
      });
      throw err;
    }
  }, [loadResumes]);

  // Load all templates
  const loadTemplates = useCallback(async () => {
    try {
      const response = await api.getAllTemplates();
      dispatch({ type: ActionTypes.SET_TEMPLATES, payload: response.data });
    } catch (err) {
      // Use hardcoded fallback templates if API fails
      dispatch({
        type: ActionTypes.SET_TEMPLATES,
        payload: FALLBACK_TEMPLATES,
      });
    }
  }, []);

  // Update sections in current resume
  const updateSections = useCallback((sections) => {
    dispatch({ type: ActionTypes.UPDATE_SECTIONS, payload: sections });
  }, []);

  // Update resume title
  const updateTitle = useCallback((title) => {
    dispatch({ type: ActionTypes.UPDATE_TITLE, payload: title });
  }, []);

  // Change template
  const changeTemplate = useCallback((templateId) => {
    dispatch({ type: ActionTypes.UPDATE_TEMPLATE, payload: templateId });
  }, []);

  // Export PDF — try backend first, then fall back to client-side
  const exportPdf = useCallback(async (id) => {
    try {
      if (id) {
        const response = await api.exportResumePdf(id);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `resume-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: 'PDF export failed. Please try again.',
      });
      throw err;
    }
  }, []);

  // Delete a section from the current resume (sets value to null → hides in preview + editor)
  const deleteSection = useCallback((sectionKey) => {
    dispatch({ type: ActionTypes.DELETE_SECTION, payload: sectionKey });
  }, []);

  // Restore a previously deleted section back to its empty default
  const restoreSection = useCallback((sectionKey) => {
    dispatch({ type: ActionTypes.RESTORE_SECTION, payload: sectionKey });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: null });
  }, []);

  const value = {
    state,
    dispatch,
    loadResumes,
    loadResume,
    saveResume,
    createNewResume,
    createResumeFromSections,
    deleteResume: deleteResumeById,
    loadTemplates,
    updateSections,
    updateTitle,
    changeTemplate,
    exportPdf,
    clearError,
    deleteSection,
    restoreSection,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

// ── Fallback templates when backend is unavailable ────────────────────────────
const FALLBACK_TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    category: 'Professional',
    description: 'Clean modern design with a color accent and two-column layout.',
    features: ['Two-column layout', 'Color accent bar', 'Skills sidebar', 'ATS-friendly'],
    color: '#2563eb',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    category: 'Simple',
    description: 'Minimalist single-column design. Timeless and elegant.',
    features: ['Single column', 'Black & white', 'Serif typography', 'Maximum whitespace'],
    color: '#1f2937',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    category: 'Traditional',
    description: 'Traditional corporate layout with a dark header and structured sections.',
    features: ['Dark header bar', 'Left border accents', 'Single column', 'Conservative style'],
    color: '#1e3a5f',
  },
  {
    id: 'two-column',
    name: 'Two Column',
    category: 'Structured',
    description: 'Balanced two-column layout with contact info on the left.',
    features: ['Equal columns', 'Photo placeholder', 'Gray sidebar', 'Contact sidebar'],
    color: '#374151',
  },
  {
    id: 'creative',
    name: 'Creative',
    category: 'Creative',
    description: 'Bold creative design perfect for designers and artists.',
    features: ['Purple gradient header', 'Colorful skill tags', 'Bold typography', 'Creative flair'],
    color: '#8B5CF6',
  },
  {
    id: 'tech',
    name: 'Tech',
    category: 'Technical',
    description: 'Clean technical template built for software engineers.',
    features: ['Prominent links', 'Tech stack tags', 'Projects first', 'Monospace accents'],
    color: '#0f172a',
  },
];
