import mongoose from "mongoose";

const appointmentHeaderSchema = new mongoose.Schema(
    {
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
            required: true
        },
        notes: {
            type: String,
        },
        paymentMethod: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PaymentMethod'
        },
        enabled: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("AppointmentHeader", appointmentHeaderSchema);
