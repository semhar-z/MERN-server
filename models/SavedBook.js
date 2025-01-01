import mongoose from "mongoose";

const savedBookSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
      },
      
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true,},
    cover: { type: String }, // URL for the book's cover image
    publish_year: {type: String},
    editions: [
      {
        key: { type: String },
        title: { type: String },
        ebook_access: { type: String },
        isbn: { type: String },
        language: { type: String },
      },
    ],
    savedAt: { type: Date, default: Date.now }, // Date when the book was saved
});

// Compound index: Unique `isbn` per `userId`
// savedBookSchema.index({ userId: 1, isbn: 1 }, { unique: true });

export default mongoose.model("SavedBook", savedBookSchema);
