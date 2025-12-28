import express from "express";
import {
    createService,
    getServices,
    getServiceById,
    updateService,
    disableService
} from "../controllers/services.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createService);
router.get("/", protect, getServices);
router.get("/:id", protect, getServiceById);
router.put("/:id", protect, authorize("admin"), updateService);
router.delete("/:id", protect, authorize("admin"), disableService);

export default router;
