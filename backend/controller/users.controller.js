/* ==============================
     CONTROLLER: USERS 
 ============================== */
import prisma from '../lib/prisma.lib.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

/* ==============================
     REGISTER - Đăng ký
 ============================== */
const register = async (req, res) => {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
        return res.status(400).json({ 
            success: false,
            message: 'Email và mật khẩu là bắt buộc!' 
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
        return res.status(400).json({ 
            success: false,
            message: 'Email không hợp lệ!' 
        });
    }

    if (password.length < 6) {
        return res.status(400).json({ 
            success: false,
            message: 'Mật khẩu phải có ít nhất 6 ký tự!' 
        });
    }

    if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({ 
            success: false,
            message: 'Mật khẩu phải chứa ít nhất: 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&)!' 
        });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: username }
        });

        if (existingUser) {
            return res.status(409).json({ 
                success: false,
                message: 'Email đã được sử dụng!' 
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const name = username.split('@')[0];

        const newUser = await prisma.user.create({
            data: {
                email: username,
                password: hashedPassword,
                name: name
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        });

        res.status(201).json({ 
            success: true,
            message: 'Đăng ký tài khoản thành công!',
            data: newUser
        });

    } catch (error) {
        console.error('Lỗi đăng ký tài khoản:', error);
        res.status(500).json({ 
            success: false,
            message: 'Lỗi hệ thống, vui lòng thử lại sau!',
            error: error.message
        });
    }
};

// ============================================
// LOGIN - Đăng nhập
// ============================================
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

        // Tạo tokens
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

        // Lưu refresh token vào DB
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        // ✅ SET REFRESH TOKEN VÀO HTTPONLY COOKIE
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,      // ✅ QUAN TRỌNG: JavaScript KHÔNG thể truy cập
            secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS trong production
            sameSite: 'strict',  // Chống CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
            path: '/' // ✅ QUAN TRỌNG: Cookie áp dụng cho toàn bộ domain
        });

        const { password: _, refreshToken: __, ...userWithoutPassword } = user;
        
        res.status(200).json({ 
            success: true,
            message: 'Đăng nhập thành công',
            data: {
                id: user.id, // ✅ THÊM id
                user: userWithoutPassword,
                token // ✅ CHỈ trả access token, KHÔNG trả refresh token
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

// ============================================
// LOGOUT - Xóa cookie và Database
// ============================================
const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        if (refreshToken) {
            try {
                // ✅ Decode token KHÔNG verify (vì có thể đã hết hạn)
                const decoded = jwt.decode(refreshToken);
                
                if (decoded && decoded.userId) {
                    // ✅ Xóa refresh token trong DB
                    await prisma.user.update({
                        where: { id: decoded.userId },
                        data: { refreshToken: null }
                    });
                }
            } catch (err) {
                // ✅ Bỏ qua lỗi decode, vẫn tiếp tục xóa cookie
                console.error('Token decode error (ignored):', err.message);
            }
        }

        // ✅ XÓA COOKIE (LUÔN THỰC HIỆN)
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/' // Phải giống khi set cookie
        });

        res.status(200).json({ 
            success: true, 
            message: 'Đăng xuất thành công!' 
        });
        
    } catch (err) {
        console.error('❌ Lỗi đăng xuất:', err);
        
        // ✅ VẪN XÓA COOKIE ngay cả khi có lỗi
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

// ============================================
// REFRESH TOKEN - Đọc từ cookie
// ============================================
const refreshToken = async (req, res) => {
    // ✅ LẤY REFRESH TOKEN TỪ COOKIE
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Không tìm thấy refresh token!'
        });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({
                success: false,
                message: 'Refresh token không hợp lệ!'
            });
        }

        // Tạo tokens mới
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

        // Cập nhật refresh token mới trong DB
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken }
        });

        // ✅ CẬP NHẬT COOKIE MỚI
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,      //  QUAN TRỌNG
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/' //  QUAN TRỌNG
        });

        res.status(200).json({
            success: true,
            message: 'Refresh token thành công!',
            data: {
                token: newAccessToken
                //  KHÔNG trả refresh token trong response
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



/* ==============================
     GET ALL USERS
 ============================== */
const getAllUsers = async (req, res) => {
   try{
     const users = await prisma.user.findMany({
       select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true
       }
    })

    if(!users || users.length === 0){
        return res.status(404).json({
            success:false,
            message:'Không có người dùng nào trong hệ thống!'
        });
    }

     res.status(200).json({ 
            success: true,
            message: 'Lấy danh sách người dùng thành công!',
            data: users,
            total: users.length
        });

   }catch(error){
        console.error('Lỗi lấy danh sách người dùng:', error);
        res.status(500).json({ 
            success: false,
            message: 'Lỗi hệ thống, vui lòng thử lại sau!' 
        });
   }
}

/* ==============================
     GET USER BY ID
 ============================== */
const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true
            }
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
        console.error('⌚ Lỗi lấy thông tin user:', error);
        res.status(500).json({ 
            success: false,
            message: 'Lỗi hệ thống, vui lòng thử lại sau' 
        });
    }
};

export {
    register,
    login,
    logout,
    getAllUsers,
    getUserById,
    refreshToken
};