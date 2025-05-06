import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * Middleware to protect private routes.
 * Checks for valid JWT in cookies or Authorization headers.
 */
export const protect = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization?.startsWith("Bearer") &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("🔴 Auth Middleware Error:", err);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

/**
 * Middleware to check if user is admin.
 * Must be called after protect().
 */
export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};
