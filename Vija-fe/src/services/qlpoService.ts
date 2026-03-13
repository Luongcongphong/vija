import api from './api';

export interface QLPO {
  id?: number;
  ma_po: string;
  ma_bv: string;
  ma_kh?: string;
  so_luong?: number;
  dvt?: string;
  ngay_tao?: string;
  ngay_giao?: string;
  sl_da_giao?: number;
  created_at?: string;
  updated_at?: string;
}

export interface QLPODelivery {
  id?: number;
  qlpo_id: number;
  lan_giao: number;
  so_luong_giao: number;
  ngay_giao: string;
  created_at?: string;
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

  // Xóa PO theo ID
  delete: (id: number) => api.delete<{ message: string }>(`/qlpo/${id}`),

  // Xóa tất cả PO theo Mã PO
  deleteByMaPO: (ma_po: string) => 
    api.delete<{ message: string; deletedCount: number }>(`/qlpo/by-ma-po/${ma_po}`),

  // ==========================================
  // PO DELIVERIES APIs
  // ==========================================

  // Lấy danh sách lần giao của 1 PO
  getDeliveries: (qlpo_id: number) => 
    api.get<QLPODelivery[]>(`/qlpo/${qlpo_id}/deliveries`),

  // Thêm lần giao cho 1 PO
  addDelivery: (qlpo_id: number, data: { so_luong_giao: number; ngay_giao: string }) => 
    api.post<{ message: string; id: number; lan_giao: number }>(`/qlpo/${qlpo_id}/deliveries`, data),

  // Xóa 1 lần giao
  deleteDelivery: (delivery_id: number) => 
    api.delete<{ message: string }>(`/qlpo/deliveries/${delivery_id}`)
};
