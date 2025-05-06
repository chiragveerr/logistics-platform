import express from "express";
import {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
} from "../controllers/contactMessage.controller.js";
import { protect, adminMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// 💬 Public contact form
router.post("/", createContactMessage);

// 🔐 Admin-only
router.use(protect, adminMiddleware);
router.get("/", getAllContactMessages);
router.get("/:id", getContactMessageById);
router.put("/:id/status", updateContactMessageStatus);
router.delete("/:id", deleteContactMessage);

export default router;
