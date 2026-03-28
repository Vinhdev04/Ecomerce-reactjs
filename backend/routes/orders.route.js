import express from 'express';
import {
    createOrder,
    getOrders,
    updateOrderStatus
} from '../controller/orders.controller.js';
import verifyToken from '../middleware/auth.middleware.js';
import verifyAdmin from '../middleware/admin.middleware.js';

const router = express.Router();

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, verifyAdmin, getOrders);
router.put('/:id', verifyToken, verifyAdmin, updateOrderStatus);

export default router;
