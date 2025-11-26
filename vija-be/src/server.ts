import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
// import qlkhRoutes from './routes/qlkhRoutes'; // Đã thay thế bởi QLBG
import qlbgRoutes from './routes/qlbgRoutes';
import qlnbRoutes from './routes/qlnbRoutes';
import qldmRoutes from './routes/qldmRoutes';
import qlpoRoutes from './routes/qlpoRoutes';
import userRoutes from './routes/userRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import { initDatabase } from './utils/initDatabase';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
// app.use('/api/qlkh', qlkhRoutes); // Đã thay thế bởi QLBG
app.use('/api/qlbg', qlbgRoutes);
app.use('/api/qlnb', qlnbRoutes);
app.use('/api/qldm', qldmRoutes);
app.use('/api/qlpo', qlpoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Vija Backend API' });
});

// Khởi tạo database và start server
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Không thể khởi động server:', error);
    process.exit(1);
  }
}

startServer();
