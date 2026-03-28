import axiosClient from '../api/axiosClient';

/* ==============================
   LẤY TẤT CẢ SẢN PHẨM VỚI FILTER
 ============================== */
const getAllProducts = async (query = {}) => {
    try {
        const {
            page = 1,
            limit = 8,
            sortType = '0',
            category
        } = query;

        // FIX: Đổi query thành params
        const res = await axiosClient.get('/products', {
            params: {
                page,
                limit,
                sortType,
                ...(category && { category })
            }
        });

        return res;
    } catch (error) {
        console.error('Lỗi trong quá trình lấy dữ liệu từ API', error);
        throw error;
    }
};

const getProductById = async (productId) => {
    try {
        const res = await axiosClient.get(`/products/${productId}`);
        return res;
    } catch (error) {
        console.error('Loi trong qua trinh lay chi tiet san pham', error);
        throw error;
    }
};

export { getAllProducts, getProductById };
