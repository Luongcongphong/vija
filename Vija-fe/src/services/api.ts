import axios from 'axios';

// Tự động detect hostname của server hiện tại
const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const defaultApiUrl = `http://${currentHost}:3000/api`;
const API_BASE_URL = import.meta.env.VITE_API_URL || defaultApiUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào mọi request
api.interceptors.request.use(
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

// Interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
      
      // Chỉ xử lý nếu không phải đang ở trang login
      if (!currentPath.includes('/signin')) {
        // Clear tất cả auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('currentUser');
        
        // Redirect về signin - sử dụng replace để không tạo history
        window.location.replace('/signin');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
