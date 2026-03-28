import express from "express";
import { createNews, getAllNews, getNewsById, updateNews, deleteNews } from "../controller/news.controller.js";
import verifyToken from '../middleware/auth.middleware.js';
import verifyAdmin from '../middleware/admin.middleware.js';
import optionalAuth from '../middleware/optionalAuth.middleware.js';

const router = express.Router();

router.get("/", optionalAuth, getAllNews);
router.get("/:id", optionalAuth, getNewsById);
router.post("/", verifyToken, verifyAdmin, createNews);
router.put("/:id", verifyToken, verifyAdmin, updateNews);
router.delete("/:id", verifyToken, verifyAdmin, deleteNews);

export default router;
