import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        serialNo: {
            type: String,
            required: true
        },

        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient', // This assumes you have a User model defined
            required: true
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor', // This assumes you have a User model defined
            required: true
        },
        type: {
            type: String,
            enum: ['Appointment', 'Walk-in'],
        },
        date: {
            type: Date
        },
        time: {
            type: String
        },
        status: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Status',
            required: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        updatedAt: {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            datetime: {
                type: String
            },
        },
        enabled: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
