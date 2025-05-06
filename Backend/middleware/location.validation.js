import { check, validationResult } from "express-validator";


export const validateLocationCreate = [
  check("name").notEmpty().withMessage("Name is required"),
  check("type")
    .isIn(["pickup", "drop-off"])
    .withMessage("Type must be 'pickup' or 'drop-off'"),
  check("country").notEmpty().withMessage("Country is required"),
  check("city").notEmpty().withMessage("City is required"),
  check("address").notEmpty().withMessage("Address is required"),
  check("postalCode")
    .notEmpty()
    .withMessage("Postal code is required")
    .isPostalCode("any")
    .withMessage("Invalid postal code"),
  check("coordinates")
    .isArray({ min: 2, max: 2 })
    .withMessage("Coordinates must be [longitude, latitude]"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });
    next();
  },
];

export const validateLocationUpdate = [
  check("type")
    .optional()
    .isIn(["pickup", "drop-off"])
    .withMessage("Type must be 'pickup' or 'drop-off'"),
  check("postalCode")
    .optional()
    .isPostalCode("any")
    .withMessage("Invalid postal code"),
  check("coordinates")
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage("Coordinates must be [longitude, latitude]"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });
    next();
  },
];
