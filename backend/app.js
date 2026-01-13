/* ==============================
    SERVER: APP
 ============================== */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDatabase } from './config/config.db.js';

dotenv.config();
const app = express();

// Config host & port
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Import routes
import productsRouter from './routes/products.route.js';
import userRouter from './routes/users.route.js';
// Routes
app.use('/api/products', productsRouter);
app.use('/api',userRouter);

// Kết nối database trước khi start server
connectDatabase().then(() => {
    app.listen(port, host, () => {
        console.log(`✅ Server is running on http://${host}:${port}`);
    });
}).catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});

export default app;