import mongoose from "mongoose";

const faceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        faceImage: {
            type: String,
            default: "",
        },

        faceEncoding: {
            type: [Number],
            required: true,
        },
    },
    { timestamps: true }
);

const Face = mongoose.model("Face", faceSchema);

export default Face;
