import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Status from "../models/Status.model.js";

const statuses = [
    { name: "Waiting", order: 1, description: "Patient waiting" },
    { name: "Optometrist", order: 2, description: "Initial eye check" },
    { name: "Occupied", order: 3, description: "Doctor consultation" },
    { name: "Ready for Payment", order: 4, description: "Billing pending" },
    { name: "Completed", order: 5, description: "Appointment completed" }
];

const seedStatuses = async () => {
    let TestStering = "";
    await mongoose.connect(process.env.MONGO_URI || TestStering);
    for (const status of statuses) {
        const exists = await Status.findOne({ name: status.name });
        if (!exists) {
            await Status.create(status);
            console.log(`Status created: ${status.name}`);
        }
    }

    console.log("Status seeding completed");
    process.exit();
};

seedStatuses();
