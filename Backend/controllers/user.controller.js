import User from "../models/user.model.js";
import sendTokenResponse from "../utils/sendTokenResponse.js";
import bcrypt from "bcryptjs";

/**
 * @desc Register a new user (customer only)
 * @route POST /api/users/register
 * @access Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, companyName, address } = req.body;

    // Basic Required Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Name, email, and password are required.",
        });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({
          success: false,
          message: "User with this email already exists.",
        });
    }

    // If phone is present, validate it explicitly (optional field)
    if (phone && !/^\+?\d{8,15}$/.test(phone)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please enter a valid phone number.",
        });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || undefined,
      companyName: companyName?.trim(),
      address: address?.trim(),
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error("🔴 Register Error:", err);

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
      return res.status(400).json({ success: false, message });
    }

    res
      .status(500)
      .json({
        success: false,
        message: "Server error while registering user.",
      });
  }
};

/**
 * @desc Login user & return JWT
 * @route POST /api/users/login
 * @access Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    // Find the user and include password field for comparison
    const user = await User.findOne({ email }).select("+password");

    // Validate user existence and password match
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    // Send JWT token response
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error("🔴 Login Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error while logging in." });
  }
};

/**
 * @desc Get logged-in user profile
 * @route GET /api/users/profile
 * @access Private
 */
export const getProfile = async (req, res) => {
  try {
    // Check if user exists
    if (!req.user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    console.error("🔴 Profile Fetch Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching profile." });
  }
};

/**
 * @desc Update logged-in user's profile
 * @route PUT /api/users/profile
 * @access Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const updates = {
      name: req.body.name || req.user.name,
      phone: req.body.phone || req.user.phone,
      companyName: req.body.companyName || req.user.companyName,
      address: req.body.address || req.user.address,
    };

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("🔴 Update Profile Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Error updating profile." });
  }
};

/**
 * @desc Logout user (clears cookie)
 * @route POST /api/users/logout
 * @access Private
 */
export const logoutUser = (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ success: true, message: "Logged out successfully." });
};
