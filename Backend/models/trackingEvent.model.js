import mongoose from "mongoose";

/**
 * TrackingEvent Schema
 * Used for real-time shipment tracking history.
 */
const trackingEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // NEW: enforce ownership
    },
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipment",
      required: [true, "Shipment is required"],
    },
    event: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "picked up",
        "in transit",
        "custom clearance",
        "arrived at destination",
        "out for delivery",
        "delivered",
      ],
      default: "pending",
      required: [true, "Status is required"],
    },
    eventTime: {
      type: Date,
      required: [true, "Event time is required"],
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } // Track creation and update times
);

const TrackingEvent = mongoose.model("TrackingEvent", trackingEventSchema);
export default TrackingEvent;
