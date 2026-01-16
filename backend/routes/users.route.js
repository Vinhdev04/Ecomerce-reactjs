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
    getUserById 
} from '../controller/users.controller.js';
import authLimiter from '../helpers/authLimiter.js';
// Auth routes
router.post('/register',authLimiter, register);
router.post('/login',authLimiter, login);
router.post('/logout', logout);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);

export default router;