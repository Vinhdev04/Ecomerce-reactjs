import axiosClient from './axiosClient';

const normalizeProductPayload = (payload) => ({
    ...payload,
    price: Number(payload.price),
    stock: Number(payload.stock),
    rating: Number(payload.rating),
    image: Array.isArray(payload.image)
        ? payload.image
        : String(payload.image || '')
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean),
    size: Array.isArray(payload.size)
        ? payload.size
        : String(payload.size || '')
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
});

const normalizeNewsPayload = (payload) => ({
    ...payload,
    tags: Array.isArray(payload.tags)
        ? payload.tags
        : String(payload.tags || '')
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean),
    readTime: payload.readTime ? Number(payload.readTime) : null
});

const adminService = {
    createUser: ({ name, email, password, role }) =>
        axiosClient.post('/users', { email, password, name, role }),
    getUsers: () => axiosClient.get('/users'),
    updateUser: (id, payload) => axiosClient.put(`/users/${id}`, payload),
    deleteUser: (id) => axiosClient.delete(`/users/${id}`),

    getProducts: () =>
        axiosClient.get('/products', {
            params: {
                page: 1,
                limit: 200,
                sortType: '0'
            }
        }),
    createProduct: (payload) =>
        axiosClient.post('/products', normalizeProductPayload(payload)),
    updateProduct: (id, payload) =>
        axiosClient.put(`/products/${id}`, normalizeProductPayload(payload)),
    deleteProduct: (id) => axiosClient.delete(`/products/${id}`),

    getNews: () => axiosClient.get('/news'),
    createNews: (payload) =>
        axiosClient.post('/news', normalizeNewsPayload(payload)),
    updateNews: (id, payload) =>
        axiosClient.put(`/news/${id}`, normalizeNewsPayload(payload)),
    deleteNews: (id) => axiosClient.delete(`/news/${id}`)
};

export default adminService;
