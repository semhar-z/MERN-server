import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Register a new user (sign-up)
router.post("/auth/register", async (req, res) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide all fields" });
    }
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email already registered" });
      }
    
      // Create and save new user
      const newUser = new User({
        name,
        email: email.toLowerCase(),
        password,
      });
      await newUser.save();
  
      res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      console.error("Error in user registration: ", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
  
  // Login (authenticate user and generate JWT token)
  router.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide both email and password" });
    }
  
    try {
      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      console.log("Found user:", user);
      if (!user) {
        return res.status(400).json({ success: false, message: "Invalid email or password" });
      }
  
      // Compare provided password with hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match:", isMatch);
      
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid email or password" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.status(200).json({ success: true, message: "Login successful", token });
    } catch (error) {
      console.error("Error in login: ", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
  


// Get all users entries
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true,  data: users });
  } catch (error) {
    console.log("Error in fetching users: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Protected route 
router.get("/profile", authMiddleware, async (req, res) => {
    const user = req.user.id; // `req.user` is set by authMiddleware
  
    try {
      const userData = await User.findById(user).select("-password");
      res.status(200).json({ success: true, data: userData });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });

// update profile
  router.put("/profile", authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { email },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// delete profile
router.delete("/profile", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      res.status(200).json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
      console.error("Error deleting profile:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
  }
});

  
// Get a single user 
router.get("/:id", async (req, res) => {
  const {id} = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true,  data: user });
  } catch (error) {
    console.log("Error in fetching a user: ", error.message);
    //res.status(500).json({ success: false, message: "Server Error" });
    res.status(404).json({ success: false, message: "User not found" });
  }
});

// Add a new single user to the collection
router.post("/", async (req, res) => {
  const user = req.body;
  
  if (!user.name || !user.email) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }
  
  const newUser = new User(user);
  
  try {
    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error("Error in creating user: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
  
// Update a single user entry
router.put("/:id", async(req, res) => {
  const {id} = req.params;
  const user = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid User Id" });
  }
  
  try {
    const updatedUser = await User.findByIdAndUpdate(id, user, {new:true});
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
})
  
// Delete a single user entry
router.delete("/:id", async (req, res) => {
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid User Id" });
  }

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true,  message: "User deleted"});
  } catch (error) {
    console.log("Error in deleting user: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});



export default router;