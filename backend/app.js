/* ==============================
    SERVER: APP
 ============================== */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

const app = express();

// Config host & port
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
dotenv.config();

// Import routes
import productsRouter from './routes/products.route.js';

// Routes
app.use('/api/products', productsRouter);
app.use('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, host, () =>
    console.log(`Server is running on http://${host}:${port}`)
);

export default app;
