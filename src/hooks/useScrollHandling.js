import { useState, useEffect, useRef, useCallback } from "react";

const useScrollHandling = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [scrollDirection, setScrollDirection] = useState(null);
    const previousScrollPosition = useRef(0);

    const scrollTracking = useCallback(() => {
        const currentYPosition = window.pageYOffset;

      
        if (currentYPosition > previousScrollPosition.current) {
            setScrollDirection("down");
        } else if (currentYPosition < previousScrollPosition.current) {
            setScrollDirection("up");
        }

        // Cập nhật vị trí để hook useTranslateImage có dữ liệu tính toán
        setScrollPosition(currentYPosition);
        previousScrollPosition.current = currentYPosition <= 0 ? 0 : currentYPosition;
    }, []); // Mảng rỗng vì nó dùng ref để so sánh, không cần dependency

    useEffect(() => {
        window.addEventListener("scroll", scrollTracking);
        return () => window.removeEventListener("scroll", scrollTracking);
    }, [scrollTracking]);

    return { scrollPosition, scrollDirection };
};

export default useScrollHandling;