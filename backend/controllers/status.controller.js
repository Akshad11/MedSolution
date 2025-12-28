import Status from "../models/Status.model.js";

/**
 * CREATE Status (Admin only)
 */
export const createStatus = async (req, res) => {
    try {
        const { name, order, description } = req.body;

        if (!name || !order) {
            return res.status(400).json({
                message: "Status name and order are required"
            });
        }

        const exists = await Status.findOne({
            $or: [{ name }, { order }]
        });

        if (exists) {
            return res.status(400).json({
                message: "Status with same name or order already exists"
            });
        }

        const status = await Status.create({
            name,
            order,
            description
        });

        res.status(201).json({
            message: "Status created successfully",
            status
        });
    } catch (error) {
        console.error("Create status error:", error);
        res.status(500).json({
            message: "Failed to create status"
        });
    }
};

/**
 * GET All Statuses
 */
export const getStatuses = async (req, res) => {
    try {
        const statuses = await Status.find({ enabled: true })
            .sort({ order: 1 });

        res.status(200).json(statuses);
    } catch (error) {
        console.error("Get statuses error:", error);
        res.status(500).json({
            message: "Failed to fetch statuses"
        });
    }
};

/**
 * GET Status by ID
 */
export const getStatusById = async (req, res) => {
    try {
        const status = await Status.findById(req.params.id);

        if (!status) {
            return res.status(404).json({
                message: "Status not found"
            });
        }

        res.status(200).json(status);
    } catch (error) {
        console.error("Get status error:", error);
        res.status(500).json({
            message: "Failed to fetch status"
        });
    }
};

/**
 * UPDATE Status (Admin only)
 */
export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, order, description, enabled } = req.body;

        const status = await Status.findById(id);

        if (!status) {
            return res.status(404).json({
                message: "Status not found"
            });
        }

        if (name !== undefined) status.name = name;
        if (order !== undefined) status.order = order;
        if (description !== undefined) status.description = description;
        if (enabled !== undefined) status.enabled = enabled;

        await status.save();

        res.status(200).json({
            message: "Status updated successfully",
            status
        });
    } catch (error) {
        console.error("Update status error:", error);
        res.status(500).json({
            message: "Failed to update status"
        });
    }
};

/**
 * SOFT DISABLE Status (Admin only)
 */
export const disableStatus = async (req, res) => {
    try {
        const status = await Status.findByIdAndUpdate(
            req.params.id,
            { enabled: false },
            { new: true }
        );

        if (!status) {
            return res.status(404).json({
                message: "Status not found"
            });
        }

        res.status(200).json({
            message: "Status disabled successfully"
        });
    } catch (error) {
        console.error("Disable status error:", error);
        res.status(500).json({
            message: "Failed to disable status"
        });
    }
};
