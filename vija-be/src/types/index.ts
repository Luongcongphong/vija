export interface User {
  id?: number;
  username: string;
  password: string;
  role: 'admin' | 'sales' | 'kythuat';
  created_at?: Date;
}

export interface QLKH {
  id?: number;
  po: string;
  ma_bv: string;
  so_luong: number;
  don_gia: number;
  thanh_tien: number;
  created_at?: Date;
}

export interface QLNB {
  id?: number;
  po: string;
  ma_bv: string;
  phoi_lieu: number;
  gia_cong_ngoai: number;
  gia_cong_noi_bo: number;
  xu_ly_be_mat: number;
  van_chuyen: number;
  phi_qldn: number;
  tong_phi: number;
  created_at?: Date;
}

export interface QLDM {
  id?: number;
  po: string;
  ma_bv: string;
  so_luong: number;
  don_gia: number;
  dinh_muc: number;
  created_at?: Date;
}

export interface QLPO {
  id?: number;
  po: string;
  ma_bv: string;
  created_at?: Date;
}
