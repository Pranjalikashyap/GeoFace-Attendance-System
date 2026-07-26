import User from "../models/User.js";
import Face from "../models/Face.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ================= REGISTER ================= */

export const register = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            employeeId,
            department,
        } = req.body;

        if (
            !fullName ||
            !email ||
            !password ||
            !employeeId ||
            !department
        ) {
            return res.status(400).json({
                message: "All fields required",
            });
        }

        const exists = await User.findOne({ email });

        if (exists) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            employeeId,
            department,
        });

        return res.status(201).json({
            success: true,
            message: "Registered successfully",
            userId: user._id,
        });

    } catch (err) {

        console.error("REGISTER ERROR 👉", err);

        return res.status(500).json({
            success: false,
            message: err.message || "Registration failed",
        });
    }
};


/* ================= LOGIN ================= */

export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields required",
            });
        }

        /* ================= ADMIN LOGIN ================= */

        if (
            email === "admin@gmail.com" &&
            password === "admin123"
        ) {

            const token = jwt.sign(
                { role: "admin" },
                process.env.JWT_SECRET || "mysecretkey",
                {
                    expiresIn: "1d",
                }
            );

            return res.json({
                success: true,
                message: "Admin Login Successful",
                role: "admin",
                token,
            });
        }

        /* ================= EMPLOYEE LOGIN ================= */

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        // ✅ Blocked User Check
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been blocked by Admin.",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        // ✅ Check Face Registration
        const face = await Face.findOne({
            userId: user._id,
        });

        const token = jwt.sign(
            {
                id: user._id,
                role: "employee",
            },
            process.env.JWT_SECRET || "mysecretkey",
            {
                expiresIn: "1d",
            }
        );

        return res.json({
            success: true,
            message: "Login successful",
            role: "employee",
            token,

            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                employeeId: user.employeeId,
                department: user.department,
                isActive: user.isActive,
                faceRegistered: !!face,
            },
        });

    } catch (err) {

        console.error("LOGIN ERROR 👉", err);

        return res.status(500).json({
            success: false,
            message: err.message || "Login failed",
        });
    }
};