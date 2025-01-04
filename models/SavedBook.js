import mongoose from "mongoose";

const savedBookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String },
  cover: { type: String },
  publish_year: { type: String },
  description: { type: String },
  ebook_access: { type: String },
  savedAt: { type: Date, default: Date.now },
});

// Compound index: Unique `isbn` per `userId`
// savedBookSchema.index({ userId: 1, isbn: 1 }, { unique: true });

export default mongoose.model("SavedBook", savedBookSchema);
