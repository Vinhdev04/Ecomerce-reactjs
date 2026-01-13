/* ==============================
     CONTROLLER: PRODUCTS 
 ============================== */
import prisma from '../lib/prisma.lib.js';
import bcrypt from 'bcrypt';


const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

// Register user
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

        // Tạo name từ email (phần trước @)
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




const login = async (req, res) => {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
        return res.status(400).json({ 
            success: false,
            message: 'Email và mật khẩu là bắt buộc' 
        });
    }

    try {
        // Tìm user theo email
        const user = await prisma.user.findUnique({
            where: { email: username }
        });

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Email hoặc mật khẩu không chính xác' 
            });
        }

        // So sánh password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: 'Email hoặc mật khẩu không chính xác' 
            });
        }

        // Thành công - trả về thông tin user (không có password)
        const { password: _, ...userWithoutPassword } = user;
        
        res.status(200).json({ 
            success: true,
            message: 'Đăng nhập thành công',
            data: userWithoutPassword
        });

    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({ 
            success: false,
            message: 'Lỗi hệ thống, vui lòng thử lại sau' 
        });
    }
};

export {
    register,
    login
};

