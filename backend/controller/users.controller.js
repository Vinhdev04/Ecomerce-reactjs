import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.lib.js';
import logActivity from '../helpers/activityLogger.js';

const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const USER_SELECT_FIELDS = {
    id: true,
    email: true,
    name: true,
    role: true,
    status: true,
    createdAt: true,
    updatedAt: true
};

const buildError = (message, status = 400) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

const validateCredentials = ({ email, password }) => {
    if (!email || !password) {
        throw buildError('Email va mat khau la bat buoc!', 400);
    }

    if (!EMAIL_REGEX.test(email)) {
        throw buildError('Email khong hop le!', 400);
    }

    if (password.length < 6) {
        throw buildError('Mat khau phai co it nhat 6 ky tu!', 400);
    }

    if (!PASSWORD_REGEX.test(password)) {
        throw buildError(
            'Mat khau phai chua it nhat 1 chu hoa, 1 chu thuong, 1 so va 1 ky tu dac biet.',
            400
        );
    }
};

const createUserRecord = async ({
    email,
    password,
    name,
    role = 'CUSTOMER',
    status = 'ACTIVE'
}) => {
    validateCredentials({ email, password });

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw buildError('Email da duoc su dung!', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: name?.trim() || email.split('@')[0],
            role,
            status: status === 'DISABLED' ? 'DISABLED' : 'ACTIVE'
        },
        select: USER_SELECT_FIELDS
    });
};

const register = async (req, res) => {
    const { username, password, name } = req.body;

    try {
        const newUser = await createUserRecord({
            email: username,
            password,
            name,
            role: 'CUSTOMER'
        });

        res.status(201).json({
            success: true,
            message: 'Dang ky tai khoan thanh cong!',
            data: newUser
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Loi he thong, vui long thu lai sau!',
            error: error.message
        });
    }
};

const createUserByAdmin = async (req, res) => {
    const { email, password, name, role, status } = req.body;

    try {
        const newUser = await createUserRecord({
            email,
            password,
            name,
            role: role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER',
            status: status === 'DISABLED' ? 'DISABLED' : 'ACTIVE'
        });

        res.status(201).json({
            success: true,
            message: 'Tao nguoi dung moi thanh cong!',
            data: newUser
        });
    } catch (error) {
        console.error('Create user by admin error:', error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Loi he thong, vui long thu lai sau!'
        });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email va mat khau la bat buoc'
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: username }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Khong tim thay nguoi dung!'
            });
        }

        if (user.status === 'DISABLED') {
            return res.status(403).json({
                success: false,
                message: 'Tai khoan da bi vo hieu hoa.'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email hoac mat khau khong chinh xac'
            });
        }

        const sessionId = crypto.randomUUID();
        const token = jwt.sign({ userId: user.id, sessionId }, process.env.JWT_SECRET, {
            expiresIn: '15m'
        });

        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        await logActivity({
            req,
            userId: user.id,
            userEmail: user.email,
            action: 'LOGIN',
            entityType: 'AUTH',
            entityId: user.id,
            sessionId,
            detail: {
                role: user.role,
                accountStatus: user.status || 'ACTIVE'
            }
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });

        const { password: _, refreshToken: __, ...userWithoutPassword } = user;

        res.status(200).json({
            success: true,
            message: 'Dang nhap thanh cong',
            data: {
                id: user.id,
                user: userWithoutPassword,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Loi he thong, vui long thu lai sau'
        });
    }
};

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            try {
                const decoded = jwt.decode(refreshToken);

                if (decoded?.userId) {
                    await prisma.user.update({
                        where: { id: decoded.userId },
                        data: { refreshToken: null }
                    });
                }
            } catch (err) {
                console.error('Token decode error (ignored):', err.message);
            }
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        res.status(200).json({
            success: true,
            message: 'Dang xuat thanh cong!'
        });
    } catch (err) {
        console.error('Logout error:', err);

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        res.status(500).json({
            success: false,
            message: 'Loi he thong!'
        });
    }
};

