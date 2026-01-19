import rateLimit from 'express-rate-limit';

const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: 'Quá nhiều yêu cầu refresh token!'
});

export default refreshLimiter;