// routes/notification.routes.ts
import express from "express";
import {
    getMyNotifications,
    markAsRead,
    createNotification,
} from "../controllers/notification.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", protect, authorize('doctor', 'receptionist'), getMyNotifications);
router.post("/", protect, authorize('doctor', 'receptionist'), createNotification); // internal use
router.put("/:id/read", protect, authorize('doctor', 'receptionist'), markAsRead);

export default router;
