import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: number;
  userRole?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token không tồn tại' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vija_secret_key_2024') as { userId: number; role?: string };
    req.userId = decoded.userId;
    // Nếu token cũ không có role, mặc định là admin để tương thích ngược
    req.userRole = decoded.role || 'admin';
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ. Vui lòng đăng nhập lại.' });
  }
};

// Middleware kiểm tra quyền admin
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Nếu không có role (token cũ), cho phép (tương thích ngược)
  if (!req.userRole) {
    next();
    return;
  }
  
  // Nếu có role, kiểm tra phải là admin
  if (req.userRole !== 'admin') {
    return res.status(403).json({ 
      message: 'Không có quyền truy cập. Chỉ Admin mới có quyền này.',
      requiredRole: 'admin',
      yourRole: req.userRole
    });
  }
  next();
};

// Middleware kiểm tra quyền sales (QLDM, QLKH)
export const requireSales = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Nếu không có role (token cũ), cho phép (tương thích ngược)
  if (!req.userRole) {
    next();
    return;
  }
  
  // Nếu có role, kiểm tra phải là admin hoặc sales
  if (req.userRole !== 'admin' && req.userRole !== 'sales') {
    return res.status(403).json({ 
      message: 'Không có quyền truy cập. Chỉ Admin và Sales mới có quyền này.',
      requiredRole: ['admin', 'sales'],
      yourRole: req.userRole
    });
  }
  next();
};

// Middleware kiểm tra quyền kỹ thuật (QLNB, QLPO)
export const requireKyThuat = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Nếu không có role (token cũ), cho phép (tương thích ngược)
  if (!req.userRole) {
    next();
    return;
  }
  
  // Nếu có role, kiểm tra phải là admin hoặc kythuat
  if (req.userRole !== 'admin' && req.userRole !== 'kythuat') {
    return res.status(403).json({ 
      message: 'Không có quyền truy cập. Chỉ Admin và Kỹ thuật mới có quyền này.',
      requiredRole: ['admin', 'kythuat'],
      yourRole: req.userRole
    });
  }
  next();
};
