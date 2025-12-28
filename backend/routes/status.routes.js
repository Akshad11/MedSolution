import express from "express";
import {
    createStatus,
    getStatuses,
    getStatusById,
    updateStatus,
    disableStatus
} from "../controllers/status.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

// Public for dropdown (but still protected)
router.get("/", protect, getStatuses);
router.get("/:id", protect, getStatusById);

// Admin only
router.post("/", protect, authorize("admin"), createStatus);
router.put("/:id", protect, authorize("admin"), updateStatus);
router.delete("/:id", protect, authorize("admin"), disableStatus);

export default router;
