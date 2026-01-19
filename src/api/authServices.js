import axiosClient from '../api/axiosClient';

// ============================================
// REGISTER - Đăng ký tài khoản
// ============================================
const register = async (body) => {
    try {
        const res = await axiosClient.post('/register', body);
        return res;
    } catch (error) {
        console.error('❌ Đăng ký tài khoản thất bại!', error.response?.data || error.message);
        throw error;
    }
};

// ============================================
// LOGIN - Đăng nhập
// ============================================
const login = async (body) => {
    try {
        // ✅ Backend sẽ tự động set refreshToken vào httpOnly cookie
        const res = await axiosClient.post('/login', body);
        return res;
    } catch (error) {
        console.error('❌ Đăng nhập thất bại!', error.response?.data || error.message);
        throw error;
    }
};

// ============================================
// LOGOUT - Đăng xuất
// ============================================
const logout = async () => {
    try {
        // ✅ Backend sẽ xóa refreshToken cookie và DB
        const res = await axiosClient.post('/logout');
        return res;
    } catch (error) {
        console.error('❌ Đăng xuất thất bại!', error.response?.data || error.message);
        throw error;
    }
};

// ============================================
// GET USER INFO - Lấy thông tin user
// ============================================
const getInfoUser = async (userId) => {
    try {
        if (!userId) {
            throw new Error('userId is required');
        }
        
        const res = await axiosClient.get(`/users/${userId}`);
        return res;
    } catch (error) {
        console.error('❌ Lấy thông tin user thất bại!', error.response?.data || error.message);
        throw error;
    }
};

// ============================================
// GET ALL USERS - Lấy danh sách users
// ============================================
const getAllUsers = async () => {
    try {
        const res = await axiosClient.get('/users');
        return res;
    } catch (error) {
        console.error('❌ Lấy danh sách users thất bại!', error.response?.data || error.message);
        throw error;
    }
};

export { 
    register, 
    login, 
    logout, 
    getInfoUser,
    getAllUsers 
};