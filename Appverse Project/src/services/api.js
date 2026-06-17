import axios from 'axios';
 
const BASE_URL = 'http://localhost:8080';
 
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});
 
// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
 
// If token expired, redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
 
// ── AUTH ──────────────────────────────────────
export const registerUser = (data) => api.post('/api/users/register', data);
export const loginUser = (data) => api.post('/api/users/login', data);
 
// ── USERS ─────────────────────────────────────
export const getAllUsers = () => api.get('/api/users');
export const getUserById = (id) => api.get(`/api/users/${id}`);
export const deleteUser = (id) => api.delete(`/api/users/${id}`);
 
// ── CATEGORIES ────────────────────────────────
export const getAllCategories = () => api.get('/api/categories');
export const createCategory = (data) => api.post('/api/categories', data);
export const updateCategory = (id, data) => api.put(`/api/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/api/categories/${id}`);
 
// ── APPS ──────────────────────────────────────
export const getAllApps = () => api.get('/api/apps');
export const getAppById = (id) => api.get(`/api/apps/${id}`);
export const searchApps = (keyword) => api.get(`/api/apps/search?keyword=${keyword}`);
export const getAppsByCategory = (categoryId) => api.get(`/api/apps/category/${categoryId}`);
export const createApp = (data) => api.post('/api/apps', data);
export const updateApp = (id, data) => api.put(`/api/apps/${id}`, data);
export const deleteApp = (id) => api.delete(`/api/apps/${id}`);
export const getTrendingApps = () => api.get('/api/apps/trending');
 
// ── APP VERSIONS ──────────────────────────────
export const getAllVersions = () => api.get('/api/app-versions');
export const getVersionsByApp = (appId) => api.get(`/api/app-versions/app/${appId}`);
export const createVersion = (data) => api.post('/api/app-versions', data);
export const deleteVersion = (id) => api.delete(`/api/app-versions/${id}`);
 
// ── REVIEWS ───────────────────────────────────
export const getReviewsByApp = (appId) => api.get(`/api/reviews/app/${appId}`);
export const getAllReviews = () => api.get('/api/reviews');
export const createReview = (data) => api.post('/api/reviews', data);
export const deleteReview = (id) => api.delete(`/api/reviews/${id}`);
 
// ── DOWNLOADS ─────────────────────────────────
export const downloadApp = (userId, appId) => api.post(`/api/downloads/user/${userId}/app/${appId}`);
export const getDownloadsByUser = (userId) => api.get(`/api/downloads/user/${userId}`);
export const getDownloadsByApp = (appId) => api.get(`/api/downloads/app/${appId}`);
export const getTotalDownloads = (appId) => api.get(`/api/downloads/app/${appId}/count`);
export const getAllDownloads = () => api.get('/api/downloads');
export const getDownloadAnalytics = () => api.get('/api/downloads/analytics');
 
 
// ── DEVELOPER PROFILES ────────────────────────
export const getAllProfiles = () => api.get('/api/developer-profiles');
export const getProfileByUser = (userId) => api.get(`/api/developer-profiles/user/${userId}`);
export const createProfile = (data) => api.post('/api/developer-profiles', data);
export const updateProfile = (id, data) => api.put(`/api/developer-profiles/${id}`, data);
 
// ── RECOMMENDATIONS ───────────────────────────
export const getRecommendationsByUser = (userId) => api.get(`/api/recommendations/user/${userId}`);
export const getAllRecommendations = () => api.get('/api/recommendations');
export const createRecommendation = (data) => api.post('/api/recommendations', data);
export const deleteRecommendation = (id) => api.delete(`/api/recommendations/${id}`);