import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import connectDB from "./db/db.js";

// 📦 Route Imports
import userRoutes from "./routes/user.routes.js";
import quoteRoutes from "./routes/quoteRequest.routes.js";
import locationRoutes from "./routes/location.routes.js";
import shipmentRoutes from "./routes/shipment.routes.js";
import trackingRoutes from "./routes/trackingEvent.routes.js";
import containerRoutes from "./routes/containerType.routes.js";
import goodsRoutes from "./routes/goodsType.routes.js";
import contactRoutes from "./routes/contactMessage.routes.js";
import serviceRoutes from "./routes/service.routes.js";

// ⚙️ Load environment variables
dotenv.config();

// 🚀 Initialize Express App
const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins = [
  'https://your-frontend.vercel.app', 
  'http://localhost:3000'
];

// 🧠 Global Middlewares
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(helmet()); // Secure HTTP headers
app.use(compression()); // Response compression
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// 🧭 API Routes
app.use("/api/users", userRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/containers", containerRoutes);
app.use("/api/goods", goodsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/services", serviceRoutes);

// Place this AFTER all your routes
app.use((err, req, res, next) => {
  console.error('🔥 Uncaught Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// 🌍 Base Health Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "🟢 ONLINE",
    message: "Logistics backend API is live 🚛💨",
    timestamp: new Date().toISOString(),
  });
});

// 💽 Connect DB & Start Server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Failed:", err);
    process.exit(1);
  });
