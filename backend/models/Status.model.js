import mongoose from "mongoose";

const statusSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            enum: [
                "Waiting",
                "Optometrist",
                "Drops",
                "Occupied",
                "Ready for Payment",
                "Completed"
            ]
        },

        order: {
            type: Number,
            required: true,
            unique: true
        },

        description: {
            type: String
        },

        enabled: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("Status", statusSchema);
