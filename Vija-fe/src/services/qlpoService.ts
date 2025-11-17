import api from './api';

export interface QLPO {
  id?: number;
  po: string;
  ma_bv: string;
  created_at?: string;
}

export const qlpoService = {
  async getAll(): Promise<QLPO[]> {
    const response = await api.get('/qlpo');
    return response.data;
  },

  async getById(id: number): Promise<QLPO> {
    const response = await api.get(`/qlpo/${id}`);
    return response.data;
  },

  async create(data: QLPO): Promise<any> {
    const response = await api.post('/qlpo', data);
    return response.data;
  },

  async update(id: number, data: QLPO): Promise<any> {
    const response = await api.put(`/qlpo/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<any> {
    const response = await api.delete(`/qlpo/${id}`);
    return response.data;
  },
};
