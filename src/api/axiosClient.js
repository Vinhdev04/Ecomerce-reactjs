import axios from 'axios';
import Cookies from 'js-cookie';
import { Cookie } from 'lucide-react';
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

axiosClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Lỗi khi truy vấn API', error);
        return Promise.reject(error);
    }
);


axiosClient.interceptors.response.use((res)=>{
    return res;
},
async(error)=>{
    console.log(error);
    const originalReq = error.config;
    const refreshToken = Cookies.get('refreshToken');

    if(!refreshToken) return Promise.reject(error);

    try{
        const res = await axiosClient.post("/refresh-token",{
            token: refreshToken
        });

        const newAccessToken = res.data.accessToken;
        Cookies.set('token', newAccessToken);
        originalReq.headers.Authorization = `Bearer ${newAccessToken}`;

        
        return axiosClient(originalReq);
    }catch(error){
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        return Promise.reject(error);
    
    }
    
})