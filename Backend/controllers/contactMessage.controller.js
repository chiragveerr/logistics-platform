import ContactMessage from "../models/contactMessage.model.js";

/**
 * @desc Public: Create a new contact message
 * @route POST /api/contact
 * @access Public
 */
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Create a new contact message
    const newMessage = await ContactMessage.create({ name, email, phone, subject, message });
    res.status(201).json({ success: true, message: "Message sent successfully.", data: newMessage });
  } catch (err) {
    console.error("🔴 Create Message Error:", err);
    res.status(500).json({ success: false, message: "Server error submitting message." });
  }
};

/**
 * @desc Admin: Get all contact messages
 * @route GET /api/contact/messages
 * @access Private (Admin)
 */
export const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages });
  } catch (err) {
    console.error("🔴 Fetch Contact Messages Error:", err);
    res.status(500).json({ success: false, message: "Failed to retrieve contact messages." });
  }
};

/**
 * @desc Admin: Get a specific contact message by ID
 * @route GET /api/contact/messages/:id
 * @access Private (Admin)
 */
export const getContactMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: "Message not found." });

    res.status(200).json({ success: true, message });
  } catch (err) {
    console.error("🔴 Fetch Contact Message Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch contact message." });
  }
};

/**
 * @desc Admin: Update message status
 * @route PUT /api/contact/messages/:id
 * @access Private (Admin)
 */
export const updateContactMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "reviewed", "resolved"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Message not found." });

    res.status(200).json({ success: true, message: updated });
  } catch (err) {
    console.error("🔴 Update Message Status Error:", err);
    res.status(500).json({ success: false, message: "Failed to update message status." });
  }
};

/**
 * @desc Admin: Delete message
 * @route DELETE /api/contact/messages/:id
 * @access Private (Admin)
 */
export const deleteContactMessage = async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Message not found." });

    res.status(200).json({ success: true, message: "Contact message deleted." });
  } catch (err) {
    console.error("🔴 Delete Message Error:", err);
    res.status(500).json({ success: false, message: "Failed to delete message." });
  }
};
