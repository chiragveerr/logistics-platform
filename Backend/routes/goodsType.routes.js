import express from "express";
import {
  createGoodsType,
  getGoodsTypes,
  updateGoodsType,
  deleteGoodsType,
} from "../controllers/goodsType.controller.js";
import { protect, adminMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getGoodsTypes); // open for dropdowns
router.post("/", protect, adminMiddleware, createGoodsType);
router.put("/:id", protect, adminMiddleware, updateGoodsType);
router.delete("/:id", protect, adminMiddleware, deleteGoodsType);

export default router;
