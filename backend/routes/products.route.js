/* ==============================
     ROUTE: PRODUCTS 
 ============================== */
import express from 'express';
import {
    getAllProducts,
    getAllProductsAdmin,
    getProductByID,
    createProduct,
    updatedProduct,
    deletedProduct
} from '../controller/product.controller.js';
import verifyToken from '../middleware/auth.middleware.js';
import verifyAdmin from '../middleware/admin.middleware.js';
import optionalAuth from '../middleware/optionalAuth.middleware.js';

const router = express.Router();

router.get('/', optionalAuth, getAllProducts);
router.get('/admin/all', verifyToken, verifyAdmin, getAllProductsAdmin);
router.get('/:id', optionalAuth, getProductByID);
router.post('/', verifyToken, verifyAdmin, createProduct);
router.put('/:id', verifyToken, verifyAdmin, updatedProduct);
router.delete('/:id', verifyToken, verifyAdmin, deletedProduct);

export default router;
