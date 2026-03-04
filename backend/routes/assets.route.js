import express from 'express';
import { proxyImage } from '../controller/assets.controller.js';

const router = express.Router();

router.get('/proxy', proxyImage);

export default router;
