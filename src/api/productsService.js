import axiosClient from '../api/axiosClient';

const getAllProducts = async (page = 1, limit = 10) => {
    try {
        const res = await axiosClient.get('/products', {
            params: { page, limit }
        });
        console.log('Danh sách sản phẩm từ API', res);
        return res;
    } catch (error) {
        console.error('Lỗi trong quá trình lấy dữ liệu từ API', error);
        throw error;
    }
};
export { getAllProducts };
