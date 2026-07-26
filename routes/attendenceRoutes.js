import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";

import Attendance from "../models/Attendence.js";
import Face from "../models/Face.js";

const router = express.Router();

/* ================= MULTER SETUP ================= */

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        const uploadPath = path.join(process.cwd(), "uploads");

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    }

});

const upload = multer({ storage });


/* ================= MARK ATTENDANCE ================= */

router.post("/mark-attendance", upload.single("image"), async (req, res) => {

    try {

        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "userId required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image required" });
        }

        const registeredFace = await Face.findOne({
            userId: new mongoose.Types.ObjectId(userId)
        });

        if (!registeredFace) {
            return res.status(404).json({ message: "User face not registered" });
        }

        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        const formattedDate = `${year}-${month}-${day}`;

        const alreadyMarked = await Attendance.findOne({
            userId,
            date: formattedDate
        });

        if (alreadyMarked) {

            return res.json({
                success: true,
                message: "Attendance already marked"
            });

        }

        await Attendance.create({

            userId,
            date: formattedDate,
            time: now.toTimeString().split(" ")[0],
            status: "present"

        });

        res.json({
            success: true,
            message: "Attendance marked successfully ✅"
        });

    } catch (err) {

        console.error("❌ Attendance Error:", err.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});


/* ================= GET STATS ================= */

router.get("/stats/:userId", async (req, res) => {

    try {

        const { userId } = req.params;

        const records = await Attendance.find({ userId });

        const present = records.filter(r => r.status === "present").length;
        const leave = records.filter(r => r.status === "leave").length;

        const now = new Date();
        const daysPassed = now.getDate();

        const absent = daysPassed - present - leave;

        res.json({
            present,
            absent,
            leave
        });

    } catch (err) {

        console.error("❌ Stats Error:", err.message);

        res.status(500).json({
            message: "Server error"
        });

    }

});


/* ================= MONTHLY DATA ================= */

router.get("/monthly/:userId", async (req, res) => {

    try {

        const { userId } = req.params;

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");

        const records = await Attendance.find({ userId });

        let present = 0;
        let leave = 0;

        records.forEach(record => {

            if (!record.date) return;

            const recordMonth = record.date.split("-")[1];
            const recordYear = record.date.split("-")[0];

            if (recordMonth === month && recordYear === String(year)) {

                if (record.status === "present") present++;

                if (record.status === "leave") leave++;

            }

        });

        const daysPassed = now.getDate();

        const absent = daysPassed - present - leave;

        res.json([
            {
                month: now.toLocaleString("default", { month: "short" }),
                present,
                absent,
                leave
            }
        ]);

    } catch (error) {

        console.log("❌ Monthly Error:", error.message);

        res.status(500).json({
            message: "Server error"
        });

    }

});

/* ================= GET ALL USER ATTENDANCE ================= */

router.get("/:userId", async (req, res) => {

    try {

        const { userId } = req.params;

        const records = await Attendance
            .find({ userId })
            .sort({ date: -1 });

        res.json(records);

    } catch (err) {

        console.error("❌ Fetch Attendance Error:", err.message);

        res.status(500).json({
            message: "Server error"
        });

    }

});

export default router;