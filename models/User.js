import mongoose from "mongoose";
delete mongoose.models.User;

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        employeeId: {
            type: String,
            unique: true,
            required: true,
        },

        department: {
            type: String,
            required: true,
        },

        // ✅ Face Encoding save hoga yahan
        faceEncoding: {
            type: [Number],
            default: [],
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;