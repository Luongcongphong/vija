import api from './api';

export interface QLBG {
  id?: number;
  stt: number;
  so_bg: string;
  ma_bv: string;
  so_luong: number;
  don_gia: number;
  thanh_tien: number;
  created_at?: string;
  updated_at?: string;
}

export const qlbgService = {
  // Lấy tất cả báo giá
  getAll: () => api.get<QLBG[]>('/qlbg'),

  // Lấy báo giá theo ID
  getById: (id: number) => api.get<QLBG>(`/qlbg/${id}`),

  // Lấy báo giá theo Số BG
  getBySoBG: (so_bg: string) => api.get<QLBG[]>(`/qlbg/by-so-bg/${so_bg}`),

  // Lấy danh sách Số BG
  getAllSoBG: () => api.get<{ so_bg: string }[]>('/qlbg/so-bg'),

  // Lấy đơn giá từ QLDM
  getDonGia: (ma_bv: string, so_luong: number) => 
    api.get<{ don_gia: number; range?: string }>(`/qlbg/don-gia?ma_bv=${ma_bv}&so_luong=${so_luong}`),

  // Tạo báo giá mới
  create: (data: Partial<QLBG>) => api.post<{ message: string; data: QLBG }>('/qlbg', data),

  // Cập nhật báo giá
  update: (id: number, data: Partial<QLBG>) => 
    api.put<{ message: string }>(`/qlbg/${id}`, data),

  // Xóa báo giá theo ID
  delete: (id: number) => api.delete<{ message: string }>(`/qlbg/${id}`),

  // Xóa tất cả báo giá theo Số BG
  deleteBySoBG: (so_bg: string) => 
    api.delete<{ message: string; deletedCount: number }>(`/qlbg/by-so-bg/${so_bg}`)
};
