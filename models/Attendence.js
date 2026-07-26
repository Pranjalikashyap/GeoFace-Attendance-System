import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        date: {
            type: String,
            required: true,
        },

        time: {
            type: String,
        },

        status: {
            type: String,
            enum: ["present", "absent", "leave"], // FIX
            default: "present",
        },
    },
    { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;