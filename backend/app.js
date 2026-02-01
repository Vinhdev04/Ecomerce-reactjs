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

/* ==============================
   CONFIG PORT
============================== */
const PORT = process.env.PORT || 3000;

/* ==============================
   MIDDLEWARE
============================== */

// ✅ CORS chuẩn production
const allowedOrigins = [
  'http://localhost:5173',
  'https://xpadgame-store.netlify.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

/* ==============================
   ROUTES
============================== */
import productsRouter from './routes/products.route.js';
import userRouter from './routes/users.route.js';

app.use('/api/products', productsRouter);
app.use('/api', userRouter);

/* ==============================
   HEALTH CHECK
============================== */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Server is running!',
    timestamp: new Date().toISOString()
  });
});

/* ==============================
   ERROR HANDLING
============================== */
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

/* ==============================
   START SERVER
============================== */
connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });

export default app;
