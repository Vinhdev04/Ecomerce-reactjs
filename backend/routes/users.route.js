import express from 'express';
import {
    register,
    createUserByAdmin,
    login,
    logout,
    getAllUsers,
    getUserById,
    refreshToken,
    updateUserById,
    deleteUserById
} from '../controller/users.controller.js';
import authLimiter from '../helpers/authLimiter.js';
import refreshLimiter from '../helpers/refreshLimiter.js';
import verifyToken from '../middleware/auth.middleware.js';
import verifyAdmin from '../middleware/admin.middleware.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.post('/refresh-token', refreshLimiter, refreshToken);

router.post('/users', verifyToken, verifyAdmin, createUserByAdmin);
router.get('/users', verifyToken, verifyAdmin, getAllUsers);
router.get('/users/:id', verifyToken, getUserById);
router.put('/users/:id', verifyToken, verifyAdmin, updateUserById);
router.delete('/users/:id', verifyToken, verifyAdmin, deleteUserById);

export default router;
