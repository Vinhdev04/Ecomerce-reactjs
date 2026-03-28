import prisma from '../lib/prisma.lib.js';

const getClientIp = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length > 0) {
        return forwarded.split(',')[0].trim();
    }

    return req.ip || req.socket?.remoteAddress || null;
};

export const logActivity = async ({
    req,
    userId = null,
    userEmail = null,
    action,
    entityType,
    entityId = null,
    detail = null,
    sessionId = null,
    status = 'ACTIVE'
}) => {
    if (!action || !entityType) return;

    try {
        await prisma.activityLog.create({
            data: {
                userId,
                userEmail,
                action,
                entityType,
                entityId,
                detail,
                status,
                sessionId,
                ipAddress: req ? getClientIp(req) : null,
                userAgent: req?.headers?.['user-agent'] || null,
                deviceInfo: req?.headers?.['sec-ch-ua-platform'] || null
            }
        });
    } catch (error) {
        console.error('Activity logger error:', error?.message || error);
    }
};

export default logActivity;
