// app.js
import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";

import authRoutes from "../routes/auth.routes.js";
import doctorRoutes from "../routes/doctor.routes.js";
import receptionistRoutes from "../routes/receptionist.routes.js";
import patientRoutes from "../routes/patient.routes.js";
import userRoutes from "../routes/user.routes.js";
import appointmentRoutes from "../routes/appointment.routes.js";
import locationRoutes from "../routes/location.routes.js";
import statusRoutes from "../routes/status.routes.js";
import servicesRoutes from "../routes/services.routes.js";
import errorHandler from "../middlewares/error.middleware.js";
import notificationRoutes from "../routes/notification.routes.js";

const app = express();

// ✅ Middlewares
app.use(express.json());
const allowedOrigins = [
    // "http://192.168.1.34:3000",
    process.env.CLIENT_URL,
    "http://localhost:3000",
];

app.use(
    cors({
        origin: function (origin, cb) {
            if (!origin || allowedOrigins.includes(origin)) {
                cb(null, true);
            } else {
                cb(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);


// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/receptionists", receptionistRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/statuses", statusRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/notifications", notificationRoutes);

// ✅ Health check
app.get("/health", (_, res) => res.send("OK"));

// ❗ Error handler last
app.use(errorHandler);

export default app;
