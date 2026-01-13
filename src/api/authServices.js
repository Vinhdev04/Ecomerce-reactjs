import axiosClient from '../api/axiosClient';


const register = async (body) => {
     console.log('📤 Đăng ký tài khoản:', body);
    try {
        const res = await axiosClient.post('/register', body);
        console.log('✅ Đăng ký tài khoản thành công:', res);
        return res;
    } catch (error) {
        console.error(' Đăng ký tài khoản thất bại:', error.response?.data || error.message);
        throw error;
    }
};

const login = async (body) => {
    console.log('📤 Đăng nhập:', body);

    try{
        const res = await axiosClient.post('/login', body);
        console.log('✅ Đăng nhập thành công:', res);
        return res;
    }catch(error){
        console.error('Đăng nhập thất bại:', error.response?.data || error.message);
        throw error;
    }
}
export { register ,login};

// NOTE:
