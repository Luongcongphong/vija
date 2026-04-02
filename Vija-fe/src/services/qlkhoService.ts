import api from './api';

export interface QLKHO {
  id: number;
  ma_kh: string;
  ma_bv: string;
  don_vi: string;
  tong_nhap: number;
  tong_xuat: number;
  so_luong: number;
}

export interface LichSuGiaoDich {
  id: number;
  ma_bv: string;
  ngay_nhap?: string;
  ngay_xuat?: string;
  ma_po?: string;
  so_luong: number;
  created_at: string;
}

export const qlkhoService = {
  getAll: async () => {
    const response = await api.get('/qlkho');
    return response.data;
  },

  getLichSuNhap: async (ma_bv: string) => {
    const response = await api.get(`/qlkho/${ma_bv}/nhap`);
    return response.data;
  },

  getLichSuXuat: async (ma_bv: string) => {
    const response = await api.get(`/qlkho/${ma_bv}/xuat`);
    return response.data;
  },

  nhapKho: async (data: { ma_bv: string; ngay_nhap: string; so_luong: number }) => {
    const response = await api.post('/qlkho/nhap', data);
    return response.data;
  },

  xuatKho: async (data: { ma_bv: string; ma_po?: string; ngay_xuat: string; so_luong: number }) => {
    const response = await api.post('/qlkho/xuat', data);
    return response.data;
  }
};
