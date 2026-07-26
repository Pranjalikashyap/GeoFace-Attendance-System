const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const mongoose = require("mongoose");
const User = require("../models/User");

const router = express.Router();
const upload = multer();

/* ================= REGISTER FACE ================= */
router.post("/register-face", upload.single("image"), async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId || !req.file) {
            return res.status(400).json({ message: "userId and image required" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        const formData = new FormData();
        formData.append("image", req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const { data } = await axios.post(
            "http://127.0.0.1:5001/register-face",
            formData,
            { headers: formData.getHeaders() }
        );

        if (!data.encoding) {
            return res.status(400).json({ message: "Face not detected" });
        }

        await User.findByIdAndUpdate(userId, { faceEncoding: data.encoding });

        return res.json({ message: "Face registered successfully ✅" });
    } catch (err) {
        return res.status(400).json({
            message: err.response?.data?.error || "Face registration failed",
        });
    }
});

/* ================= MATCH FACE ================= */
router.post("/match-face", upload.single("image"), async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId || !req.file) {
            return res.status(400).json({ message: "userId and image required" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        const user = await User.findById(userId);
        if (!user || !user.faceEncoding) {
            return res.status(400).json({ message: "Face not registered" });
        }

        const formData = new FormData();
        formData.append("image", req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });
        formData.append("knownEncoding", JSON.stringify(user.faceEncoding));

        const { data } = await axios.post(
            "http://127.0.0.1:5001/match-face",
            formData,
            { headers: formData.getHeaders() }
        );

        return res.json({
            matched: data.matched,
            distance: data.distance,
        });
    } catch (err) {
        return res.status(400).json({
            message: err.response?.data?.error || "Face match failed",
        });
    }
});

module.exports = router;
