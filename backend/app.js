/* ==============================
    SERVER: APP
 ============================== */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDatabase } from './config/config.db.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

// Config host & port
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

// ============================================
// MIDDLEWARE - THỨ TỰ QUAN TRỌNG
// ============================================


app.use(cors({
  origin: 'http://localhost:5173', // ✅ Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true, // ✅ Cho phép gửi cookie
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2️ Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3️ Cookie parser
app.use(cookieParser());

// 4️ Logger
app.use(morgan('dev'));

// ============================================
// ROUTES
// ============================================
import productsRouter from './routes/products.route.js';
import userRouter from './routes/users.route.js';

// API Routes
app.use('/api/products', productsRouter);
app.use('/api', userRouter);

// ============================================
// HEALTH CHECK
// ============================================
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'API Server is running!',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// ERROR HANDLING
// ============================================
// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// START SERVER
// ============================================
connectDatabase().then(() => {
    app.listen(port, host, () => {
        console.log(`✅ Server is running on http://${host}:${port}`);
        console.log(`✅ CORS enabled for: http://localhost:5173`);
    });
}).catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});

export default app;