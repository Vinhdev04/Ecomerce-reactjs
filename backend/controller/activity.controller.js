import prisma from '../lib/prisma.lib.js';

const ACTIVITY_SELECT = {
    id: true,
    userId: true,
    userEmail: true,
    action: true,
    entityType: true,
    entityId: true,
    status: true,
    ipAddress: true,
    userAgent: true,
    deviceInfo: true,
    sessionId: true,
    detail: true,
    createdAt: true,
    updatedAt: true
};

export const getActivityLogs = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(
            Math.max(parseInt(req.query.limit, 10) || 30, 1),
            100
        );
        const skip = (page - 1) * limit;

        const where = {};
        if (req.query.status) where.status = req.query.status;
        if (req.query.action) where.action = req.query.action;
        if (req.query.userId) where.userId = req.query.userId;

        const [logs, total] = await Promise.all([
            prisma.activityLog.findMany({
                where,
                skip,
                take: limit,
                select: ACTIVITY_SELECT,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.activityLog.count({ where })
        ]);

        res.status(200).json({
            success: true,
            data: logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get activity logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Khong the tai lich su hoat dong.'
        });
    }
};

export const updateActivityStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'DISABLED'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Status khong hop le.'
        });
    }

    try {
        const updatedLog = await prisma.activityLog.update({
            where: { id },
            data: { status },
            select: ACTIVITY_SELECT
        });

        res.status(200).json({
            success: true,
            data: updatedLog
        });
    } catch (error) {
        console.error('Update activity status error:', error);
        res.status(500).json({
            success: false,
            message: 'Khong the cap nhat trang thai hoat dong.'
        });
    }
};
