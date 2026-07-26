import User from "../models/User.js";
import Attendance from "../models/Attendence.js";
import Face from "../models/Face.js";

/* ================= DASHBOARD STATS ================= */

export const getStats = async (req, res) => {
    try {
        const total = await User.countDocuments();

        const today = new Date().toISOString().split("T")[0];

        const present = await Attendance.countDocuments({
            date: today,
            status: "present",
        });

        const absent = total - present;

        res.json({
            success: true,
            total,
            present,
            absent,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/* ================= GET ALL USERS ================= */

export const getAllUsers = async (req, res) => {
    try {

        const users = await User.find().select("-password");

        res.json({
            success: true,
            users,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/* ================= DELETE USER ================= */

export const deleteUser = async (req, res) => {
    try {

        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Delete User
        await User.findByIdAndDelete(userId);

        // Delete Face Data
        await Face.deleteMany({
            userId,
        });

        // Delete Attendance Data
        await Attendance.deleteMany({
            userId,
        });

        res.json({
            success: true,
            message: "User, Face and Attendance deleted successfully",
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/* ================= BLOCK / UNBLOCK USER ================= */

export const blockUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.isActive = !user.isActive;

        await user.save();

        res.json({
            success: true,
            message: user.isActive
                ? "User Unblocked Successfully"
                : "User Blocked Successfully",
            isActive: user.isActive,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};