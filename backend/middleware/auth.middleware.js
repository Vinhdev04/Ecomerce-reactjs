import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.lib.js';

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Khong tim thay token xac thuc!'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.sessionId = decoded.sessionId || null;

        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, status: true }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Tai khoan khong ton tai.'
            });
        }

        if (user.status === 'DISABLED') {
            return res.status(403).json({
                success: false,
                message: 'Tai khoan da bi vo hieu hoa.'
            });
        }

        if (req.sessionId) {
            const disabledSession = await prisma.activityLog.findFirst({
                where: {
                    sessionId: req.sessionId,
                    userId: req.userId,
                    action: 'LOGIN',
                    status: 'DISABLED'
                },
                select: { id: true }
            });

            if (disabledSession) {
                return res.status(403).json({
                    success: false,
                    message: 'Phien dang nhap nay da bi vo hieu hoa.'
                });
            }
        }

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token da het han!'
            });
        }
        return res.status(403).json({
            success: false,
            message: 'Token khong hop le!'
        });
    }
};

export default verifyToken;
