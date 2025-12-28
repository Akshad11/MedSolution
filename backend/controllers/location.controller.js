import Location from "../models/Location.model.js";

/**
 * CREATE Location (Admin only)
 */
export const createLocation = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Location name is required" });
        }

        const exists = await Location.findOne({ name: name.trim() });
        if (exists) {
            return res.status(400).json({ message: "Location already exists" });
        }

        const location = await Location.create({
            name: name.trim()
        });

        res.status(201).json({
            message: "Location created successfully",
            location
        });
    } catch (error) {
        console.error("Create location error:", error);
        res.status(500).json({ message: "Failed to create location" });
    }
};

/**
 * GET All Locations (Dropdown)
 */
export const getLocations = async (req, res) => {
    try {
        const locations = await Location.find({ enabled: true })
            .select("name enabled createdAt")
            .sort({ name: 1 });

        res.status(200).json(locations);
    } catch (error) {
        console.error("Get locations error:", error);
        res.status(500).json({ message: "Failed to fetch locations" });
    }
};

/**
 * UPDATE Location (Admin only)
 */
export const updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, enabled } = req.body;

        const location = await Location.findById(id);
        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        if (name !== undefined) location.name = name.trim();
        if (enabled !== undefined) location.enabled = enabled;

        await location.save();

        res.status(200).json({
            message: "Location updated successfully",
            location
        });
    } catch (error) {
        console.error("Update location error:", error);
        res.status(500).json({ message: "Failed to update location" });
    }
};

/**
 * SOFT DISABLE Location (Admin only)
 */
export const disableLocation = async (req, res) => {
    try {
        const location = await Location.findByIdAndUpdate(
            req.params.id,
            { enabled: false },
            { new: true }
        );

        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        res.status(200).json({
            message: "Location disabled successfully"
        });
    } catch (error) {
        console.error("Disable location error:", error);
        res.status(500).json({ message: "Failed to disable location" });
    }
};
