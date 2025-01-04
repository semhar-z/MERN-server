import express from "express";
import dotenv from "dotenv";
import db from "./db/conn.js";
import path from 'path'; 
import { fileURLToPath } from 'url';
import cors from "cors";
import userRoutes from "./routes/userRoute.js";
import rootRoutes from "./routes/root.js";
import books from "./routes/books.js"
import savedBooksRouter from "./routes/savedBooks.js";
import taskRoutes from "./routes/taskRoutes.js";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
    // origin: "http://localhost:5173", // Replace with your frontend URL
    origin: "https://mern-client-dmny.onrender.com", // Your frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies or authorization headers
};
app.use(cors(corsOptions));
  
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/', express.static(path.join(__dirname, '/public')))

// Routes
app.use('/', rootRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", books)
app.use("/api/savedBooks", savedBooksRouter);
app.use("/api/users/tasks", taskRoutes);

// 404 Handler
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')){
        res.json({message: '404 Not Found'})
    } else {
        res.type('txt').send('404 Not Found')
    }
})

// Start Server
app.listen(PORT, () => {
    db();
    console.log(`Server is running on port: ${PORT}`);
  });