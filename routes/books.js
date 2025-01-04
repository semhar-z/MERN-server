import express from "express";
import axios from "axios";

const router = express.Router();

// Search books for kids with pagination
router.get("/search", async (req, res) => {
    const { query = "", page = 1, limit = 10 } = req.query;

    if (!query) {
        return res.status(400).json({
            success: false,
            message: "Please provide a search query",
        });
    }

    // Validate page and limit as numbers
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    try {
        // Call Open Library API with pagination and include kids-specific keywords
        const searchQuery = `${query} kids books`;
        const response = await axios.get(`https://openlibrary.org/search.json`, {
            params: {
                q: searchQuery,
                page: pageNum,
                limit: limitNum,
            },
        });

        const { docs, numFound } = response.data;
        const totalPages = Math.ceil(numFound / limitNum);

        const books = docs.map((book) => ({
            title: book.title || "Unknown Title",
            author: book.author_name?.join(", ") || "Unknown Author",
            publish_year: book.first_publish_year || "Unknown Year",
            cover: book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : "https://via.placeholder.com/128x192?text=No+Image",
            isbn: book.isbn?.[0] || "Unknown ISBN",
            description: book.first_sentence?.[0] || "Description not available",
        }));

        res.status(200).json({
            success: true,
            currentPage: pageNum,
            totalPages,
            totalBooks: numFound,
            data: books,
        });
    } catch (error) {
        console.error("Error fetching books: ", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
});

export default router;
