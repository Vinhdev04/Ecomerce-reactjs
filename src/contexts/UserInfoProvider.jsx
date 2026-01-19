import { useState, useEffect } from "react";
import { UserInfoContext } from "@contexts/UserInfoContext.js";
import cookie from "js-cookie";
import { getInfoUser } from "@api/authServices.js";

const UserInfoProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(cookie.get("userId")); 
  const [isLoading, setIsLoading] = useState(false);

  // console.log('👤 Current userId:', userId);
  // console.log('👤 Current userInfo:', userInfo);


  const handleLogout = () => {
    //  Xóa tất cả cookies
    cookie.remove("token");
    cookie.remove("userId");
    
    //  Xóa localStorage
    localStorage.removeItem("users");
    localStorage.removeItem("rememberMe");
    
    //  Reset state
    setUserInfo(null);
    setUserId(null);
    
    //  Reload page
    window.location.reload();
  };


  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      
      getInfoUser(userId)
        .then(res => {
          // console.log('✅ User info fetched:', res);
          
          if (res.success && res.data) {
           
            setUserInfo(res.data);
          }
        })
        .catch(err => {
          console.error(' Failed to fetch user info:', err);
          
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