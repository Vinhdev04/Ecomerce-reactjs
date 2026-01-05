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

    /**
     * 3. Dùng useCallback để "đóng băng" định nghĩa hàm.
     * Hàm này chỉ thay đổi khi scrollDirection hoặc scrollPosition thay đổi.
     */
    const handleTranslateX = useCallback(() => {
        if (scrollDirection === "down" && scrollPosition > 1500) {
            // Dùng dạng (prev) => ... để không phụ thuộc vào biến translateXPosition
            // Giúp tránh việc phải đưa translateXPosition vào mảng dependency bên dưới
            setTranslateXPosition((prev) => (prev <= 0 ? 0 : prev - 1));
        } else if (scrollDirection === "up") { 
            // Khi cuộn lên, trả về vị trí cũ nhưng không vượt quá 80
            setTranslateXPosition((prev) => (prev >= 80 ? 80 : prev + 1));
        }
    }, [scrollDirection, scrollPosition]); 

    /**
     * 4. useEffect đồng bộ hóa việc tính toán với chu kỳ render.
     * Lỗi "Cascading renders" sẽ hết vì handleTranslateX giờ đã ổn định.
     */
    useEffect(() => {
        handleTranslateX();
    }, [handleTranslateX]); // Chỉ chạy khi hàm handleTranslateX thực sự thay đổi
        
    // 5. Trả về kết quả để UI sử dụng
    return { translateXPosition };
}

export default useTranslateImage;