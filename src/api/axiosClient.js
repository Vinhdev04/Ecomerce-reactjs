import axios from 'axios';
const axiosClient = axios.create({
    baseURL: 'http://localhost:3000/api/',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});

axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error('Lỗi khi truy vấn API', error);
        return Promise.reject(error);
    }
);

export default axiosClient;
