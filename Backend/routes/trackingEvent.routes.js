import express from "express";
import {
  createTrackingEvent,
  getTrackingEventsByShipment,
  deleteTrackingEvent,
} from "../controllers/trackingEvent.controller.js";
import { protect, adminMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🔍 View tracking by shipment
router.get("/:shipmentId", protect, getTrackingEventsByShipment);

// 🔐 Admin operations
router.post("/", protect, adminMiddleware, createTrackingEvent);
router.delete("/:id", protect, adminMiddleware, deleteTrackingEvent);

export default router;
