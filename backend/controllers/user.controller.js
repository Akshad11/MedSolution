import User from "../models/User.model.js";
import Doctor from "../models/Doctor.model.js";
import Role from "../models/Role.model.js";
import mongoose from "mongoose";

/**
 * GET All Users
 * Admin only
 * Supports search & role filter
 */
export const getUsers = async (req, res) => {
    try {
        const { search, role } = req.query;

        const query = { enabled: true };

        // Filter by role name
        if (role) {
            const roleDoc = await Role.findOne({ name: role });
            if (!roleDoc) {
                return res.status(400).json({ message: "Invalid role" });
            }
            query.role = roleDoc._id;
        }

        // Search by name, username, phone, location
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { surname: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } },
                { phone_no: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { enabled: true }
            ];
        }

        query.enabled = true;
        const users = await User.find(query)
            .populate("role", "name")
            .select(
                "name surname gender date_of_birth phone_no address location username enabled role createdAt"
            )
            .sort({ createdAt: -1 });

        res.status(200).json(users);
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

/**
 * GET User by ID
 */
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate("role", "name")
            .select(
                "name surname gender date_of_birth phone_no address location username enabled role createdAt"
            );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ message: "Failed to fetch user" });
    }
};

/**
 * UPDATE User (Admin only)
 */
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            surname,
            gender,
            date_of_birth,
            phone_no,
            address,
            location,
            enabled,
            email
        } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name !== undefined) user.name = name;
        if (surname !== undefined) user.surname = surname;
        if (gender !== undefined) user.gender = gender;
        if (date_of_birth !== undefined) user.date_of_birth = date_of_birth;
        if (phone_no !== undefined) user.phone_no = phone_no;
        if (address !== undefined) user.address = address;
        if (location !== undefined) user.location = location;
        if (enabled !== undefined) user.enabled = enabled;
        if (email !== undefined) user.email = email;

        await user.save();

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ message: "Failed to update user" });
    }
};

/**
 * SOFT DISABLE User
 */
export const disableUser = async (req, res) => {
    try {

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { enabled: false },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User disabled successfully" });
    } catch (error) {
        console.error("Disable user error:", error);
        res.status(500).json({ message: "Failed to disable user" });
    }
};
