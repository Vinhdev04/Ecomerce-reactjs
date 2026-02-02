/* ==============================
     CONTROLLER: PRODUCTS 
 ============================== */
import prisma from '../lib/prisma.lib.js';

/* ==============================
     GET ALL PRODUCTS WITH FILTER & SORT
 ============================== */
const getAllProducts = async (req, res) => {
    try {
        // Lấy thông tin từ query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const sortType = req.query.sortType || '0';
        const category = req.query.category;
        const skip = (page - 1) * limit;

        // Xây dựng sorting
        let orderBy = {};
        switch (sortType) {
            case '1': // Popularity
                orderBy = { rating: 'desc' };
                break;
            case '2': // High to Low
                orderBy = { price: 'desc' };
                break;
            case '3': // Low to High
                orderBy = { price: 'asc' };
                break;
            case '4': // Newest
                orderBy = { createdAt: 'desc' };
                break;
            case '5': // Oldest
                orderBy = { createdAt: 'asc' };
                break;
            default: // Default
                orderBy = { id: 'asc' };
        }

        // Xây dựng filter
        const where = {};
        if (category && category !== 'all') {
            where.category = category;
        }

        // Truy vấn dữ liệu với phân trang và sorting
        const [data, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                // Tạm thời comment orderBy để test lỗi
                // orderBy 
            }),
            prisma.product.count({ where })
        ]);

        res.status(200).json({
            success: true,
            data: data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            filters: {
                sortType,
                category
            }
        });
    } catch (error) {
        console.error('❌ Error in getAllProducts:', error); // Log lỗi chi tiết ra console server
        res.status(500).json({
            success: false,
            message: 'Lỗi khi truy vấn dữ liệu từ API',
            error: error.message
        });
    }
};

/* ==============================
     GET PRODUCT BY ID
 ============================== */
const getProductByID = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy sản phẩm`
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi truy vấn dữ liệu từ API',
            error: error.message
        });
    }
};


/* ==============================
     CREATE PRODUCT
 ============================== */
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
            badge,
            size
        } = req.body;

        const newProduct = await prisma.product.create({
            data: {
                image,
                title,
                description,
                price,
                category,
                stock,
                rating,
                badge,
                size
            }
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

/* ==============================
     UPDATE PRODUCT
 ============================== */
const updatedProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: updateData
        });

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};


/* ==============================
     DELETE PRODUCT
 ============================== */
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