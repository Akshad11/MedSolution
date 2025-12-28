import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Role from "../models/Role.model.js";

const roles = [
    { name: "admin", description: "System administrator" },
    { name: "doctor", description: "Doctor user" },
    { name: "receptionist", description: "Reception desk user" }
];

const seedRoles = async () => {
    let TestStering = "";
    await mongoose.connect(process.env.MONGO_URI || TestStering);
    for (const role of roles) {
        const exists = await Role.findOne({ name: role.name });
        if (!exists) {
            await Role.create(role);
            console.log(`Role created: ${role.name}`);
        }
    }

    console.log("Roles seeded");
    process.exit();
};

seedRoles();
