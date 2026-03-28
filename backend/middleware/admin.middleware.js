import prisma from '../lib/prisma.lib.js';

const verifyAdmin = async (req, res, next) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: 'Thieu thong tin xac thuc nguoi dung.'
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                role: true,
                status: true
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Khong tim thay tai khoan xac thuc.'
            });
        }

        if (user.status === 'DISABLED') {
            return res.status(403).json({
                success: false,
                message: 'Tai khoan admin da bi vo hieu hoa.'
            });
        }

        if (user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Ban khong co quyen truy cap khu vuc quan tri.'
            });
        }

        req.userRole = user.role;
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Khong the xac minh quyen quan tri.'
        });
    }
};

export default verifyAdmin;
