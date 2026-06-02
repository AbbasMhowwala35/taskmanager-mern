import express from "express";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/categoryController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", getAllCategories);                             // public
router.post("/", protect, adminOnly, createCategory);         // admin only
router.put("/:id", protect, adminOnly, updateCategory);       // admin only
router.delete("/:id", protect, adminOnly, deleteCategory);    // admin only

export default router;