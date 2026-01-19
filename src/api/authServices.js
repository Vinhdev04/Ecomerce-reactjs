import axiosClient from '../api/axiosClient';

// ============================================
// REGISTER
// ============================================
const register = async (body) => {
    try {
        const res = await axiosClient.post('/register', body);
        return res;
    } catch (error) {
        console.error(' Đăng ký tài khoản thất bại!', error.response?.data || error.message);
        throw error;
    }
};

/* ==============================
     LOGIN
 ============================== */
const login = async (body) => {
    try{
        const res = await axiosClient.post('/login', body);
        return res;
    }catch(error){
        console.error('Đăng nhập thất bại! ', error.response?.data || error.message);
        throw error;
    }
}


/* ==============================
     LOGOUT
 ============================== */
const logout = async(body) => {
    try {
        const res = await axiosClient.post('/logout',body);
        return res;
    } catch (error) {
        console.error("Đăng xuất thất bại!", error.response?.data || error.message);
    }
}

/* ==============================
     GET USER INFO
 ============================== */
const getInfoUser = async() => {
     try {
        const res = await axiosClient.get('/users/69669b1ecf77a4bd40c097d8');
        return res;
    } catch (error) {
        console.error("Đăng xuất thất bại!", error.response?.data || error.message);
    }
}
export { register ,login,logout,getInfoUser};
