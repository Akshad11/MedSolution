import Services from "../models/Services.model.js";
import Doctor from "../models/Doctor.model.js";
import mongoose from "mongoose";

/**
 * CREATE Service (Admin only)
 */
export const createService = async (req, res) => {
    try {
        const { name, doctor, amount } = req.body;

        if (!name || !doctor) {
            return res.status(400).json({
                message: "Service name and doctor are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(doctor)) {
            return res.status(400).json({ message: "Invalid doctor id" });
        }

        const doctorDoc = await Doctor.findById(doctor);
        if (!doctorDoc) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const exists = await Services.findOne({ name });
        if (exists) {
            return res.status(400).json({ message: "Service already exists" });
        }

        const service = await Services.create({
            name,
            doctor,
            amount
        });

        res.status(201).json({
            message: "Service created successfully",
            service
        });
    } catch (error) {
        console.error("Create service error:", error);
        res.status(500).json({
            message: "Failed to create service"
        });
    }
};

/**
 * GET All Services (with search & doctor filter)
 */
export const getServices = async (req, res) => {
    try {
        const { search, doctor } = req.query;

        const query = { enabled: true };

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (doctor && mongoose.Types.ObjectId.isValid(doctor)) {
            query.doctor = doctor;
        }

        const services = await Services.find(query)
            .populate({
                path: "doctor",
                select: "name specialization"
            })
            .sort({ createdAt: -1 });

        res.status(200).json(services);
    } catch (error) {
        console.error("Get services error:", error);
        res.status(500).json({
            message: "Failed to fetch services"
        });
    }
};

/**
 * GET Service by ID
 */
export const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid service id" });
        }

        const service = await Services.findById(id)
            .populate({
                path: "doctor",
                select: "name specialization"
            });

        if (!service || !service.enabled) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json(service);
    } catch (error) {
        console.error("Get service error:", error);
        res.status(500).json({
            message: "Failed to fetch service"
        });
    }
};

/**
 * UPDATE Service (Admin only)
 */
export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, doctor, amount, enabled } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid service id" });
        }

        const service = await Services.findById(id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        if (name !== undefined) service.name = name;
        if (amount !== undefined) service.amount = amount;
        if (enabled !== undefined) service.enabled = enabled;

        if (doctor !== undefined) {
            if (!mongoose.Types.ObjectId.isValid(doctor)) {
                return res.status(400).json({ message: "Invalid doctor id" });
            }
            const doctorDoc = await Doctor.findById(doctor);
            if (!doctorDoc) {
                return res.status(404).json({ message: "Doctor not found" });
            }
            service.doctor = doctor;
        }

        await service.save();

        res.status(200).json({
            message: "Service updated successfully",
            service
        });
    } catch (error) {
        console.error("Update service error:", error);
        res.status(500).json({
            message: "Failed to update service"
        });
    }
};

/**
 * SOFT DISABLE Service (Admin only)
 */
export const disableService = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid service id" });
        }

        const service = await Services.findByIdAndUpdate(
            id,
            { enabled: false },
            { new: true }
        );

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json({
            message: "Service disabled successfully"
        });
    } catch (error) {
        console.error("Disable service error:", error);
        res.status(500).json({
            message: "Failed to disable service"
        });
    }
};
