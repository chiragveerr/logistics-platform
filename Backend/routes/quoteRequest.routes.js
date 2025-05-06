import express from "express";
import {
  createQuoteRequest,
  getMyQuotes,
  getAllQuotes,
  updateQuoteStatus,
} from "../controllers/quoteRequest.controller.js";
import { protect, adminMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// 📦 Customers: Submit quote / view own quotes
router.post("/", protect, createQuoteRequest);
router.get("/my", protect, getMyQuotes);

// 🔐 Admin: Manage quotes
router.get("/", protect, adminMiddleware, getAllQuotes);
router.put("/:id", protect, adminMiddleware, updateQuoteStatus);

export default router;
