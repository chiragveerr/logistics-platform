import Location from "../models/location.model.js";

/**
 * @desc Admin: Add new location (pickup or drop-off)
 * @route POST /api/locations
 * @access Private (Admin)
 */
export const createLocation = async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json({ success: true, location });
  } catch (err) {
    console.error("🔴 Create Location Error:", err);
    res.status(500).json({ success: false, message: "Server error creating location" });
  }
};

/**
 * @desc Public: Get all locations
 * @route GET /api/locations
 * @access Public
 */
export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, locations });
  } catch (err) {
    console.error("🔴 Fetch Locations Error:", err);
    res.status(500).json({ success: false, message: "Server error fetching locations" });
  }
};

/**
 * @desc Public: Get single location by ID
 * @route GET /api/locations/:id
 * @access Public
 */
export const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ success: false, message: "Location not found" });
    }

    res.status(200).json({ success: true, location });
  } catch (err) {
    console.error("🔴 Fetch Location Error:", err);
    res.status(500).json({ success: false, message: "Error fetching location" });
  }
};

/**
 * @desc Admin: Update location by ID
 * @route PUT /api/locations/:id
 * @access Private (Admin)
 */
export const updateLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!location) {
      return res.status(404).json({ success: false, message: "Location not found" });
    }

    res.status(200).json({ success: true, location });
  } catch (err) {
    console.error("🔴 Update Location Error:", err);
    res.status(500).json({ success: false, message: "Error updating location" });
  }
};

/**
 * @desc Admin: Delete location
 * @route DELETE /api/locations/:id
 * @access Private (Admin)
 */
export const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ success: false, message: "Location not found" });
    }

    res.status(200).json({ success: true, message: "Location deleted" });
  } catch (err) {
    console.error("🔴 Delete Location Error:", err);
    res.status(500).json({ success: false, message: "Error deleting location" });
  }
};
