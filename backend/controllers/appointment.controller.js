import mongoose from "mongoose";
import { Appointment, AppointmentHeader, AppointmentLines, Doctor, Services, Status } from "../models/index.model.js";
import { getNextSerial } from "../services/helper.js";

/**
 * CREATE Appointment
 * Receptionist
 */
export const createAppointment = async (req, res) => {
    try {
        const {
            patient,
            doctor,
            type,
            date,
            time,
            status
        } = req.body;

        // Required validation (serialNo removed)
        if (!patient || !doctor || !type || !date || !time || !status) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        const serialNo = await getNextSerial(type);

        const appointment = await Appointment.create({
            serialNo,
            patient,
            doctor,
            type,
            date,
            time,
            status,
            createdBy: req.user._id,
            enabled: true
        });

        // 🔔 Notify doctor
        io.to(String(doctor)).emit("new-appointment", {
            message: "New appointment assigned",
            appointmentId: appointment._id,
            serialNo: appointment.serialNo,
        });

        res.status(201).json({
            message: "Appointment created successfully",
            appointment,
        });
    } catch (error) {
        console.error("Create appointment error:", error);
        res.status(500).json({ message: "Failed to create appointment" });
    }
};

/**
 * GET All Appointments (with search)
 */
export const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.aggregate([
            // 1️⃣ Match appointments by filter
            { $match: { enabled: true } },

            // 2️⃣ Join Patient
            {
                $lookup: {
                    from: "patients",
                    localField: "patient",
                    foreignField: "_id",
                    as: "patient"
                }
            },
            { $unwind: { path: "$patient", preserveNullAndEmptyArrays: true } },

            // 3️⃣ Join Doctor
            {
                $lookup: {
                    from: "doctors",
                    localField: "doctor",
                    foreignField: "_id",
                    as: "doctor"
                }
            },
            { $unwind: { path: "$doctor", preserveNullAndEmptyArrays: true } },

            // 4️⃣ Join Status (pluralized collection name!)
            {
                $lookup: {
                    from: "status",
                    localField: "status",
                    foreignField: "_id",
                    as: "status"
                }
            },
            { $unwind: { path: "$status", preserveNullAndEmptyArrays: true } },

            // 5️⃣ Join AppointmentHeader
            {
                $lookup: {
                    from: "appointmentheaders",
                    localField: "_id",
                    foreignField: "appointment",
                    as: "header"
                }
            },
            { $unwind: { path: "$header", preserveNullAndEmptyArrays: true } },

            // 6️⃣ Join PaymentMethod inside header
            {
                $lookup: {
                    from: "paymentmethods",
                    localField: "header.paymentMethod",
                    foreignField: "_id",
                    as: "paymentMethod"
                }
            },
            { $unwind: { path: "$paymentMethod", preserveNullAndEmptyArrays: true } },

            // 7️⃣ Join AppointmentLines
            {
                $lookup: {
                    from: "appointmentlines",
                    localField: "header._id",
                    foreignField: "appointmentHeader",
                    as: "lines"
                }
            },

            // 8️⃣ Join Services for each line
            {
                $lookup: {
                    from: "services",
                    localField: "lines.service",
                    foreignField: "_id",
                    as: "services"
                }
            },

            // 9️⃣ Shape final output
            {
                $project: {
                    serialNo: 1,
                    type: 1,
                    date: 1,
                    time: 1,
                    enabled: 1,
                    createdAt: 1,

                    patient: {
                        _id: "$patient._id",
                        name: "$patient.name",
                        contactNumber: "$patient.contactNumber"
                    },

                    doctor: {
                        _id: "$doctor._id",
                        name: "$doctor.name",
                        specialization: "$doctor.specialization"
                    },

                    status: {
                        _id: "$status._id",
                        name: "$status.name",
                        order: "$status.order"
                    },

                    header: {
                        _id: "$header._id",
                        notes: "$header.notes"
                    },

                    paymentMethod: {
                        _id: "$paymentMethod._id",
                        name: "$paymentMethod.name"
                    },

                    lines: {
                        $map: {
                            input: "$lines",
                            as: "l",
                            in: {
                                _id: "$$l._id",
                                service: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$services",
                                                as: "s",
                                                cond: { $eq: ["$$s._id", "$$l.service"] }
                                            }
                                        },
                                        0
                                    ]
                                },
                                amount: "$$l.amount",
                                notes: "$$l.notes"
                            }
                        }
                    }
                }
            }
        ]);
        res.status(200).json(appointments);

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch appointments" });
    }
};

/**
 * GET Appointment by ID
 */
