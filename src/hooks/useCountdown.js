import { useState, useEffect, useCallback } from 'react';


/* ==============================
     * @param {string | Date} endTime - thời điểm kết thúc
 ============================== */
export default function useCountdown(endTime) {
    const calculateTimeLeft = useCallback(() => {
        const target = new Date(endTime).getTime();
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / 1000 / 60) % 60),
            seconds: Math.floor((diff / 1000) % 60)
        };
    }, [endTime]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [calculateTimeLeft]);

    return timeLeft;
}
