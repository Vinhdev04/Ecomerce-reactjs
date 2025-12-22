/* ==============================
     CONTROLLER: PRODUCTS 
 ============================== */
import prisma from '../lib/prisma.lib.js';

const getAllProducts = async (req, res) => {
    try {
        // Lấy thông tin phân trang từ query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Truy vấn dữ liệu với phân trang
        const [data, total] = await Promise.all([
            prisma.product.findMany({
                skip,
                take: limit
            }),
            prisma.product.count()
        ]);

        console.log(`Total products: ${total}`);

        res.status(200).json({
            success: true,
            data: data,

            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Đã xảy ra lỗi khi truy vấn dữ liệu từ API', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi truy vấn dữ liệu từ API',
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
                message: `Không tìm thấy sản phẩm có ${product}`
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

        res.status(201).json({
            success: true,
            message: 'Product created successfully'
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

        res.status(200).json({
            success: true,
            message: 'Product updated successfully'
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
