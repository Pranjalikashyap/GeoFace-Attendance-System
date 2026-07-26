import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import faceRoutes from "./routes/faceRoutes.js";
import attendanceRoutes from "./routes/attendenceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

/* DB */
connectDB();

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Static */
app.use("/uploads", express.static("uploads"));

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/face", faceRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/admin", adminRoutes);

/* Health */
app.get("/", (req, res) => {
    res.send("Geo Face API Running");
});

/* Server */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
