import mongoose from "mongoose";

const appointmentLinesSchema = new mongoose.Schema(
    {
        appointmentHeader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AppointmentHeader',
            required: true
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Services',
            required: true
        },
        amount: {
            type: Number
        },
        notes: {
            type: String,
        },
        enabled: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("AppointmentLines", appointmentLinesSchema);
