import axios from 'axios';
const axiosClient = axios.create({
    baseURL: 'http://localhost:3000/api/',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});

axiosClient.interceptors.response.use(
    (response) => {
        return response.data; // Trả về data luôn
    },
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default axiosClient;
