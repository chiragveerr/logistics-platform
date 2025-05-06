import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  updateUserProfile,
} from "../controllers/user.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🔓 Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔐 Private routes
router.get("/profile", protect, getProfile);
router.post("/logout", logoutUser);
router.put("/profile", protect, updateUserProfile)

export default router;
