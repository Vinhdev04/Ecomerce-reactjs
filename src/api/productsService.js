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

        const res = await axiosClient.get('/products', {
            query: {
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

export { getAllProducts };