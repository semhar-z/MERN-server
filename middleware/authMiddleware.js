import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.error("No token provided in Authorization header");
    return res.status(403).json({ success: false, message: "Access denied, no token provided" });
  }

  try {
    console.log("Received token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the request
    next(); // Allow the request to continue to the next handler
    console.log("AuthMiddleware - Token:", token);
    console.log("AuthMiddleware - Decoded User:", req.user);

  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authMiddleware;
