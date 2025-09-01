import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance
const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      delete apiClient.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Events API
export const eventsAPI = {
  getEvents: (statusFilter = 'all') => 
    apiClient.get(`/events?status_filter=${statusFilter}`),
  
  getEvent: (eventId) => 
    apiClient.get(`/events/${eventId}`),
  
  registerForEvent: (eventId) => 
    apiClient.post(`/events/${eventId}/register`),
  
  unregisterFromEvent: (eventId) => 
    apiClient.delete(`/events/${eventId}/register`),
  
  createEvent: (eventData) => 
    apiClient.post('/events', eventData),
};

// Community API
export const communityAPI = {
  getPosts: (limit = 10, skip = 0) => 
    apiClient.get(`/community/posts?limit=${limit}&skip=${skip}`),
  
  createPost: (postData) => 
    apiClient.post('/community/posts', postData),
  
  updatePost: (postId, postData) => 
    apiClient.put(`/community/posts/${postId}`, postData),
  
  deletePost: (postId) => 
    apiClient.delete(`/community/posts/${postId}`),
  
  likePost: (postId) => 
    apiClient.post(`/community/posts/${postId}/like`),
  
  addComment: (postId, commentData) => 
    apiClient.post(`/community/posts/${postId}/comment`, commentData),
  
  getComments: (postId) => 
    apiClient.get(`/community/posts/${postId}/comments`),
  
  getFeaturedMembers: () => 
    apiClient.get('/community/members'),
  
  getCommunityStats: () => 
    apiClient.get('/community/stats'),
};

// Membership API
export const membershipAPI = {
  getPlans: () => 
    apiClient.get('/membership/plans'),
  
  subscribeToPlan: (planData) => 
    apiClient.post('/membership/subscribe', planData),
  
  getMembershipCard: (userId) => 
    apiClient.get(`/membership/card/${userId}`),
  
  getMyCard: () => 
    apiClient.get('/membership/my-card'),
  
  generateNewCard: () => 
    apiClient.post('/membership/generate-card'),
  
  getStats: () => 
    apiClient.get('/membership/stats'),
};

// QR API
export const qrAPI = {
  generateQR: (qrData) => 
    apiClient.post('/qr/generate', qrData),
  
  scanQR: (qrCode) => 
    apiClient.post('/qr/scan', { qrCode }),
  
  verifyAccess: (accessData) => 
    apiClient.post('/qr/verify', accessData),
  
  getAccessLogs: () => 
    apiClient.get('/qr/access-logs'),
};

// Auth API
export const authAPI = {
  login: (credentials) => 
    apiClient.post('/auth/login', credentials),
  
  register: (userData) => 
    apiClient.post('/auth/register', userData),
  
  getProfile: () => 
    apiClient.get('/auth/me'),
  
  updateProfile: (profileData) => 
    apiClient.put('/auth/profile', profileData),
  
  generateQR: () => 
    apiClient.post('/auth/qr-generate'),
};

export default apiClient;