import { useState, useEffect } from "react";
import { UserInfoContext } from "@contexts/UserInfoContext.js";
import cookie from "js-cookie";
import { getInfoUser, logout as logoutAPI } from "@api/authServices.js";

const UserInfoProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(cookie.get("userId")); 
  const [isLoading, setIsLoading] = useState(false);


  const handleLogout = async () => {
    try {
      // 1️ GỌI API LOGOUT để xóa refreshToken trong DB và Cookie
      await logoutAPI();
      
    } catch (error) {
      console.error('❌ Logout API failed:', error);
      
    } finally {

     
      cookie.remove("token");
      cookie.remove("userId");
      localStorage.removeItem("users");
      localStorage.removeItem("rememberMe");
      
      
      setUserInfo(null);
      setUserId(null);
      
      
      window.location.href = '/';
    }
  };


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