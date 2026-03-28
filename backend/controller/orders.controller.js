import prisma from '../lib/prisma.lib.js';

const ORDER_SELECT = {
    id: true,
    orderCode: true,
    userId: true,
    customerName: true,
    customerEmail: true,
    customerPhone: true,
    shippingAddress: true,
    paymentMethod: true,
    paymentStatus: true,
    orderStatus: true,
    note: true,
    subtotal: true,
    shippingFee: true,
    paymentFee: true,
    total: true,
    items: true,
    createdAt: true,
    updatedAt: true
};

const normalizePaymentMethod = (value) => {
    const method = String(value || '')
        .trim()
        .toUpperCase();

    if (['COD', 'CARD', 'WALLET', 'BANK'].includes(method)) {
        return method;
    }

    return 'COD';
};

export const createOrder = async (req, res) => {
    const {
        orderCode,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        paymentMethod,
        note,
        subtotal,
        shippingFee,
        paymentFee,
        total,
        items
    } = req.body;

    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: 'Bạn cần đăng nhập để tạo đơn hàng.'
            });
        }

        if (
            !orderCode ||
            !customerName ||
            !customerEmail ||
            !customerPhone ||
            !shippingAddress ||
            !Array.isArray(items) ||
            !items.length
        ) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu dữ liệu đơn hàng.'
            });
        }

        const duplicatedOrder = await prisma.order.findUnique({
            where: { orderCode }
        });

        if (duplicatedOrder) {
            return res.status(409).json({
                success: false,
                message: 'Mã đơn hàng đã tồn tại.'
            });
        }

        const order = await prisma.order.create({
            data: {
                orderCode,
                userId: req.userId,
                customerName,
                customerEmail,
                customerPhone,
                shippingAddress,
                paymentMethod: normalizePaymentMethod(paymentMethod),
                paymentStatus:
                    normalizePaymentMethod(paymentMethod) === 'COD'
                        ? 'PENDING'
                        : 'PAID',
                orderStatus: 'CONFIRMED',
                note: note || null,
                subtotal: Number(subtotal || 0),
                shippingFee: Number(shippingFee || 0),
                paymentFee: Number(paymentFee || 0),
                total: Number(total || 0),
                items
            },
            select: ORDER_SELECT
        });

        res.status(201).json({
            success: true,
            message: 'Tạo đơn hàng thành công.',
            data: order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể tạo đơn hàng.'
        });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            select: ORDER_SELECT,
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể tải danh sách đơn hàng.'
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { paymentStatus, orderStatus } = req.body;

    try {
        const order = await prisma.order.update({
            where: { id },
            data: {
                ...(paymentStatus ? { paymentStatus } : {}),
                ...(orderStatus ? { orderStatus } : {})
            },
            select: ORDER_SELECT
        });

        res.status(200).json({
            success: true,
            message: 'Cập nhật trạng thái đơn hàng thành công.',
            data: order
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể cập nhật đơn hàng.'
        });
    }
};
