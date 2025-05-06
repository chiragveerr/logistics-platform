import express from "express";
import {
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
} from "../controllers/location.controller.js";
import { validateLocationCreate, validateLocationUpdate } from "../middleware/location.validation.js";
import { protect, adminMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🔐 Admin - Add, Edit, Delete
router.post("/", protect, adminMiddleware, validateLocationCreate, createLocation);
router.put("/:id", protect, adminMiddleware, validateLocationUpdate, updateLocation);
router.delete("/:id", protect, adminMiddleware, deleteLocation);

// 🌍 Public - Browse
router.get("/", getLocations);
router.get("/:id", getLocationById);

export default router;
