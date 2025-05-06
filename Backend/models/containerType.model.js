import mongoose from "mongoose";

/**
 * ContainerType Schema
 * Based on actual freight container specifications.
 */
const containerTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Container name is required"],
      unique: true, // Ensure container name is unique
    },
    description: {
      type: String,
      required: [true, "Container description is required"],
    },
    dimensions: {
      insideLength: { type: Number, required: true, min: 1 }, // meters
      insideWidth: { type: Number, required: true },
      insideHeight: { type: Number, required: true },
      doorWidth: { type: Number, required: true },
      doorHeight: { type: Number, required: true },
      cbmCapacity: { type: Number, required: true }, // cubic meters
    },
    tareWeight: {
      type: Number,
      required: true, // in kg
    },
    maxCargoWeight: {
      type: Number,
      required: true, // in kg
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active", // Default value for status is active
    },
  },
  { timestamps: true } // Include timestamps for when the container is created or updated
);

const ContainerType = mongoose.model("ContainerType", containerTypeSchema);
export default ContainerType;
