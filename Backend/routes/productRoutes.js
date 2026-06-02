import express from "express";
import {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);                             // public
router.post("/", protect, adminOnly, createProduct);        // admin only
router.put("/:id", protect, adminOnly, updateProduct);      // admin only
router.delete("/:id", protect, adminOnly, deleteProduct);   // admin only

export default router;