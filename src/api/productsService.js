import axiosClient from '../api/axiosClient';

// NOTE: LẤY DỮ LIỆU SẢN PHẨM TỪ API VÀ PHÂN TRANG SẢN PHẨM
const getAllProducts = async (page = 1, limit = 10) => {
    try {
        const res = await axiosClient.get('/products', {
            // {số trang và số sản phẩm được hiển thị}
            params: { page, limit }
        });

        return res;
    } catch (error) {
        console.error('Lỗi trong quá trình lấy dữ liệu từ API', error);
        throw error;
    }
};
export { getAllProducts };

// NOTE:
