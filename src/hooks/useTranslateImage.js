/* ==============================
     HOOK: Translate Image
 ============================== */
import { useEffect, useState, useCallback } from "react";
import useScrollHandling from "./useScrollHandling";

const useTranslateImage = () => {
    // 1. Khởi tạo vị trí X mặc định là 80
    const [translateXPosition, setTranslateXPosition] = useState(80);
    
    // 2. Lấy dữ liệu từ hook cuộn trang
    const { scrollPosition, scrollDirection } = useScrollHandling();

    
    const handleTranslateX = useCallback(() => {
        if (scrollDirection === "down" && scrollPosition > 1500) {
           
            setTranslateXPosition((prev) => (prev <= 0 ? 0 : prev - 1));
        } else if (scrollDirection === "up") { 
            
            setTranslateXPosition((prev) => (prev >= 80 ? 80 : prev + 1));
        }
    }, [scrollDirection, scrollPosition]); 

   
    useEffect(() => {
        handleTranslateX();
    }, [handleTranslateX]); // Chỉ chạy khi hàm handleTranslateX thực sự thay đổi
        
    
    return { translateXPosition };
}

export default useTranslateImage;