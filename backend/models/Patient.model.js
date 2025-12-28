import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        dateOfBirth: {
            type: Date,
            required: true
        },

        age: {
            type: Number,
            required: true
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true
        },

        contactNumber: {
            type: String,
            required: true
        },

        alternateContactNumber: {
            type: String
        },

        email: {
            type: String,
            lowercase: true,
            trim: true,
            unique: true
        },

        location: {
            type: String,
            lowercase: true,
        },

        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", ''],
            default: ''
        },

        knownAllergies: {
            type: [String],
            default: []
        },

        notes: {
            type: String
        },

        enabled: {
            type: Boolean,
            default: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);
