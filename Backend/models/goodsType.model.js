import mongoose from "mongoose";

/**
 * GoodsType Schema
 * Represents categories of goods (used in quotes).
 */
const goodsTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Goods type name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active", // Default status for new goods types
    },
  },
  { timestamps: true } // Tracks the creation and update time
);

const GoodsType = mongoose.model("GoodsType", goodsTypeSchema);
export default GoodsType;
