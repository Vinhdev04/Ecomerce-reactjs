import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
   windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: {
        success: false,
        message: "Bạn đã thử quá nhiều lần!. Vui lòng thử lại sau 15 phút!"
    },
    standardHeaders: true,
    legacyHeaders: false,
})

export default authLimiter;