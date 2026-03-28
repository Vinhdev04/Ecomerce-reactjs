import jwt from 'jsonwebtoken';

const optionalAuth = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    const token =
        authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : null;

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.sessionId = decoded.sessionId || null;
        next();
    } catch (_error) {
        next();
    }
};

export default optionalAuth;
