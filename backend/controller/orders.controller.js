import prisma from '../lib/prisma.lib.js';
import logActivity from '../helpers/activityLogger.js';

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

const getOrderDelegate = () => prisma.order ?? prisma.orders ?? null;

const ensureOrderDelegate = () => {
    const delegate = getOrderDelegate();

    if (!delegate) {
        const error = new Error(
            'Order model is not available in Prisma Client. Run prisma generate and restart backend.'
        );
        error.status = 503;
        throw error;
    }

    return delegate;
};

const normalizeRawOrder = (order) => ({
    id: order?.id ?? order?._id?.toString?.() ?? null,
    orderCode: order?.orderCode ?? null,
    userId: order?.userId ?? null,
    customerName: order?.customerName ?? null,
    customerEmail: order?.customerEmail ?? null,
    customerPhone: order?.customerPhone ?? null,
    shippingAddress: order?.shippingAddress ?? null,
    paymentMethod: order?.paymentMethod ?? null,
    paymentStatus: order?.paymentStatus ?? null,
    orderStatus: order?.orderStatus ?? null,
    note: order?.note ?? null,
    subtotal: Number(order?.subtotal ?? 0),
    shippingFee: Number(order?.shippingFee ?? 0),
    paymentFee: Number(order?.paymentFee ?? 0),
    total: Number(order?.total ?? 0),
    items: order?.items ?? [],
    createdAt: order?.createdAt ?? null,
    updatedAt: order?.updatedAt ?? null
});

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
        const orderDelegate = ensureOrderDelegate();

        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: 'Ban can dang nhap de tao don hang.'
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
                message: 'Thieu du lieu don hang.'
            });
        }

        const duplicatedOrder = await orderDelegate.findUnique({
            where: { orderCode }
        });

        if (duplicatedOrder) {
            return res.status(409).json({
                success: false,
                message: 'Ma don hang da ton tai.'
            });
        }

        const method = normalizePaymentMethod(paymentMethod);
        const order = await orderDelegate.create({
            data: {
                orderCode,
                userId: req.userId,
                customerName,
                customerEmail,
                customerPhone,
                shippingAddress,
                paymentMethod: method,
                paymentStatus: method === 'COD' ? 'PENDING' : 'PAID',
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
            message: 'Tao don hang thanh cong.',
            data: order
        });

        await logActivity({
            req,
            userId: req.userId,
            userEmail: customerEmail,
            action: 'PAYMENT',
            entityType: 'ORDER',
            entityId: order.id,
            sessionId: req.sessionId || null,
            detail: {
                orderCode: order.orderCode,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                total: order.total
            }
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(error.status || 500).json({
            success: false,
            message: 'Khong the tao don hang.',
            error: error?.message
        });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orderDelegate = getOrderDelegate();
        let orders = [];

        if (orderDelegate) {
            orders = await orderDelegate.findMany({
                select: ORDER_SELECT,
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else {
            const rawResponse = await prisma.$runCommandRaw({
                find: 'orders',
                filter: {},
                sort: { createdAt: -1 }
            });

            const rawOrders = rawResponse?.cursor?.firstBatch ?? [];
            orders = rawOrders.map(normalizeRawOrder);
        }

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Khong the tai danh sach don hang.',
            error: error?.message
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { paymentStatus, orderStatus } = req.body;

    try {
        const orderDelegate = ensureOrderDelegate();
        const order = await orderDelegate.update({
            where: { id },
            data: {
                ...(paymentStatus ? { paymentStatus } : {}),
                ...(orderStatus ? { orderStatus } : {})
            },
            select: ORDER_SELECT
        });

        res.status(200).json({
            success: true,
            message: 'Cap nhat trang thai don hang thanh cong.',
            data: order
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(error.status || 500).json({
            success: false,
            message: 'Khong the cap nhat don hang.',
            error: error?.message
        });
    }
};
