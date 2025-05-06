import express from "express";
import {
  createShipment,
  getShipments,
  updateShipment,
  deleteShipment,
  getShipmentByTrackingNumber,
} from "../controllers/shipment.controller.js";
import { protect, adminMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// 📦 Public (authed)
router.get("/:trackingNumber", protect, getShipmentByTrackingNumber);
router.get("/", protect, getShipments);

// 🔐 Admin
router.post("/", protect, adminMiddleware, createShipment);
router.put("/:id", protect, adminMiddleware, updateShipment);
router.delete("/:id", protect, adminMiddleware, deleteShipment);

export default router;
