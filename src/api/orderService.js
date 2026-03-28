import axiosClient from './axiosClient';

const orderService = {
    createOrder: (payload) => axiosClient.post('/orders', payload),
    getOrders: () => axiosClient.get('/orders'),
    updateOrderStatus: (id, payload) => axiosClient.put(`/orders/${id}`, payload)
};

export default orderService;
