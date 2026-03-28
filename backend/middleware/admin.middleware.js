import prisma from '../lib/prisma.lib.js';

const verifyAdmin = async (req, res, next) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: 'Thiếu thông tin xác thực người dùng.'
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                role: true
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy tài khoản xác thực.'
            });
        }

        if (user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền truy cập khu vực quản trị.'
            });
        }

        req.userRole = user.role;
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể xác minh quyền quản trị.'
        });
    }
};

export default verifyAdmin;
