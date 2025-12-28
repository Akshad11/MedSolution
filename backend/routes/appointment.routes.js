import express from "express";
import {
    createAppointment, getAppointments, getAppointmentById, updateAppointment, disableAppointment,
    createAppointmentHeader, createAppointmentLines,
    UpdateAppointmentStatus,
} from "../controllers/appointment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, createAppointment);

//router.put("/unavailable/:id/status", protect, updateDoctor);
router.get("/", protect, authorize("admin", "receptionist", "doctor"), getAppointments);
router.get("/:id", protect, authorize("admin", "receptionist", "doctor"), getAppointmentById);
router.put("/:id", protect, authorize("admin", "receptionist", "doctor"), updateAppointment);
router.put("/status/:id", protect, authorize("admin", "receptionist", "doctor"), UpdateAppointmentStatus);
router.delete("/:id", protect, authorize("admin", "receptionist", "doctor"), disableAppointment);

router.post("/:id/header", protect, authorize("admin", "receptionist", "doctor"), createAppointmentHeader);
router.post("/lines", protect, authorize("admin", "receptionist", "doctor"), createAppointmentLines);

export default router;
