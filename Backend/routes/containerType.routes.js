import express from "express";
import {
  createContainerType,
  getContainerTypes,
  updateContainerType,
  deleteContainerType,
} from "../controllers/containerType.controller.js";
import { protect, adminMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🧾 Public
router.get("/", getContainerTypes);

// 🔐 Admin
router.post("/", protect, adminMiddleware, createContainerType);
router.put("/:id", protect, adminMiddleware, updateContainerType);
router.delete("/:id", protect, adminMiddleware, deleteContainerType);

export default router;