const refreshToken = async (req, res) => {
    const refreshTokenValue = req.cookies.refreshToken;

    if (!refreshTokenValue) {
        return res.status(401).json({
            success: false,
            message: 'Khong tim thay refresh token!'
        });
    }

    try {
        const decoded = jwt.verify(
            refreshTokenValue,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user || user.refreshToken !== refreshTokenValue) {
            return res.status(403).json({
                success: false,
                message: 'Refresh token khong hop le!'
            });
        }

        if (user.status === 'DISABLED') {
            return res.status(403).json({
                success: false,
                message: 'Tai khoan da bi vo hieu hoa.'
            });
        }

        const newAccessToken = jwt.sign(
            { userId: user.id, sessionId: crypto.randomUUID() },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const newRefreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken }
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });

        res.status(200).json({
            success: true,
            message: 'Refresh token thanh cong!',
            data: {
                token: newAccessToken
            }
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({
                success: false,
                message: 'Refresh token da het han, vui long dang nhap lai!'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({
                success: false,
                message: 'Refresh token khong hop le!'
            });
        }

        console.error('Refresh token error:', error);
        res.status(500).json({
            success: false,
            message: 'Loi he thong, vui long thu lai sau!'
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: USER_SELECT_FIELDS,
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            success: true,
            message: 'Lay danh sach nguoi dung thanh cong!',
            data: users,
            total: users.length
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Loi he thong, vui long thu lai sau!'
        });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const requester = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                role: true
            }
        });

        if (!requester) {
            return res.status(401).json({
                success: false,
                message: 'Khong tim thay nguoi dung xac thuc!'
            });
        }

        if (requester.id !== id && requester.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Ban khong co quyen xem thong tin tai khoan nay.'
            });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: USER_SELECT_FIELDS
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Khong tim thay nguoi dung!'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Lay thong tin nguoi dung thanh cong',
            data: user
        });
    } catch (error) {
        console.error('Get user by id error:', error);
        res.status(500).json({
            success: false,
            message: 'Loi he thong, vui long thu lai sau'
        });
    }
};

const updateUserById = async (req, res) => {
    const { id } = req.params;
    const { email, name, password, role, status } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'Khong tim thay nguoi dung!'
            });
        }

        if (email && email !== existingUser.email) {
            if (!EMAIL_REGEX.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Email khong hop le!'
                });
            }

            const duplicatedEmail = await prisma.user.findUnique({
                where: { email }
            });

            if (duplicatedEmail) {
                return res.status(409).json({
                    success: false,
                    message: 'Email da duoc su dung boi tai khoan khac!'
                });
            }
        }

        let hashedPassword;
        if (password) {
            validateCredentials({
                email: email || existingUser.email,
                password
            });
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const nextStatus =
            status && status === 'DISABLED' ? 'DISABLED' : status ? 'ACTIVE' : undefined;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...(email ? { email } : {}),
                ...(name !== undefined ? { name } : {}),
                ...(role ? { role: role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER' } : {}),
                ...(nextStatus ? { status: nextStatus } : {}),
                ...(hashedPassword ? { password: hashedPassword } : {})
            },
            select: USER_SELECT_FIELDS
        });

        res.status(200).json({
            success: true,
            message: 'Cap nhat nguoi dung thanh cong!',
            data: updatedUser
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Loi he thong, vui long thu lai sau!'
        });
    }
};

const deleteUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'Khong tim thay nguoi dung!'
            });
        }

        await prisma.user.delete({
            where: { id }
        });

        res.status(200).json({
            success: true,
            message: 'Xoa nguoi dung thanh cong!'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Loi he thong, vui long thu lai sau!'
        });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: USER_SELECT_FIELDS
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Khong tim thay nguoi dung!'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get my profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Loi he thong, vui long thu lai sau!'
        });
    }
};

const updateMyProfile = async (req, res) => {
    const { email, name, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { id: req.userId }
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'Khong tim thay nguoi dung!'
            });
        }

        if (email && email !== existingUser.email) {
            if (!EMAIL_REGEX.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Email khong hop le!'
                });
            }

            const duplicatedEmail = await prisma.user.findUnique({
                where: { email }
            });

            if (duplicatedEmail) {
                return res.status(409).json({
                    success: false,
                    message: 'Email da duoc su dung boi tai khoan khac!'
                });
            }
        }

        let hashedPassword;
        if (password) {
            validateCredentials({
                email: email || existingUser.email,
                password
            });
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.userId },
            data: {
                ...(email ? { email } : {}),
                ...(name !== undefined ? { name } : {}),
                ...(hashedPassword ? { password: hashedPassword } : {})
            },
            select: USER_SELECT_FIELDS
        });

        res.status(200).json({
            success: true,
            message: 'Cap nhat profile thanh cong!',
            data: updatedUser
        });
    } catch (error) {
        console.error('Update my profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Loi he thong, vui long thu lai sau!'
        });
    }
};

export {
    register,
    createUserByAdmin,
    login,
    logout,
    getAllUsers,
    getUserById,
    refreshToken,
    getMyProfile,
    updateMyProfile,
    updateUserById,
    deleteUserById
};
