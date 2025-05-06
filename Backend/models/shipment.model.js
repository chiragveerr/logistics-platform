import mongoose from "mongoose";

/**
 * Shipment Schema
 * Linked to an approved quote. Tracks delivery lifecycle.
 */
const shipmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // NEW: enforce ownership
    },
    quoteRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuoteRequest",
      required: [true, "Linked quote request is required"],
    },
    pickupLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: [true, "Pickup location is required"],
    },
    dropOffLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: [true, "Drop-off location is required"],
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "in-transit", "delivered"],
      default: "pending", // Default to 'pending' status
    },
    trackingNumber: {
      type: String,
      unique: true,
      required: [true, "Tracking number is required"],
    },
    shipmentDate: {
      type: Date,
      default: Date.now, // Default to current date if not provided
    },
    estimatedDeliveryDate: {
      type: Date,
    },
    actualDeliveryDate: {
      type: Date,
    },
    goodsType: {
      type: String,
      required: [true, "Goods type is required"],
    },
    containerType: {
      type: String,
      required: [true, "Container type is required"],
    },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
      weight: { type: Number },
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "pending"],
      default: "pending",
    },
    shipmentNotes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

const Shipment = mongoose.model("Shipment", shipmentSchema);
export default Shipment;
