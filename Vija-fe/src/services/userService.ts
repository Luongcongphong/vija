import api from './api';

export interface User {
  id?: number;
  username: string;
  password?: string;
  role?: 'admin' | 'sales' | 'kythuat';
  created_at?: string;
}

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  },

  async getById(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async create(data: User): Promise<any> {
    const response = await api.post('/users', data);
    return response.data;
  },

  async update(id: number, data: User): Promise<any> {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<any> {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
