import api from './api';

export interface QLDM {
  id?: number;
  ma_kh?: string;
  so_bg?: string;
  ngay_bg?: string;
  ma_bv: string;
  nguyen_lieu?: string;
  xlbm?: string;
  dvt?: string;
  so_luong: number;
  don_gia: number;
  don_vi_tien_te?: string;
  ghi_chu?: string;
  created_at?: string;
  updated_at?: string;
}

export const qldmService = {
  // Lấy tất cả định mức
  getAll: () => api.get<QLDM[]>('/qldm'),

  // Lấy định mức theo ID
  getById: (id: number) => api.get<QLDM>(`/qldm/${id}`),

  // Lấy danh sách Mã BV
  getAllMaBV: () => api.get<{ ma_bv: string }[]>('/qldm/ma-bv'),

  // Tạo định mức mới
  create: (data: Partial<QLDM>) => api.post<{ message: string; id: number }>('/qldm', data),

  // Cập nhật định mức
  update: (id: number, data: Partial<QLDM>) => 
    api.put<{ message: string }>(`/qldm/${id}`, data),

  // Xóa định mức
  delete: (id: number) => api.delete<{ message: string }>(`/qldm/${id}`)
};
