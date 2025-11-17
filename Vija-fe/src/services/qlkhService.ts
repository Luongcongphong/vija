import api from './api';

export interface QLKH {
  id?: number;
  po: string;
  ma_bv: string;
  so_luong: number;
  don_gia: number;
  thanh_tien?: number;
  created_at?: string;
}

export const qlkhService = {
  async getAll(): Promise<QLKH[]> {
    const response = await api.get('/qlkh');
    return response.data;
  },

  async getById(id: number): Promise<QLKH> {
    const response = await api.get(`/qlkh/${id}`);
    return response.data;
  },

  async create(data: QLKH): Promise<any> {
    const response = await api.post('/qlkh', data);
    return response.data;
  },

  async update(id: number, data: QLKH): Promise<any> {
    const response = await api.put(`/qlkh/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<any> {
    const response = await api.delete(`/qlkh/${id}`);
    return response.data;
  },
};
