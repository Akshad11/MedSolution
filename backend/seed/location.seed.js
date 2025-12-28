import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Location from "../models/Location.model.js";
import { locations } from "../data/locations.js";

const seedLocations = async () => {
    try {
        let TestStering = "";
        await mongoose.connect(process.env.MONGO_URI || TestStering);
        for (const loc of locations) {
            const exists = await Location.findOne({ name: loc });
            if (!exists) {
                await Location.create({ name: loc });
                console.log(`Location added: ${loc}`);
            }
        }

        console.log("✅ Location seeding completed");
        process.exit();
    } catch (error) {
        console.error("❌ Location seeding failed:", error);
        process.exit(1);
    }
};

seedLocations();
