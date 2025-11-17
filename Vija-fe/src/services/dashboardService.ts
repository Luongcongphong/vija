import api from './api';

export interface DashboardData {
  id: number;
  po: string;
  ma_bv: string;
  so_luong: number;
  don_gia: number;
  thanh_tien: number;
  phoi_lieu: number;
  gia_cong_ngoai: number;
  gia_cong_noi_bo: number;
  xu_ly_be_mat: number;
  van_chuyen: number;
  phi_qldn: number;
  tong_phi: number;
  loi_nhuan: number;
  ty_le: number;
  ngay_tao: string;
}

export const dashboardService = {
  async getData(): Promise<DashboardData[]> {
    const response = await api.get('/dashboard');
    return response.data;
  },
};
