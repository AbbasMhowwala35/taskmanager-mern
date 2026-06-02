import express from "express";
import {
    register,
    login,
    adminLogin,
    getMe,
    forgotPassword,
    resetPassword
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/admin/login", adminLogin);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
