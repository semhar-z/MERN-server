// routes/taskRoutes.js
import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Add a new task
router.post("/add", authMiddleware, async (req, res) => {
    const { task, dueDate } = req.body;
    if (!task || !dueDate) {
        return res.status(400).json({ success: false, message: "Task and due date are required" });
    }

    try {
        const newTask = new Task({
            userId: req.user.id,
            task,
            dueDate,
        });

        await newTask.save();
        res.status(201).json({ success: true, data: newTask });
    } catch (error) {
        console.error("Error adding task:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Get all tasks for the logged-in user
router.get("/all", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Delete a task
router.delete("/delete/:id", authMiddleware, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!deletedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

export default router;