export const getAppointmentById = async (req, res) => {
    try {
        const id = req.params.id;
        // Main appointment
        const appointment = await Appointment.findById(id)
            .populate("patient", "name contactNumber")
            .populate("doctor", "name specialization")
            .populate("status", "name order");

        // Header
        const header = await AppointmentHeader.findOne({ appointment: id })
            .populate("paymentMethod", "name");

        // Lines
        const lines = await AppointmentLines.find({ appointmentHeader: header?._id })
            .populate("service", "name amount");

        const appointments = {
            ...appointment.toObject(),
            header,
            lines
        };

        res.status(200).json(appointments);

    } catch (error) {
        console.error("Get appointments error:", error);
        res.status(500).json({ message: "Failed to fetch appointments" });
    }
};

/**
 * UPDATE Appoitment
 */

export const UpdateAppointmentStatus = async (req, res) => {
    try {
        let { id } = req.params;
        const { status } = req.body;

        // ✅ Trim & validate appointment id
        id = id.trim();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid appointment id" });
        }

        if (!mongoose.Types.ObjectId.isValid(status)) {
            return res.status(400).json({ message: "Invalid status id" });
        }

        // 🔍 Find appointment
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // 🔍 Find status
        const statusDoc = await Status.findById(status);
        if (!statusDoc) {
            return res.status(404).json({ message: "Status not found" });
        }

        // ✅ Assign ObjectId, not full doc
        appointment.status = statusDoc._id;

        await appointment.save();

        if (statusDoc?.name === "Ready for Payment") {
            io.to("receptionist").emit("ready-for-payment", {
                message: "Appointment ready for payment",
                appointmentId: appointment._id,
                serialNo: appointment.serialNo,
                doctor: appointment.doctor.name,
            });
        }
        return res.status(200).json({
            message: "Status updated successfully",
            appointment
        });

    } catch (error) {
        console.error("Update appointment status error:", error);
        return res.status(500).json({
            message: "Failed to update appointment status"
        });
    }
}



/**
 * UPDATE Appointment
 */
export const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            serialNo,
            patient,
            doctor,
            type,
            date,
            time,
            status
        } = req.body;

        // 1️⃣ Find appointment
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        // 2️⃣ Update Appointment fields
        if (serialNo !== undefined) appointment.serialNo = serialNo;
        if (patient !== undefined) appointment.patient = patient;
        if (type !== undefined) appointment.type = type;
        if (date !== undefined) appointment.date = date;
        if (time !== undefined) appointment.time = time;
        if (status !== undefined) appointment.status = status;
        if (doctor !== undefined) appointment.doctor = doctor;

        await appointment.save();

        res.status(200).json({
            message: "Appointment updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update doctor"
        });
    }
};

/**
 * SOFT DISABLE Appointment
 */
export const disableAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { enabled: false },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json({
            message: "Appointment disabled successfully"
        });
    } catch (error) {
        console.error("Disable appointment error:", error);
        res.status(500).json({ message: "Failed to disable appointment" });
    }
};

/**
 * Appointment Header
 */

/**
 * CREATE Appointment Header
 * Doctor
 */
export const createAppointmentHeader = async (req, res) => {
    try {
        const {
            notes,
            paymentMethod,
        } = req.body;

        const appointment = req.params.id;

        const appointmentHeader = await AppointmentHeader.create({
            appointment,
            notes,
            paymentMethod,
        });

        res.status(201).json({
            message: "Appointment Header created successfully",
            appointmentHeader
        });
    } catch (error) {
        console.error("Create appointment header error:", error);
        res.status(500).json({ message: "Failed to create appointment header" });
    }
};

/**
 * Appointment Lines
 */

/**
 * CREATE Appointment Lines
 * Doctor
 */
export const createAppointmentLines = async (req, res) => {
    try {
        const {
            service,
            amount,
            note,
            doctor,
            appointmentId,
        } = req.body;

        if (!service || !amount || !doctor || !appointmentId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // ✅ Check appointment
        const appointmentExists = await Appointment.findById(appointmentId);
        if (!appointmentExists) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // ✅ Check doctor
        const doctorExists = await Doctor.findById(doctor);
        if (!doctorExists) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // ✅ Check service
        const serviceExists = await Services.findById(service);
        if (!serviceExists) {
            return res.status(404).json({ message: "Service not found" });
        }

        // ✅ Header (create if not exists)
        let appointmentHeader = await AppointmentHeader.findOne({
            appointment: appointmentId,
        });


        if (!appointmentHeader) {
            appointmentHeader = await AppointmentHeader.create({
                appointment: appointmentId,
            });
        }

        // ✅ Create line

        const appointmentLines = await AppointmentLines.create({
            appointmentHeader: appointmentHeader._id,
            service: serviceExists._id,
            amount: amount,
            notes: note,
            doctor: doctorExists._id,
        });

        res.status(201).json({
            message: "Appointment line created successfully",
            appointmentLines,
        });
    } catch (error) {
        console.error("Create appointment lines error:", error);
        res.status(500).json({ message: "Failed to create appointment lines" });
    }
};
