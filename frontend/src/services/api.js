import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    error.displayMessage = message;
    return Promise.reject(error);
  }
);

// ── Resumes ──────────────────────────────────────────────────────────────────
export const getAllResumes = () => api.get('/api/resumes');
export const getResume = (id) => api.get(`/api/resumes/${id}`);
export const createResume = (data) => api.post('/api/resumes', data);
export const updateResume = (id, data) => api.put(`/api/resumes/${id}`, data);
export const deleteResume = (id) => api.delete(`/api/resumes/${id}`);
export const exportResumePdf = (id) =>
  api.get(`/api/resumes/${id}/export/pdf`, { responseType: 'blob' });

// ── Templates ─────────────────────────────────────────────────────────────────
export const getAllTemplates = () => api.get('/api/templates');
export const getTemplate = (id) => api.get(`/api/templates/${id}`);

export default api;
