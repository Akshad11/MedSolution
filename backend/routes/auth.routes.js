import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", protect, authorize("admin"), register);

export default router;
