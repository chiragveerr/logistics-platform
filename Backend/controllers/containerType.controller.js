import ContainerType from "../models/containerType.model.js";

/**
 * @desc Admin: Create container type
 * @route POST /api/container-types
 * @access Private (Admin)
 */
export const createContainerType = async (req, res) => {
  try {
    const { name, description, dimensions, tareWeight, maxCargoWeight } = req.body;

    // Validate required fields
    if (!name || !description || !dimensions || !tareWeight || !maxCargoWeight) {
      return res.status(400).json({ success: false, message: "All container fields are required." });
    }

    // Check if container type already exists
    const exists = await ContainerType.findOne({ name });
    if (exists) {
      return res.status(409).json({ success: false, message: "Container type already exists." });
    }

    // Create the container type
    const container = await ContainerType.create({
      name,
      description,
      dimensions,
      tareWeight,
      maxCargoWeight,
    });

    res.status(201).json({ success: true, container });
  } catch (err) {
    console.error("🟥 Container Create Error:", err);
    res.status(500).json({ success: false, message: "Failed to create container type." });
  }
};

/**
 * @desc Public or Admin: Get container types
 * @route GET /api/container-types
 * @access Public (Admin can use ?showAll=true to see all)
 */
export const getContainerTypes = async (req, res) => {
  try {
    const showAll = req.query.showAll === "true"; // check if admin wants all containers
    const filter = showAll ? {} : { status: "active" }; // if not, show only active
    const types = await ContainerType.find(filter).sort({ name: 1 });
    res.status(200).json({ success: true, types });
  } catch (err) {
    console.error("🟥 Fetch Container Types Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch container types." });
  }
};


/**
 * @desc Admin: Update container type
 * @route PUT /api/container-types/:id
 * @access Private (Admin)
 */
export const updateContainerType = async (req, res) => {
  try {
    const container = await ContainerType.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!container) return res.status(404).json({ success: false, message: "Container type not found." });

    res.status(200).json({ success: true, container });
  } catch (err) {
    console.error("🟥 Update Container Type Error:", err);
    res.status(500).json({ success: false, message: "Failed to update container type." });
  }
};

/**
 * @desc Admin: Delete container type
 * @route DELETE /api/container-types/:id
 * @access Private (Admin)
 */
export const deleteContainerType = async (req, res) => {
  try {
    const container = await ContainerType.findByIdAndDelete(req.params.id);
    if (!container) return res.status(404).json({ success: false, message: "Container type not found." });

    res.status(200).json({ success: true, message: "Container type deleted." });
  } catch (err) {
    console.error("🟥 Delete Container Type Error:", err);
    res.status(500).json({ success: false, message: "Error deleting container type." });
  }
};
