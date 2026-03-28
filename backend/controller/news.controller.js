import prisma from "../lib/prisma.lib.js";
import logActivity from '../helpers/activityLogger.js';

const newsListSelect = {
    id: true,
    title: true,
    summary: true,
    image: true,
    author: true,
    category: true,
    tags: true,
    readTime: true,
    createdAt: true,
    updatedAt: true
};

const normalizeReadTime = (readTime) => {
    if (readTime === undefined || readTime === null || readTime === '') {
        return null;
    }

    const parsed = Number(readTime);
    return Number.isNaN(parsed) ? null : parsed;
};

// Create a new news article
export const createNews = async (req, res) => {
    try {
        const { title, summary, content, image, author, category, tags, readTime } = req.body;

        const newNews = await prisma.news.create({
            data: {
                title,
                summary,
                content,
                image,
                author,
                category,
                tags: Array.isArray(tags) ? tags : [],
                readTime: normalizeReadTime(readTime)
            }
        });

        res.status(201).json({
            success: true,
            data: newNews
        });
    } catch (error) {
        console.error("Create news error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create news"
        });
    }
};

// Get all news articles
export const getAllNews = async (req, res) => {
    try {
        const news = await prisma.news.findMany({
            select: newsListSelect,
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (req.userId) {
            await logActivity({
                req,
                userId: req.userId,
                action: 'READ_NEWS_LIST',
                entityType: 'NEWS',
                detail: {
                    total: news.length
                },
                sessionId: req.sessionId || null
            });
        }

        res.status(200).json({
            success: true,
            data: news
        });
    } catch (error) {
        console.error("Get all news error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch news"
        });
    }
};

// Get a single news article by ID
export const getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await prisma.news.findUnique({
            where: {
                id
            }
        });

        if (!news) {
            return res.status(404).json({
                success: false,
                message: "News article not found"
            });
        }

        if (req.userId) {
            await logActivity({
                req,
                userId: req.userId,
                action: 'VIEW_NEWS',
                entityType: 'NEWS',
                entityId: news.id,
                detail: {
                    title: news.title
                },
                sessionId: req.sessionId || null
            });
        }

        res.status(200).json({
            success: true,
            data: news
        });
    } catch (error) {
        console.error("Get news by ID error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch news article"
        });
    }
};

// Update a news article
export const updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, summary, content, image, author, category, tags, readTime } = req.body;

        const updatedNews = await prisma.news.update({
            where: {
                id
            },
            data: {
                title,
                summary,
                content,
                image,
                author,
                category,
                tags: Array.isArray(tags) ? tags : [],
                readTime: normalizeReadTime(readTime)
            }
        });

        res.status(200).json({
            success: true,
            data: updatedNews
        });
    } catch (error) {
        console.error("Update news error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update news"
        });
    }
};

// Delete a news article
export const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.news.delete({
            where: {
                id
            }
        });

        res.status(200).json({
            success: true,
            message: "News article deleted successfully"
        });
    } catch (error) {
        console.error("Delete news error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete news"
        });
    }
};
