import axios from "axios";
import Cookies from "js-cookie";

// ==================================================
// BASE URL (tự động chọn local hoặc production)
// ==================================================
const API_BASE =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_API_URL
    : (import.meta.env.VITE_API_URL_DEPLOY || 'https://your-render-backend-url.onrender.com/api'); // Fallback nếu quên set env

console.log('🌐 API BASE URL:', API_BASE); // Debug log

const axiosClient = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // Tăng lên 60 giây 
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});


// ==================================================
// REQUEST INTERCEPTOR — Gắn access token
// ==================================================
axiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================================================
// RESPONSE INTERCEPTOR — Refresh token khi 401
// ==================================================
axiosClient.interceptors.response.use(
  (response) => response.data,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // GỌI API REFRESH TOKEN ĐÚNG URL (KHÔNG localhost)
        const response = await axios.post(
          `${API_BASE}/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { token: newToken, id } = response.data.data;

        // Lưu token mới
        Cookies.set("token", newToken, {
          expires: 1 / 96, // 15 phút
          secure: import.meta.env.PROD, // Vite production
          sameSite: "strict",
        });

        Cookies.set("id", id, {
          expires: 1 / 96,
          secure: import.meta.env.PROD,
          sameSite: "strict",
        });

        // Gắn token mới vào request cũ
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axiosClient(originalRequest);
      } catch (refreshError) {
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
