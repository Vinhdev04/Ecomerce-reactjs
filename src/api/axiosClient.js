import axios from 'axios';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000/api/',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});

// ============================================
// REQUEST INTERCEPTOR - Thêm token vào header
// ============================================
axiosClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ============================================
// RESPONSE INTERCEPTOR - Xử lý refresh token
// ============================================
axiosClient.interceptors.response.use(
   
    (response) => {
        return response.data;
    },
    
    // ❌ Error response - xử lý refresh token
    async (error) => {
        const originalRequest = error.config;

        // Kiểm tra lỗi 401 (Unauthorized) và chưa retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = Cookies.get('refreshToken');

            // Không có refresh token -> Redirect login
            if (!refreshToken) {
                Cookies.remove('token');
                Cookies.remove('refreshToken');
                // window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                // ⚠️ QUAN TRỌNG: Gọi axios thuần, KHÔNG dùng axiosClient
                // để tránh vòng lặp vô hạn
                const response = await axios.post(
                    'http://localhost:3000/api/refresh-token',
                    { refreshToken },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                // Lấy tokens mới từ response
                const { token: newToken, refreshToken: newRefreshToken } = response.data.data;

                // Lưu tokens mới
                Cookies.set('token', newToken);
                Cookies.set('refreshToken', newRefreshToken);

                // Retry request gốc với token mới
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosClient(originalRequest);

            } catch (refreshError) {
                // Refresh token thất bại -> Logout
                Cookies.remove('token');
                Cookies.remove('refreshToken');
                // window.location.href = '/login'; // Uncomment khi cần
                return Promise.reject(refreshError);
            }
        }

        // Lỗi khác 401 hoặc đã retry -> reject
        return Promise.reject(error);
    }
);

export default axiosClient;