import winston from 'winston';
import 'winston-daily-rotate-file';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
  })
);

// Khởi tạo logger
const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    // Ghi log lỗi vào file riêng (xoá sau 7 ngày)
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '7d', // Giữ log trong 7 ngày
      zippedArchive: true, // Nén file log cũ
    }),
    // Ghi toàn bộ log vào file chung (xoá sau 7 ngày)
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '7d', // Giữ log trong 7 ngày
      zippedArchive: true,
    }),
  ],
});

// Nếu không phải production thì ghi log ra console với màu sắc
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    })
  );
}

export default logger;
