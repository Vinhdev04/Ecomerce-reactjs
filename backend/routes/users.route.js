/* ==============================
     ROUTE: USERS 
 ============================== */
import express from 'express';
const router = express.Router();
import { 
    register, 
    login, 
    logout,
    getAllUsers, 
    getUserById,
    refreshToken
} from '../controller/users.controller.js';
import authLimiter from '../helpers/authLimiter.js';
import refreshLimiter from '../helpers/refreshLimiter.js';
import verifyToken from '../middleware/auth.middleware.js';

// ============================================
// PUBLIC ROUTES (Không cần authentication)
// ============================================
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.post('/refresh-token', refreshLimiter, refreshToken);

// ============================================
// PROTECTED ROUTES (Cần authentication)
// ============================================
router.get('/users', verifyToken, getAllUsers);
router.get('/users/:id', verifyToken, getUserById);

export default router;