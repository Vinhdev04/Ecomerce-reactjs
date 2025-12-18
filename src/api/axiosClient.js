import axios from 'axios';
const axiosClient = axios.create({
    baseURL: ' https://fakestoreapi.com/products',
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});
export default axiosClient;
