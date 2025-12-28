import express from "express";
import {
    createReceptionist,
    getReceptionists,
    updateReceptionist
} from "../controllers/receptionist.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createReceptionist);
router.get("/", protect, authorize("admin"), getReceptionists);
router.put("/:id", protect, authorize("admin"), updateReceptionist);

export default router;
