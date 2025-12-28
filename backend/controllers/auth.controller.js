import User from "../models/User.model.js";
import Role from "../models/Role.model.js"
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import mongoose from "mongoose";

/**
 * LOGIN
 */
export const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select("+password");

    if (!user || !user.enabled) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password.trim(), user.password);


    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const Userrole = await Role.findById(user.role).select("name");

    const token = generateToken({
        id: user._id,
        role: Userrole.name
    });

    let doctor = null;
    if (Userrole.name === "doctor") {
        const doctorId = new mongoose.Types.ObjectId(user._id);
        doctor = await mongoose.model('Doctor').findOne({ user: doctorId });
    }

    res.status(201).json({
        token,
        user: {
            id: user._id,
            name: user.name,
            role: Userrole.name,
            roleID: doctor ? doctor._id : null
        }
    });
};

/**
 * REGISTER (ADMIN ONLY)
 */
export const register = async (req, res) => {
    const { name, username, password, role } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
        name,
        username,
        password: hashedPassword,
        role
    });

    res.status(201).json({
        message: "User created",
        user: {
            id: user._id,
            name: user.name,
            role: user.role
        }
    });
};
