// routes/books.js
import express from "express";
import axios from "axios";

const router = express.Router();

// Search books for kids learning to read with pagination
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
        // Call Open Library API with pagination
        const response = await axios.get(`https://openlibrary.org/search.json`, {
            params: {
                q: `${query} kids reading`,
                page: pageNum,
                limit: limitNum,
            },
        });

        const { docs, numFound } = response.data;
        const totalPages = Math.ceil(numFound / limitNum);

        const books = await Promise.all(
            docs.map(async (book) => {
                let editions = [];
                try {
                    // Fetch editions for each book from Open Library API
                    if (book.key) {
                        const editionResponse = await axios.get(
                            `https://openlibrary.org${book.key}.json`
                        );
                        editions = editionResponse.data?.editions || [];
                    }
                } catch (editionError) {
                    console.warn(
                        `Failed to fetch editions for book: ${book.key}`,
                        editionError.message
                    );
                }

                return {
                    title: book.title || "Unknown Title",
                    author: book.author_name?.join(", ") || "Unknown Author",
                    publish_year: book.first_publish_year || "Unknown Year",
                    cover: book.cover_i
                        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                        : null,
                    key: book.key || null,
                    editions: editions.map((edition) => ({
                        key: edition.key || null,
                        title: edition.title || "Unknown Edition Title",
                        ebook_access: edition.ebook_access || "no_access",
                        isbn: edition.isbn?.[0] || null,
                        language: edition.language?.join(", ") || "Unknown Language",
                    })),
                };
            })
        );

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
