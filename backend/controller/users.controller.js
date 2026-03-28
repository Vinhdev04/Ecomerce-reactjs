import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.lib.js';

const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const USER_SELECT_FIELDS = {
    id: true,
    email: true,
    name: true,
    role: true,
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
        throw buildError('Email và mật khẩu là bắt buộc!', 400);
    }

    if (!EMAIL_REGEX.test(email)) {
        throw buildError('Email không hợp lệ!', 400);
    }

    if (password.length < 6) {
        throw buildError('Mật khẩu phải có ít nhất 6 ký tự!', 400);
    }

    if (!PASSWORD_REGEX.test(password)) {
        throw buildError(
            'Mật khẩu phải chứa ít nhất: 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&)!',
            400
        );
    }
};

const createUserRecord = async ({
    email,
    password,
    name,
    role = 'CUSTOMER'
}) => {
    validateCredentials({ email, password });

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw buildError('Email đã được sử dụng!', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: name?.trim() || email.split('@')[0],
            role
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
            message: 'Đăng ký tài khoản thành công!',
            data: newUser
        });
    } catch (error) {
        console.error('Lỗi đăng ký tài khoản:', error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Lỗi hệ thống, vui lòng thử lại sau!',
            error: error.message
        });
    }
};

const createUserByAdmin = async (req, res) => {
    const { email, password, name, role } = req.body;

    try {
        const newUser = await createUserRecord({
            email,
            password,
            name,
            role: role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER'
        });

        res.status(201).json({
            success: true,
            message: 'Tạo người dùng mới thành công!',
            data: newUser
        });
    } catch (error) {
        console.error('Lỗi tạo người dùng từ admin:', error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email và mật khẩu là bắt buộc'
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: username }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy người dùng!'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không chính xác'
            });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
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
            message: 'Đăng nhập thành công',
            data: {
                id: user.id,
                user: userWithoutPassword,
                token
            }
        });
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống, vui lòng thử lại sau'
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
            message: 'Đăng xuất thành công!'
        });
    } catch (err) {
        console.error('Lỗi đăng xuất:', err);

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống!'
        });
    }
};

const refreshToken = async (req, res) => {
    const refreshTokenValue = req.cookies.refreshToken;

    if (!refreshTokenValue) {
        return res.status(401).json({
            success: false,
            message: 'Không tìm thấy refresh token!'
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
                message: 'Refresh token không hợp lệ!'
            });
        }

        const newAccessToken = jwt.sign(
            { userId: user.id },
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
            message: 'Refresh token thành công!',
            data: {
                token: newAccessToken
            }
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({
                success: false,
                message: 'Refresh token đã hết hạn, vui lòng đăng nhập lại!'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({
                success: false,
                message: 'Refresh token không hợp lệ!'
            });
        }

        console.error('Lỗi refresh token:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
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
            message: 'Lấy danh sách người dùng thành công!',
            data: users,
            total: users.length
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách người dùng:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
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
                message: 'Không tìm thấy người dùng xác thực!'
            });
        }

        if (requester.id !== id && requester.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xem thông tin tài khoản này.'
            });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: USER_SELECT_FIELDS
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng!'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Lấy thông tin người dùng thành công',
            data: user
        });
    } catch (error) {
        console.error('Lỗi lấy thông tin user:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống, vui lòng thử lại sau'
        });
    }
};

const updateUserById = async (req, res) => {
    const { id } = req.params;
    const { email, name, password, role } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng!'
            });
        }

        if (email && email !== existingUser.email) {
            if (!EMAIL_REGEX.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Email không hợp lệ!'
                });
            }

            const duplicatedEmail = await prisma.user.findUnique({
                where: { email }
            });

            if (duplicatedEmail) {
                return res.status(409).json({
                    success: false,
                    message: 'Email đã được sử dụng bởi tài khoản khác!'
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
            where: { id },
            data: {
                ...(email ? { email } : {}),
                ...(name !== undefined ? { name } : {}),
                ...(role ? { role: role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER' } : {}),
                ...(hashedPassword ? { password: hashedPassword } : {})
            },
            select: USER_SELECT_FIELDS
        });

        res.status(200).json({
            success: true,
            message: 'Cập nhật người dùng thành công!',
            data: updatedUser
        });
    } catch (error) {
        console.error('Lỗi cập nhật người dùng:', error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Lỗi hệ thống, vui lòng thử lại sau!'
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
                message: 'Không tìm thấy người dùng!'
            });
        }

        await prisma.user.delete({
            where: { id }
        });

        res.status(200).json({
            success: true,
            message: 'Xóa người dùng thành công!'
        });
    } catch (error) {
        console.error('Lỗi xóa người dùng:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
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
    updateUserById,
    deleteUserById
};
