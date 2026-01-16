import axiosClient from '../api/axiosClient';


const register = async (body) => {
    try {
        const res = await axiosClient.post('/register', body);
        return res;
    } catch (error) {
        console.error(' Đăng ký tài khoản thất bại!', error.response?.data || error.message);
        throw error;
    }
};

const login = async (body) => {
    try{
        const res = await axiosClient.post('/login', body);
        return res;
    }catch(error){
        console.error('Đăng nhập thất bại! ', error.response?.data || error.message);
        throw error;
    }
}




const logout = async(body) => {
    try {
        const res = await axiosClient.post('/logout',body);
        return res;
    } catch (error) {
        console.error("Đăng xuất thất bại!", error.response?.data || error.message);
    }
}

const getInfoUser = async() => {
     try {
        const res = await axiosClient.get('/user/info/69669b1ecf77a4bd40c097d8');
        return res;
    } catch (error) {
        console.error("Đăng xuất thất bại!", error.response?.data || error.message);
    }
}
export { register ,login,logout,getInfoUser};
