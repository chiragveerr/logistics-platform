import mongoose from "mongoose";

/**
 * Location Schema
 * Used to represent pickup hubs & drop-off destinations globally.
 */
const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Location name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["pickup", "drop-off"],
      required: [true, "Location type must be 'pickup' or 'drop-off'"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
      trim: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, "Coordinates are required"],
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 2,
        message: "Coordinates must be an array with [longitude, latitude]",
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true } // Tracks the creation and update time
);

const Location = mongoose.model("Location", locationSchema);
export default Location;
