import express from "express";
import {
  createService,
  getAllServices,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";
import { protect, adminMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// 📦 Public services
router.get("/", getAllServices);

// 🔐 Admin-only
router.post("/", protect, adminMiddleware, createService);
router.put("/:id", protect, adminMiddleware, updateService);
router.delete("/:id", protect, adminMiddleware, deleteService);

export default router;
