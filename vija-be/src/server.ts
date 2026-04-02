import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
// import qlkhRoutes from './routes/qlkhRoutes'; // Đã thay thế bởi QLBG
import qlbgRoutes from './routes/qlbgRoutes';
import qlnbRoutes from './routes/qlnbRoutes';
import qldmRoutes from './routes/qldmRoutes';
import qlpoRoutes from './routes/qlpoRoutes';
import qlkhoRoutes from './routes/qlkhoRoutes';
import qlhlRoutes from './routes/qlhlRoutes';
import userRoutes from './routes/userRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import { initDatabase } from './utils/initDatabase';
import morgan from 'morgan';
import logger from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

app.use('/api/auth', authRoutes);
// app.use('/api/qlkh', qlkhRoutes); // Đã thay thế bởi QLBG
app.use('/api/qlbg', qlbgRoutes);
app.use('/api/qlnb', qlnbRoutes);
app.use('/api/qldm', qldmRoutes);
app.use('/api/qlpo', qlpoRoutes);
app.use('/api/qlkho', qlkhoRoutes);
app.use('/api/qlhl', qlhlRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Vija Backend API' });
});

// Middleware xử lý lỗi tập trung
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`Error: ${err.message}`, { 
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });
  res.status(err.status || 500).json({ message: 'Đã xảy ra lỗi trên server', error: err.message });
});

// Khởi tạo database và start server
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      logger.info(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('❌ Không thể khởi động server:', error);
    process.exit(1);
  }
}

startServer();
