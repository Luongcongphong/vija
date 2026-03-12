import api from './api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      // Set tất cả các flag cần thiết ngay lập tức
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('isAuthenticated', 'true');
    }
    return response.data;
  },

  async register(data: RegisterRequest): Promise<any> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout() {
    // Clear tất cả các flag
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
  },

  isAuthenticated(): boolean {
    const hasToken = !!localStorage.getItem('token');
    const isAuthFlag = localStorage.getItem('isAuthenticated') === 'true';
    return hasToken && isAuthFlag;
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
