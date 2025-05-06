import Service from '../models/service.model.js';

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ status: 'active' }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      services,
      message: services.length ? 'Active services retrieved successfully.' : 'No active services found.',
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching services.',
    });
  }
};

// @desc    Create a new service
// @route   POST /api/services
// @access  Admin
export const createService = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ success: false, message: 'Name and Description are required.' });
    }

    const newService = await Service.create({ name, description });
    res.status(201).json({
      success: true,
      service: newService,
      message: 'Service created successfully.',
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating service.',
    });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Admin
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    service.name = name || service.name;
    service.description = description || service.description;
    service.status = status || service.status;

    const updatedService = await service.save();

    res.status(200).json({
      success: true,
      service: updatedService,
      message: 'Service updated successfully.',
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating service.',
    });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Admin
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting service.',
    });
  }
};
