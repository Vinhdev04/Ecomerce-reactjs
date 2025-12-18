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

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductByID);
router.post('/', createProduct);
router.put('/:id', updatedProduct);
router.delete('/:id', deletedProduct);

export default router;
