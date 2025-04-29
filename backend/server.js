import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import winston from 'winston';

import { connectDB } from './config/db.js';
import productRoutes from './routes/product.route.js';
import fileRoutes from './routes/file.routes.js';
import authRoutes from './routes/auth.route.js';
import pingRoutes from './routes/ping.route.js';
import { errorLogger, errorHandler } from './middleware/error.middleware.js';

// Load environment variables
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Correct __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Configure application logger
const appLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  defaultMeta: { service: 'api-service' },
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'app.log'),
    }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  appLogger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    })
  );
}

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use(morgan('dev'));
app.use(
  morgan('combined', {
    stream: fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' }),
  })
);

// Log all requests
app.use((req, res, next) => {
  appLogger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// Routes
app.use('/api', pingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/files', fileRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Error handling middleware
app.use(errorLogger);
app.use(errorHandler);

// Start server and connect to database
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      appLogger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    appLogger.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
