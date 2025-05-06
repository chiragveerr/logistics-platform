import mongoose from "mongoose";

/**
 * Service Schema
 * Represents all freight forwarding and logistics services provided.
 */
const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active", // Default status for new services is 'active'
    },
  },
  { timestamps: true } // Tracks the creation and update times
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
