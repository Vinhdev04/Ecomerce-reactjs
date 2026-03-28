/* ==============================
     ROUTE: PRODUCTS 
 ============================== */
import express from 'express';
import {
    getAllProducts,
    getProductByID,
    createProduct,
    updatedProduct,
    deletedProduct
} from '../controller/product.controller.js';
import verifyToken from '../middleware/auth.middleware.js';
import verifyAdmin from '../middleware/admin.middleware.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductByID);
router.post('/', verifyToken, verifyAdmin, createProduct);
router.put('/:id', verifyToken, verifyAdmin, updatedProduct);
router.delete('/:id', verifyToken, verifyAdmin, deletedProduct);

export default router;
