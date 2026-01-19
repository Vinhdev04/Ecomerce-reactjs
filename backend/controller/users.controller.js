/* ==============================
     CONTROLLER: PRODUCTS 
 ============================== */
import prisma from '../lib/prisma.lib.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

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
                message: 'Không tìm thấy người dùng!'
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

        const token = jwt.sign(
            {
                userId: user.id
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            {userId: user.id},
            process.env.JWT_REFRESH_SECRET,
            {expiresIn: '7d'}
        )

         // 🔥 LƯU REFRESH TOKEN VÀO DATABASE
         await prisma.user.update({
            where:{id:user.id},
            data:{refreshToken}
         })
        // Thành công - trả về thông tin user (không có password)
        const { password: _, ...userWithoutPassword } = user;
        
        res.status(200).json({ 
            success: true,
            message: 'Đăng nhập thành công',
            data: {
                userWithoutPassword,
                token,
                refreshToken
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
        console.error('❌ Lỗi lấy thông tin user:', error);
        res.status(500).json({ 
            success: false,
            message: 'Lỗi hệ thống, vui lòng thử lại sau' 
        });
    }
};

const logout = async(req,res)=>{
    console.log("Logout!");
    res.status(200).json({ success: true, message: 'Đăng xuất thành công!' });
}

const refreshToken = async (req, res) => {

    const {refreshToken} = req.body;
    console.log(refreshToken);
    
    if(!refreshToken){
        res.status(401).json({
            success:false,
            message:'Không tìm thấy refresh token!'
        });
    }


    
}


export {
    register,
    login,logout,
    getAllUsers,getUserById,
    refreshToken
};

