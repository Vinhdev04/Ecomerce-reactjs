/* ==============================
     ROUTE: USERS 
 ============================== */
import express from 'express';
const router = express.Router();
import { 
    register, 
    login, 
    // getAllUsers, 
    // getUserById 
} from '../controller/users.controller.js';

// Auth routes
router.post('/register', register);
router.post('/login', login);


// router.get('/users', getAllUsers);
// router.get('/users/:id', getUserById);

export default router;