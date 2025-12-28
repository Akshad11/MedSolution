import User from "../models/User.model.js";
import Role from "../models/Role.model.js";
import { hashPassword } from "../utils/hash.js";

/**
 * CREATE Receptionist (Admin only)
 */
export const createReceptionist = async (req, res) => {
    try {
        const {
            name,
            surname,
            gender,
            date_of_birth,
            phone_no,
            address,
            location,
            username,
            password,
            email,
        } = req.body;



        if (!name || !username || !password || !phone_no) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        const receptionistRole = await Role.findOne({ name: "receptionist", enabled: true });
        if (!receptionistRole) {
            return res.status(400).json({ message: "Receptionist role not found" });
        }

        const exists = await User.findOne({
            $or: [{ username }, { phone_no }, { email }]
        });

        if (exists) {
            return res.status(400).json({
                message: "Username, phone number, or email already exists"
            });
        }

        const hashedPassword = await hashPassword(password);

        const receptionist = await User.create({
            name,
            surname,
            gender,
            date_of_birth,
            phone_no,
            address,
            location,
            username,
            password: hashedPassword,
            role: receptionistRole._id,
            email
        });

        res.status(201).json({
            message: "Receptionist created successfully",
            receptionist: {
                id: receptionist._id,
                name: receptionist.name,
                username: receptionist.username
            }
        });

    } catch (error) {
        console.error("Create receptionist error:", error);
        res.status(500).json({ message: "Failed to create receptionist" });
    }
};

/**
 * GET All Receptionists
 */
export const getReceptionists = async (req, res) => {
    try {
        const { search } = req.query;

        // 1️⃣ Get receptionist role
        const receptionistRole = await Role.findOne({ name: "receptionist", enabled: true });

        if (!receptionistRole) {
            return res.status(400).json({ message: "Receptionist role not found" });
        }

        // 2️⃣ Build query
        const query = {
            role: receptionistRole._id,
            enabled: true
        };

        // 3️⃣ Search by name, username, phone, location
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { surname: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } },
                { phone_no: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } }
            ];
        }

        // 4️⃣ Fetch receptionists
        const receptionists = await User.find(query)
            .select(
                "name surname gender date_of_birth phone_no address email location username enabled createdAt"
            )
            .sort({ createdAt: -1 });

        res.status(200).json(receptionists);
    } catch (error) {
        console.error("Get receptionists error:", error);
        res.status(500).json({ message: "Failed to fetch receptionists" });
    }
};

/**
 * UPDATE Receptionist
 */
export const updateReceptionist = async (req, res) => {
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

        const receptionist = await User.findById(id);
        if (!receptionist) {
            return res.status(404).json({ message: "Receptionist not found" });
        }

        if (name !== undefined) receptionist.name = name;
        if (surname !== undefined) receptionist.surname = surname;
        if (gender !== undefined) receptionist.gender = gender;
        if (date_of_birth !== undefined) receptionist.date_of_birth = date_of_birth;
        if (phone_no !== undefined) receptionist.phone_no = phone_no;
        if (address !== undefined) receptionist.address = address;
        if (location !== undefined) receptionist.location = location;
        if (enabled !== undefined) receptionist.enabled = enabled;
        if (email !== undefined) receptionist.email = email;

        await receptionist.save();

        res.status(200).json({ message: "Receptionist updated successfully" });
    } catch (error) {
        console.error("Update receptionist error:", error);
        res.status(500).json({ message: "Failed to update receptionist" });
    }
};
