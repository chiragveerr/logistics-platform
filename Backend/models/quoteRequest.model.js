import mongoose from "mongoose";

/**
 * QuoteRequest Schema
 * Tracks pickup/drop-off, shipment details, and admin-managed quote approval.
 */
const quoteRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickupLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    dropLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    goodsType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GoodsType",
      required: true,
    },
    containerType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContainerType",
      required: true,
    },
    dimensions: {
      length: { type: Number, required: true, min: 0 },
      width: { type: Number, required: true, min: 0 },
      height: { type: Number, required: true, min: 0 },
      weight: { type: Number, required: true, min: 0 },
    },
    paymentTerm: {
      type: String,
      enum: ["Prepaid", "Postpaid", "Third Party"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Quoted", "Rejected"],
      default: "Pending",
    },
    finalQuoteAmount: {
      type: Number,
      min: 0,
    },
    additionalNotes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } // Add timestamps for created and updated times
);

const QuoteRequest = mongoose.model("QuoteRequest", quoteRequestSchema);
export default QuoteRequest;
