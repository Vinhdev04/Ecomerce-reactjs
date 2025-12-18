/* ==============================
     CONTROLLER: PRODUCTS 
 ============================== */
import prisma from '../lib/prisma.lib.js';

const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total count for pagination
        const total = await prisma.product.count();

        // Get products with pagination
        const products = await prisma.product.findMany({
            skip: skip,
            take: limit
        });

        res.status(200).json({
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

const getProductByID = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const {
            image,
            title,
            description,
            price,
            category,
            stock,
            rating,
            badge
        } = req.body;

        const product = await prisma.product.create({
            data: {
                image,
                title,
                description,
                price: parseFloat(price),
                category,
                stock: parseInt(stock),
                rating: parseFloat(rating),
                badge
            }
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

const updatedProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            image,
            title,
            description,
            price,
            category,
            stock,
            rating,
            badge
        } = req.body;

        const product = await prisma.product.update({
            where: { id },
            data: {
                ...(image && { image }),
                ...(title && { title }),
                ...(description && { description }),
                ...(price && { price: parseFloat(price) }),
                ...(category && { category }),
                ...(stock !== undefined && { stock: parseInt(stock) }),
                ...(rating && { rating: parseFloat(rating) }),
                ...(badge !== undefined && { badge })
            }
        });

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

const deletedProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.product.delete({
            where: { id }
        });

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};

export {
    getAllProducts,
    getProductByID,
    createProduct,
    updatedProduct,
    deletedProduct
};
