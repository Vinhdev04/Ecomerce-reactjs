import rateLimit from "express-rate-limit";

/**
 * Rate limiter cho login endpoint
 * Giới hạn 5 requests mỗi 15 phút
 */
const authLimiter = rateLimit({
   windowMs: 1 * 60 * 1000, 
    max: 5, 
    message: {
        success: false,
        message: "Bạn đã thử quá nhiều lần!. Vui lòng thử lại sau 15 phút!"
    },
    standardHeaders: true,
    legacyHeaders: false,
})

export default authLimiter;