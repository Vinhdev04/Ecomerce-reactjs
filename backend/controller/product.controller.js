import prisma from '../lib/prisma.lib.js';
import logActivity from '../helpers/activityLogger.js';

const buildProductFilter = ({ category, includeDisabled = false }) => {
    const where = {};

    if (category && category !== 'all') {
        where.category = category;
    }

    if (!includeDisabled) {
        where.OR = [
            { status: 'ACTIVE' },
            { status: null },
            { status: { isSet: false } }
        ];
    }

    return where;
};

const parseSort = (sortType) => {
    switch (sortType) {
        case '1':
            return { rating: 'desc' };
        case '2':
            return { price: 'desc' };
        case '3':
            return { price: 'asc' };
        case '4':
            return { createdAt: 'desc' };
        case '5':
            return { createdAt: 'asc' };
        default:
            return { id: 'asc' };
    }
};

const PRODUCT_SELECT = {
    id: true,
    image: true,
    title: true,
    description: true,
    price: true,
    category: true,
    stock: true,
    rating: true,
    badge: true,
    size: true,
    status: true,
    createdAt: true,
    updatedAt: true
};

const getProducts = async (req, res, options = { includeDisabled: false }) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 8;
        const sortType = req.query.sortType || '0';
        const category = req.query.category;
        const skip = (page - 1) * limit;

        const where = buildProductFilter({
            category,
            includeDisabled: options.includeDisabled
        });

        const [data, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: parseSort(sortType),
                select: PRODUCT_SELECT
            }),
            prisma.product.count({ where })
        ]);

        if (req.userId) {
            await logActivity({
                req,
                userId: req.userId,
                action: 'VIEW_PRODUCT_LIST',
                entityType: 'PRODUCT',
                detail: {
                    page,
                    limit,
                    category: category || null,
                    sortType
                },
                sessionId: req.sessionId || null
            });
        }

        res.status(200).json({
            success: true,
            data,
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
        console.error('Error in getAllProducts:', error);
        res.status(500).json({
            success: false,
            message: 'Loi khi truy van du lieu tu API',
            error: error.message
        });
    }
};

const getAllProducts = async (req, res) => {
    await getProducts(req, res, { includeDisabled: false });
};

const getAllProductsAdmin = async (req, res) => {
    await getProducts(req, res, { includeDisabled: true });
};

const getProductByID = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id },
            select: PRODUCT_SELECT
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Khong tim thay san pham'
            });
        }

        if (product.status === 'DISABLED') {
            return res.status(404).json({
                success: false,
                message: 'San pham da bi vo hieu hoa'
            });
        }

        if (req.userId) {
            await logActivity({
                req,
                userId: req.userId,
                action: 'VIEW_PRODUCT',
                entityType: 'PRODUCT',
                entityId: product.id,
                detail: {
                    title: product.title
                },
                sessionId: req.sessionId || null
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Loi khi truy van du lieu tu API',
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
                size,
                status: 'ACTIVE'
            },
            select: PRODUCT_SELECT
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

const updatedProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.status) {
            updateData.status =
                updateData.status === 'DISABLED' ? 'DISABLED' : 'ACTIVE';
        }

        const updatedProductData = await prisma.product.update({
            where: { id },
            data: updateData,
            select: PRODUCT_SELECT
        });

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProductData
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
    getAllProductsAdmin,
    getProductByID,
    createProduct,
    updatedProduct,
    deletedProduct
};
