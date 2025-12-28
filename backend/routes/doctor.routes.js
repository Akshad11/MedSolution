import express from "express";
import { createDoctor, getDoctors, updateDoctor } from "../controllers/doctor.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createDoctor);
router.put("/:id", protect, updateDoctor);
router.put("/unavailable/:id/status", protect, updateDoctor);
router.get("/", protect, getDoctors);

export default router;
