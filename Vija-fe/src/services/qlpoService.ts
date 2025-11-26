import api from './api';

export interface QLPO {
  id?: number;
  ma_po: string;
  ma_bv: string;
  ngay_tao?: string;
  ngay_giao?: string;
  created_at?: string;
  updated_at?: string;
}

export const qlpoService = {
  // Lấy tất cả PO
  getAll: () => api.get<QLPO[]>('/qlpo'),

  // Lấy PO theo ID
  getById: (id: number) => api.get<QLPO>(`/qlpo/${id}`),

  // Lấy PO theo Mã PO
  getByMaPO: (ma_po: string) => api.get<QLPO[]>(`/qlpo/by-ma-po/${ma_po}`),

  // Lấy danh sách Mã PO
  getAllMaPO: () => api.get<{ ma_po: string }[]>('/qlpo/ma-po'),

  // Tạo PO mới
  create: (data: Partial<QLPO>) => api.post<{ message: string; id: number }>('/qlpo', data),

  // Cập nhật PO
  update: (id: number, data: Partial<QLPO>) => 
    api.put<{ message: string }>(`/qlpo/${id}`, data),

  // Xóa PO
  delete: (id: number) => api.delete<{ message: string }>(`/qlpo/${id}`)
};
