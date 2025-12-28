import Patient from "../models/Patient.model.js";

/**
 * CREATE Patient
 * Admin / Receptionist
 */
export const createPatient = async (req, res) => {
    try {
        const {
            name,
            dateOfBirth,
            age,
            gender,
            contactNumber,
            alternateContactNumber,
            email,
            location,
            bloodGroup,
            knownAllergies,
            notes
        } = req.body;

        // Required validation
        if (!name || !dateOfBirth || !age || !gender || !contactNumber) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        const patient = await Patient.create({
            name,
            dateOfBirth,
            age,
            gender,
            contactNumber,
            alternateContactNumber,
            email,
            location,
            bloodGroup,
            knownAllergies,
            notes,
            createdBy: req.user._id
        });

        res.status(201).json({
            message: "Patient created successfully",
            patient
        });
    } catch (error) {
        console.error("Create patient error:", error);
        res.status(500).json({ message: "Failed to create patient" });
    }
};

/**
 * GET All Patients (with search)
 */
export const getPatients = async (req, res) => {
    try {
        const { search } = req.query;

        const query = { enabled: true };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { contactNumber: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { locations: { $regex: search, $options: "i" } }
            ];
        }

        const patients = await Patient.find(query)
            .populate("createdBy", "name username")
            .sort({ createdAt: -1 });

        const formattedPatients = patients.map((p) => {
            const obj = p.toObject();

            if (obj.location) {
                obj.location = capitalize(obj.location);
            }

            return obj;
        });

        res.status(200).json(formattedPatients);
    } catch (error) {
        console.error("Get patients error:", error);
        res.status(500).json({ message: "Failed to fetch patients" });
    }
};

/**
 * GET Patient by ID
 */
export const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id)
            .populate("createdBy", "name username");

        if (!patient || !patient.enabled) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json(patient);
    } catch (error) {
        console.error("Get patient error:", error);
        res.status(500).json({ message: "Failed to fetch patient" });
    }
};

/**
 * UPDATE Patient
 */
export const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;

        const updates = req.body;

        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        Object.assign(patient, updates);
        await patient.save();

        res.status(200).json({
            message: "Patient updated successfully",
            patient
        });
    } catch (error) {
        console.error("Update patient error:", error);
        res.status(500).json({ message: "Failed to update patient" });
    }
};

/**
 * SOFT DISABLE Patient
 */
export const disablePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            { enabled: false },
            { new: true }
        );

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json({
            message: "Patient disabled successfully"
        });
    } catch (error) {
        console.error("Disable patient error:", error);
        res.status(500).json({ message: "Failed to disable patient" });
    }
};

const capitalize = (str = "") =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
