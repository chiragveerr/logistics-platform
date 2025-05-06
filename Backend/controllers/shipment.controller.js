import Shipment from "../models/shipment.model.js";
import QuoteRequest from "../models/quoteRequest.model.js"

/**
 * @desc Create a new shipment (Admin Only)
 * @route POST /api/shipments
 * @access Private (Admin)
 */
export const createShipment = async (req, res) => {
  try {
    const {
      quoteRequestId,
      pickupLocation,
      dropOffLocation,
      trackingNumber,
      containerType,
      goodsType,
      dimensions,
      estimatedDeliveryDate,
      shipmentNotes,
    } = req.body;

    // Validate required fields
    if (!quoteRequestId || !pickupLocation || !dropOffLocation || !trackingNumber) {
      return res.status(400).json({ success: false, message: "Missing required shipment fields." });
    }

    // 🔍 Fetch the original quote to get the customer user
    const quote = await QuoteRequest.findById(quoteRequestId);
    console.log(quoteRequestId);
    
    if (!quote) {
      return res.status(404).json({ success: false, message: "Quote not found." });
    }

    const shipment = await Shipment.create({
      user: quote.user, // ✅ Assign the correct customer user
      quoteRequestId,
      pickupLocation,
      dropOffLocation,
      trackingNumber,
      containerType,
      goodsType,
      dimensions,
      estimatedDeliveryDate,
      shipmentNotes,
    });

    res.status(201).json({ success: true, shipment });
  } catch (err) {
    console.error("🔴 Create Shipment Error:", err);
    res.status(500).json({ success: false, message: "Error creating shipment" });
  }
};

/**
 * @desc Get all shipments
 * @route GET /api/shipments
 * @access Private (admin: all / customer: only own)
 */
export const getShipments = async (req, res) => {
  try {
    

    const filter = req.user.role === "admin" ? {} : { user: req.user._id };

    const shipments = await Shipment.find(filter)
      .populate("pickupLocation dropOffLocation")
      .sort({ shipmentDate: -1 });

    res.status(200).json({ success: true, shipments });
  } catch (err) {
    console.error("🔴 Get Shipments Error:", err);
    res.status(500).json({ success: false, message: "Error fetching shipments" });
  }
};

/**
 * @desc Get shipment by tracking number
 * @route GET /api/shipments/:trackingNumber
 * @access Private (admin or owner only)
 */
export const getShipmentByTrackingNumber = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ trackingNumber: req.params.trackingNumber })
      .populate("pickupLocation dropOffLocation");

    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    // Check ownership or admin
    if (req.user.role !== "admin" && shipment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied: Not your shipment." });
    }

    res.status(200).json({ success: true, shipment });
  } catch (err) {
    console.error("🔴 Get Shipment by Tracking Error:", err);
    res.status(500).json({ success: false, message: "Error fetching shipment" });
  }
};

/**
 * @desc Update a shipment
 * @route PUT /api/shipments/:id
 * @access Private (Admin Only)
 */
export const updateShipment = async (req, res) => {
  try {
    const updated = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) return res.status(404).json({ success: false, message: "Shipment not found" });

    res.status(200).json({ success: true, shipment: updated });
  } catch (err) {
    console.error("🔴 Update Shipment Error:", err);
    res.status(500).json({ success: false, message: "Error updating shipment" });
  }
};

/**
 * @desc Delete a shipment
 * @route DELETE /api/shipments/:id
 * @access Private (Admin Only)
 */
export const deleteShipment = async (req, res) => {
  try {
    const deleted = await Shipment.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ success: false, message: "Shipment not found" });

    res.status(200).json({ success: true, message: "Shipment deleted" });
  } catch (err) {
    console.error("🔴 Delete Shipment Error:", err);
    res.status(500).json({ success: false, message: "Error deleting shipment" });
  }
};
