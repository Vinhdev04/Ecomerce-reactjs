import axiosClient from '../api/axiosClient';

const getAllProducts = async (page = 1, limit = 10) => {
    try {
        const res = await axiosClient.get('/products', {
            params: { page, limit }
        });
        console.log('Products:', res);
        return res;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};
export { getAllProducts };
