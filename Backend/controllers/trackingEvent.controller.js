import TrackingEvent from "../models/trackingEvent.model.js";
import Shipment from "../models/shipment.model.js";

/**
 * @desc Create a tracking event
 * @route POST /api/tracking
 * @access Private (Admin)
 */
export const createTrackingEvent = async (req, res) => {
  try {
    const { shipment, event, eventTime, location, status, remarks } = req.body;

    if (!shipment || !event || !eventTime || !location || !status) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const validStatuses = [
      "pending",
      "picked up",
      "in transit",
      "custom clearance",
      "arrived at destination",
      "out for delivery",
      "delivered"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status: ${status}` });
    }

    const trackingEvent = new TrackingEvent({
      user: req.user._id, // Link to the user who created it
      shipment,
      event,
      eventTime,
      location,
      status,
      remarks,
    });

    await trackingEvent.save();

    res.status(201).json({ message: "Tracking event created successfully", trackingEvent });
  } catch (error) {
    console.error("Error creating tracking event:", error);
    res.status(500).json({ message: "Error creating tracking event" });
  }
};

/**
 * @desc Get tracking events for a shipment
 * @route GET /api/tracking/:shipmentId
 * @access Private (Admin or Owner)
 */
export const getTrackingEventsByShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.shipmentId);

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    if (req.user.role !== "admin" && shipment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied: You can only track your own shipments." });
    }

    const events = await TrackingEvent.find({ shipment: shipment._id }).sort({ eventTime: 1 });

    res.status(200).json({ success: true, events });
  } catch (err) {
    console.error("Error fetching tracking events:", err);
    res.status(500).json({ message: "Error fetching tracking history" });
  }
};

/**
 * @desc Delete a tracking event
 * @route DELETE /api/tracking/:id
 * @access Private (Admin)
 */
export const deleteTrackingEvent = async (req, res) => {
  try {
    const deleted = await TrackingEvent.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Event not found" });

    res.status(200).json({ success: true, message: "Tracking event deleted." });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Error deleting event" });
  }
};
