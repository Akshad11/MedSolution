import express from "express";
import {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    disablePatient
} from "../controllers/patient.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin", "receptionist"), createPatient);
router.get("/", protect, authorize("admin", "receptionist", "doctor"), getPatients);
router.get("/:id", protect, authorize("admin", "receptionist", "doctor"), getPatientById);
router.put("/:id", protect, authorize("admin", "receptionist", "doctor"), updatePatient);
router.delete("/:id", protect, authorize("admin", "receptionist", "doctor"), disablePatient);

export default router;
