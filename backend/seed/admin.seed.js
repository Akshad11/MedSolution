import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/User.model.js";
import Role from "../models/Role.model.js";
import { hashPassword } from "../utils/hash.js";

const seedAdmin = async () => {
    let TestStering = "";
    await mongoose.connect(process.env.MONGO_URI || TestStering);

    const adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
        console.log("Admin role not found. Seed roles first.");
        process.exit(1);
    }

    const exists = await User.findOne({ username: "admin" });
    if (exists) {
        console.log("Admin already exists");
        process.exit();
    }

    await User.create({
        name: "System Admin",
        username: "admin",
        password: await hashPassword("admin123"),
        role: adminRole._id
    });

    console.log("Admin created");
    process.exit();
};

seedAdmin();
