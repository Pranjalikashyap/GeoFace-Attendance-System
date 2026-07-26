import express from "express";
import {
    getStats,
    getAllUsers,
    deleteUser,
    blockUser,
} from "../controllers/adminController.js";

const router = express.Router();

// Dashboard Stats
router.get("/stats", getStats);

// All Employees
router.get("/users", getAllUsers);

// Delete Employee
router.delete("/user/:id", deleteUser);

// Block Employee
router.put("/block/:id", blockUser);

export default router;