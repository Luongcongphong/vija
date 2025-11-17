import api from './api';

export interface QLDM {
  id?: number;
  po: string;
  ma_bv: string;
  so_luong: number;
  don_gia: number;
  dinh_muc: number;
  created_at?: string;
}

export const qldmService = {
  async getAll(): Promise<QLDM[]> {
    const response = await api.get('/qldm');
    return response.data;
  },

  async getById(id: number): Promise<QLDM> {
    const response = await api.get(`/qldm/${id}`);
    return response.data;
  },

  async create(data: QLDM): Promise<any> {
    const response = await api.post('/qldm', data);
    return response.data;
  },

  async update(id: number, data: QLDM): Promise<any> {
    const response = await api.put(`/qldm/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<any> {
    const response = await api.delete(`/qldm/${id}`);
    return response.data;
  },
};
