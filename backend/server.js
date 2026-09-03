import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import articleRoutes from './routes/articleRoutes.js';
import path from 'path';
import problemRoutes from './routes/problemRoutes.js';
import quizRoutes from './routes/quizRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Simcuits backend is running',
  });
});

const allowedOrigins = [
  'https://simcuits.founders-c77.workers.dev',
  'http://localhost:5173',
  'https://simcuits.hadhaan.com',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header
    // (Postman, curl, server-to-server, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());

app.get('/api/problems-test', (req, res) => {
  res.json({
    success: true,
    message: 'Problems route is reaching this server',
  });
});

app.use('/api/problems', problemRoutes);
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/quiz', quizRoutes);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

connectDB();

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server Started at', PORT);
});
