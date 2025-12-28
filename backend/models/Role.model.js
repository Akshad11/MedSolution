import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            enum: ["admin", "doctor", "receptionist"]
        },

        description: {
            type: String,
            default: ""
        },

        enabled: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("Role", roleSchema);
