import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        surname: {
            type: String,
        },

        gender: {
            type: String,
            enum: ['Male', 'Female'],
        },

        date_of_birth: {
            type: Date,
        },

        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        },

        address: {
            type: String
        },

        location: {
            type: String
        },

        phone_no: {
            type: String,
            unique: true
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            select: false
        },

        enabled: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
