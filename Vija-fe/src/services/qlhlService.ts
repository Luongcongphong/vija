import api from './api';

export interface QLHL {
  id?: number;
  qlpo_id: number;
  ma_po: string;
  ma_bv?: string;
  ma_kh?: string;
  dvt?: string;
  sl: number;
  giao_bu: number;
  ngay_tra?: string;
  ngay_giao_bu?: string;
  created_at?: string;
  updated_at?: string;
}

export const qlhlService = {
  // Lấy tất cả Hàng Lỗi
  getAll: () => api.get<QLHL[]>('/qlhl'),

  // Lấy Hàng Lỗi theo ID
  getById: (id: number) => api.get<QLHL>(`/qlhl/${id}`),

  // Lấy Hàng Lỗi theo QLPO ID
  getByQLPOId: (qlpo_id: number) => api.get<QLHL[]>(`/qlhl/by-po/${qlpo_id}`),

  // Tạo Hàng Lỗi mới
  create: (data: Partial<QLHL>) => api.post<{ message: string; id: number }>('/qlhl', data),

  // Cập nhật Hàng Lỗi
  update: (id: number, data: Partial<QLHL>) => 
    api.put<{ message: string }>(`/qlhl/${id}`, data),

  // Xóa Hàng Lỗi theo ID
  delete: (id: number) => api.delete<{ message: string }>(`/qlhl/${id}`)
};
