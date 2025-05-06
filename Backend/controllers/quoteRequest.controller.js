import QuoteRequest from "../models/quoteRequest.model.js";

/**
 * @desc Customer: Submit a quote request
 * @route POST /api/quotes
 * @access Private (Customer)
 */
export const createQuoteRequest = async (req, res) => {
  try {
    const {
      pickupLocation,
      dropLocation,
      goodsType,
      containerType,
      dimensions,
      paymentTerm,
      additionalNotes,
    } = req.body;

    // Validate required fields
    if (!pickupLocation || !dropLocation || !goodsType || !containerType || !dimensions || !paymentTerm) {
      return res.status(400).json({ success: false, message: "All required fields must be filled." });
    }

    // Create the quote request
    const quote = await QuoteRequest.create({
      user: req.user._id,
      pickupLocation,
      dropLocation,
      goodsType,
      containerType,
      dimensions,
      paymentTerm,
      additionalNotes,
    });

    res.status(201).json({ success: true, quote });
  } catch (err) {
    console.error("🔴 Create Quote Error:", err);
    res.status(500).json({ success: false, message: "Server error while creating quote." });
  }
};

/**
 * @desc Customer: Get their quote requests
 * @route GET /api/quotes/my
 * @access Private
 */
export const getMyQuotes = async (req, res) => {
  try {
    const quotes = await QuoteRequest.find({ user: req.user._id })
      .populate("pickupLocation dropLocation goodsType containerType")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, quotes });
  } catch (err) {
    console.error("🔴 My Quotes Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch your quotes." });
  }
};

/**
 * @desc Admin: Get all quote requests
 * @route GET /api/quotes
 * @access Private/Admin
 */
export const getAllQuotes = async (req, res) => {
  try {
    const quotes = await QuoteRequest.find()
      .populate("user pickupLocation dropLocation goodsType containerType")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, quotes });
  } catch (err) {
    console.error("🔴 Admin Quote Fetch Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch quotes" });
  }
};

/**
 * @desc Admin: Update quote status and price
 * @route PUT /api/quotes/:id
 * @access Private/Admin
 */
export const updateQuoteStatus = async (req, res) => {
  try {
    const { status, finalQuoteAmount } = req.body;

    // Validate status value
    if (!["Pending", "Quoted", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status provided." });
    }

    const quote = await QuoteRequest.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ success: false, message: "Quote not found." });
    }

    quote.status = status;
    quote.finalQuoteAmount = finalQuoteAmount ?? quote.finalQuoteAmount;

    await quote.save();
    res.status(200).json({ success: true, quote });
  } catch (err) {
    console.error("🔴 Quote Update Error:", err);
    res.status(500).json({ success: false, message: "Error updating quote status." });
  }
};
