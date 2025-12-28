import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true
        },

        specialization: {
            type: String,
            required: true
        },

        availability: {
            type: String,
            default: "Available"
        },

        enabled: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
