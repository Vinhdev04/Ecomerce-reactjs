import express from 'express';
import {
    getActivityLogs,
    updateActivityStatus
} from '../controller/activity.controller.js';
import verifyToken from '../middleware/auth.middleware.js';
import verifyAdmin from '../middleware/admin.middleware.js';

const router = express.Router();

router.get('/', verifyToken, verifyAdmin, getActivityLogs);
router.put('/:id/status', verifyToken, verifyAdmin, updateActivityStatus);

export default router;
