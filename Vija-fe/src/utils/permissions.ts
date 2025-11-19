// Hệ thống phân quyền

export type UserRole = 'admin' | 'sales' | 'kythuat';

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

// Quyền truy cập các module
export const permissions = {
  dashboard: ['admin', 'sales', 'kythuat'], // Tất cả
  qlkh: ['admin', 'sales'], // Admin và Sales
  qlnb: ['admin', 'kythuat'], // Admin và Kỹ thuật
  qldm: ['admin', 'sales'], // Admin và Sales
  qlpo: ['admin', 'kythuat'], // Admin và Kỹ thuật
  users: ['admin'], // Chỉ Admin
};

// Kiểm tra quyền truy cập
export const hasPermission = (userRole: UserRole, module: keyof typeof permissions): boolean => {
  return permissions[module].includes(userRole);
};

// Lấy thông tin user từ localStorage
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  return JSON.parse(userStr);
};

// Kiểm tra user có quyền không
export const checkPermission = (module: keyof typeof permissions): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  return hasPermission(user.role, module);
};

// Tên hiển thị role
export const getRoleName = (role: UserRole): string => {
  const roleNames = {
    admin: 'Quản trị viên',
    sales: 'Kinh doanh',
    kythuat: 'Kỹ thuật',
  };
  return roleNames[role] || role;
};

// Màu badge cho role
export const getRoleColor = (role: UserRole): string => {
  const colors = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    sales: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    kythuat: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};
