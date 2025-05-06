import mongoose from "mongoose";

/**
 * ContactMessage Schema
 * Stores inquiries from customers.
 */
const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sender name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      match: [/.+\@.+\..+/, "Please enter a valid email address"], // Email validation
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
    },
    message: {
      type: String,
      required: [true, "Message body is required"],
      minlength: [10, "Message must be at least 10 characters long"], // Minimum length for message
    },
    status: {
      type: String,
      default: "pending", // Default status
    },
  },
  { timestamps: true } // Automatically track creation and update times
);

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);
export default ContactMessage;
