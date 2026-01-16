import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
    windowMs: 1*60*1000, // 15 minutes
    max: 5, // giới hạn 5 lần thử
    message: {
        success: false,
        message: "Bạn đã thử quá nhiều lần!. Vui lòng thử lại sau 15 phút!"
    },
    standardHeaders: true,
    legacyHeaders: false,
})

export default authLimiter;