import api from './api';

export interface QLNB {
  id?: number;
  ma_po: string;
  ma_bv: string;
  ma_kh?: string;
  so_luong?: number;
  dvt?: string;
  phoi_lieu: number;
  gia_cong_ngoai: number;
  gia_cong_noi_bo: number;
  xu_ly_be_mat: number;
  van_chuyen: number;
  phi_qldn: number;
  tong_phi?: number;
  created_at?: string;
}

export const qlnbService = {
  async getAll(): Promise<QLNB[]> {
    const response = await api.get('/qlnb');
    return response.data;
  },

  async getById(id: number): Promise<QLNB> {
    const response = await api.get(`/qlnb/${id}`);
    return response.data;
  },

  async create(data: QLNB): Promise<any> {
    const response = await api.post('/qlnb', data);
    return response.data;
  },

  async update(id: number, data: QLNB): Promise<any> {
    const response = await api.put(`/qlnb/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<any> {
    const response = await api.delete(`/qlnb/${id}`);
    return response.data;
  },
};
