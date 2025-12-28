import express from "express";
import {
    createLocation,
    getLocations,
    updateLocation,
    disableLocation
} from "../controllers/location.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createLocation);
router.get("/", protect, getLocations);
router.put("/:id", protect, authorize("admin"), updateLocation);
router.delete("/:id", protect, authorize("admin"), disableLocation);

export default router;
