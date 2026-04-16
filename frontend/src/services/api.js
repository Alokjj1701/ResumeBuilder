import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// ── Module-level token store (avoids circular dep with AuthContext) ──────────
let _accessToken = null;

export const setAccessToken = (token) => { _accessToken = token; };
export const clearAccessToken = () => { _accessToken = null; };
export const getAccessToken = () => _accessToken;

// ── Auth-only axios instance (no interceptors — used for login/register/refresh)
export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,    // sends the HttpOnly refresh cookie automatically
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// ── Main API instance (attaches access token, handles silent refresh on 401) ─
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Silent refresh state
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

// Request interceptor — attach access token
api.interceptors.request.use((config) => {
  if (_accessToken) {
    config.headers.Authorization = `Bearer ${_accessToken}`;
  }
  return config;
});

// Response interceptor — silent refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await authApi.post('/auth/refresh');
        const newToken = data.accessToken;
        setAccessToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();
        // Redirect to login — avoids importing useNavigate outside React
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Attach a readable message for error display
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

export const sendResumePdfEmail = (id) =>
  api.post(`/api/resumes/${id}/send-pdf-email`);

// Sends the client-rendered PDF (correct template) to the user's email.
export const sendResumePdfEmailWithBytes = (id, pdfBlob, fileName) => {
  const form = new FormData();
  form.append('pdf', pdfBlob, fileName || 'Resume.pdf');
  return api.post(`/api/resumes/${id}/send-pdf-email`, form);
};

// ── Templates ─────────────────────────────────────────────────────────────────
export const getAllTemplates = () => api.get('/api/templates');
export const getTemplate = (id) => api.get(`/api/templates/${id}`);

export default api;
