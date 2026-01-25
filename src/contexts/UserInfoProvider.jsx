import { useState, useEffect } from "react";
import { UserInfoContext } from "@contexts/UserInfoContext.js";
import cookie from "js-cookie";
import { getInfoUser, logout as logoutAPI } from "@api/authServices.js";

const UserInfoProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(cookie.get("userId")); 
  const [isLoading, setIsLoading] = useState(false);

  // ============================================
  // ✅ LOGOUT FUNCTION - GỌI API + XÓA DỮ LIỆU
  // ============================================
  const handleLogout = async () => {
    try {
      // 1️⃣ GỌI API LOGOUT để xóa refreshToken trong DB và Cookie
      await logoutAPI();
      
    } catch (error) {
      console.error('❌ Logout API failed:', error);
      // Vẫn tiếp tục xóa dữ liệu local ngay cả khi API lỗi
    } finally {

      // 2️⃣ XÓA DỮ LIỆU LOCAL
      cookie.remove("token");
      cookie.remove("userId");
      localStorage.removeItem("users");
      localStorage.removeItem("rememberMe");
      
      // 3️⃣ RESET STATE
      setUserInfo(null);
      setUserId(null);
      
      // 4️⃣ REDIRECT VỀ TRANG CHỦ
      window.location.href = '/';
    }
  };

  // ============================================
  // FETCH USER INFO KHI CÓ userId
  // ============================================
  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      
      getInfoUser(userId)
        .then(res => {
          if (res.success && res.data) {
            setUserInfo(res.data);
          }
        })
        .catch(err => {
          console.error('❌ Failed to fetch user info:', err);
          
          //  Nếu lỗi 401/403 -> Token hết hạn -> Logout
          if (err.response?.status === 401 || err.response?.status === 403) {
            handleLogout();
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [userId]); 

  const value = {
    userInfo,
    setUserInfo,
    handleLogout,
    setUserId,
    userId,
    isLoading
  };

  return (
    <UserInfoContext.Provider value={value}>
      {children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;