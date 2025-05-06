import GoodsType from "../models/goodsType.model.js";

/**
 * @desc Admin: Create a new goods type
 * @route POST /api/goods-types
 * @access Private (Admin)
 */
export const createGoodsType = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({ success: false, message: "Name and description are required." });
    }

    // Check if goods type already exists
    const exists = await GoodsType.findOne({ name });
    if (exists) {
      return res.status(409).json({ success: false, message: "Goods type already exists." });
    }

    // Create the goods type
    const goodsType = await GoodsType.create({ name, description });
    res.status(201).json({ success: true, goodsType });
  } catch (err) {
    console.error("🔴 Create GoodsType Error:", err);
    res.status(500).json({ success: false, message: "Failed to create goods type." });
  }
};

/**
 * @desc Public: Get all active goods types
 * @route GET /api/goods-types
 * @access Public
 */
export const getGoodsTypes = async (req, res) => {
  try {
    const types = await GoodsType.find({ status: "active" }).sort({ name: 1 });
    res.status(200).json({ success: true, types });
  } catch (err) {
    console.error("🔴 Fetch GoodsTypes Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch goods types." });
  }
};

/**
 * @desc Admin: Update goods type
 * @route PUT /api/goods-types/:id
 * @access Private (Admin)
 */
export const updateGoodsType = async (req, res) => {
  try {
    const updated = await GoodsType.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Goods type not found." });
    }

    res.status(200).json({ success: true, goodsType: updated });
  } catch (err) {
    console.error("🔴 Update GoodsType Error:", err);
    res.status(500).json({ success: false, message: "Failed to update goods type." });
  }
};

/**
 * @desc Admin: Delete goods type
 * @route DELETE /api/goods-types/:id
 * @access Private (Admin)
 */
export const deleteGoodsType = async (req, res) => {
  try {
    const deleted = await GoodsType.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Goods type not found." });

    res.status(200).json({ success: true, message: "Goods type deleted." });
  } catch (err) {
    console.error("🔴 Delete GoodsType Error:", err);
    res.status(500).json({ success: false, message: "Error deleting goods type." });
  }
};
