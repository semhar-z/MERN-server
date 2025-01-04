import express from "express";
import SavedBook from "../models/SavedBook.js";
import axios from "axios";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/save", authMiddleware, async (req, res) => {
    const { title, author, isbn, cover, publish_year, description, ebook_access } = req.body;
  
    if (!title || !author) {
      return res.status(400).json({ success: false, message: "Title and author are required." });
    }
  
    try {
      const newBook = new SavedBook({
        userId: req.user.id,
        title,
        author,
        isbn,
        cover,
        publish_year,
        description,
        ebook_access,
      });
  
      await newBook.save();
      res.status(201).json({ success: true, data: newBook });
    } catch (error) {
      console.error("Error saving book:", error.message);
      res.status(500).json({ success: false, message: "Server Error." });
    }
  });

// Retrieve all saved books
router.get("/all", authMiddleware, async (req, res) => {
    try {
        const books = await SavedBook.find({ userId: req.user.id });
        res.status(200).json({ success: true, data: books });
    } catch (error) {
        console.error("Error fetching saved books:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Check availability of a book in nearby libraries
router.get("/availability/:isbn", async (req, res) => {
    const { isbn } = req.params;

    if (!isbn) {
        return res.status(400).json({ success: false, message: "ISBN is required." });
    }

    try {
        const worldCatUrl = `https://www.worldcat.org/isbn/${isbn}`;
        res.status(200).json({ success: true, url: worldCatUrl });
    } catch (error) {
        console.error("Error checking availability:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.delete("/delete/:isbn", async (req, res) => {
    const { isbn } = req.params;
    try {
        const deletedBook = await SavedBook.findOneAndDelete({ isbn });
        if (!deletedBook) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }
        res.status(200).json({ success: true, message: "Book deleted successfully" });
    } catch (error) {
        console.error("Error deleting book:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});


export default router;
