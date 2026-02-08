import prisma from "../lib/prisma.lib.js";

// Create a new news article
export const createNews = async (req, res) => {
    try {
        const { title, summary, content, image, author, category } = req.body;

        const newNews = await prisma.news.create({
            data: {
                title,
                summary,
                content,
                image,
                author,
                category
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
            orderBy: {
                createdAt: 'desc'
            }
        });

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
        const { title, summary, content, image, author, category } = req.body;

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
                category
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
