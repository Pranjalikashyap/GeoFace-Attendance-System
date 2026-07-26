import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";

import Face from "../models/Face.js";
import Attendance from "../models/Attendence.js";

const router = express.Router();

// ✅ Multer Memory Storage
const upload = multer({
    storage: multer.memoryStorage(),
});

// ---------- REGISTER FACE ----------
router.post("/register-face", upload.single("image"), async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId || !req.file) {
            return res
                .status(400)
                .json({ message: "userId and image required" });
        }

        const formData = new FormData();
        formData.append("image", req.file.buffer, "face.jpg");

        const pythonRes = await axios.post(
            "http://127.0.0.1:5001/register-face",
            formData,
            {
                headers: formData.getHeaders(),
            }
        );

        if (!pythonRes.data.encoding) {
            return res
                .status(400)
                .json({ message: "Face not detected" });
        }

        // Remove old face
        await Face.deleteMany({ userId });

        await Face.create({
            userId,
            faceEncoding: pythonRes.data.encoding,
        });

        return res.json({
            success: true,
            message: "Face registered successfully ✅",
        });

    } catch (err) {
        console.error("REGISTER FACE ERROR 👉", err.message);

        return res.status(500).json({
            message: "Face service failed",
        });
    }
});

// ---------- MATCH FACE + MARK ATTENDANCE ----------
router.post("/match-face", upload.single("image"), async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId || !req.file) {
            return res
                .status(400)
                .json({ message: "userId and image required" });
        }

        const userFace = await Face.findOne({ userId });

        if (!userFace) {
            return res.json({
                success: false,
                message: "No face registered ❌",
            });
        }

        const formData = new FormData();
        formData.append(
            "image",
            req.file.buffer,
            "face.jpg"
        );

        formData.append(
            "knownEncoding",
            JSON.stringify(userFace.faceEncoding)
        );

        const pythonRes = await axios.post(
            "http://127.0.0.1:5001/match-face",
            formData,
            {
                headers: formData.getHeaders(),
            }
        );

        console.log("Python Response:", pythonRes.data);

        if (!pythonRes.data.matched) {
            return res.json({
                success: false,
                message:
                    "Face did not match. Attendance not marked ❌",
            });
        }

        const today = new Date()
            .toISOString()
            .split("T")[0];

        const time = new Date()
            .toTimeString()
            .split(" ")[0];

        const already = await Attendance.findOne({
            userId,
            date: today,
        });

        if (already) {
            return res.json({
                success: true,
                message: "Attendance already marked ✅",
                time: already.time,
            });
        }

        await Attendance.create({
            userId,
            date: today,
            time,
            status: "present",
        });

        return res.json({
            success: true,
            message: "Attendance marked ✅",
            time,
        });

    } catch (err) {
        console.error(
            "MATCH FACE ERROR 👉",
            err.response?.data || err.message
        );

        return res.status(500).json({
            success: false,
            message: "Face match failed ❌",
        });
    }
});

export default router;




















// import express from "express";
// import multer from "multer";
// import axios from "axios";
// import fs from "fs";
// import path from "path";
// import FormData from "form-data";
// import mongoose from "mongoose";

// import Face from "../models/Face.js";
// import Attendance from "../models/Attendence.js";

// const router = express.Router();

// /* MULTER SETUP */
// const storage = multer.diskStorage({
//     destination(req, file, cb) {
//         const uploadPath = path.join(process.cwd(), "uploads");
//         if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
//         cb(null, uploadPath);
//     },
//     filename(req, file, cb) {
//         cb(null, Date.now() + "_" + file.originalname);
//     },
// });
// const upload = multer({ storage });

// /* REGISTER FACE */
// router.post("/register-face", upload.single("image"), async (req, res) => {
//     try {
//         const { userId } = req.body;
//         if (!userId || !req.file) return res.status(400).json({ message: "userId & image required" });
//         if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "Invalid userId" });

//         const formData = new FormData();
//         formData.append("image", fs.createReadStream(req.file.path));

//         const pythonRes = await axios.post("http://127.0.0.1:5001/register-face", formData, { headers: formData.getHeaders() });
//         if (!pythonRes.data.encoding) return res.status(400).json({ message: "Face not detected" });

//         await Face.deleteMany({ userId });
//         await Face.create({ userId, faceImage: req.file.path, faceEncoding: pythonRes.data.encoding });

//         res.json({ success: true, message: "Face registered ✅" });
//     } catch (err) {
//         console.error("REGISTER FACE ERROR 👉", err.message);
//         res.status(500).json({ message: err.response?.data?.error || "Face service failed" });
//     }
// });

// /* MATCH FACE & MARK ATTENDANCE */
// router.post("/match-face", upload.single("image"), async (req, res) => {
//     try {
//         const { userId } = req.body;
//         if (!userId || !req.file) return res.status(400).json({ message: "userId & image required" });
//         if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "Invalid userId" });

//         const userFace = await Face.findOne({ userId });
//         if (!userFace) return res.json({ success: false, message: "No face registered ❌" });

//         const formData = new FormData();
//         formData.append("image", fs.createReadStream(req.file.path));
//         formData.append("knownEncoding", JSON.stringify(userFace.faceEncoding));

//         const pythonRes = await axios.post("http://127.0.0.1:5001/match-face", formData, { headers: formData.getHeaders() });

//         if (!pythonRes.data.match) return res.json({ success: false, message: "Face did not match ❌" });

//         const today = new Date().toISOString().split("T")[0];
//         const time = new Date().toTimeString().split(" ")[0];

//         const already = await Attendance.findOne({ userId, date: today });
//         if (already) return res.json({ success: true, message: "Attendance already marked ✅", time: already.time });

//         await Attendance.create({ userId, date: today, time });
//         res.json({ success: true, message: "Attendance marked ✅", time });
//     } catch (err) {
//         console.error("MATCH FACE ERROR 👉", err.message);
//         res.status(500).json({ message: err.response?.data?.error || "Face match failed ❌" });
//     }
// });

// export default router;
