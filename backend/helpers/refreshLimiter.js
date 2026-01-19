import rateLimit from 'express-rate-limit';

/**
 * Rate limiter cho refresh token endpoint
 * Giới hạn 10 requests mỗi 15 phút
 */
const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, 
    message: {
        success: false,
        message: 'Quá nhiều yêu cầu làm mới token. Vui lòng thử lại sau!'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export default refreshLimiter;