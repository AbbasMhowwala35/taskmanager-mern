import express from "express";
import { addProductReview, createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/productController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/products");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`
    );
  },
});

const upload = multer({
  storage
});

router.get("/", getAllProducts);                             // public
router.get("/:id", getProductById);                          // public
// router.post("/", protect, adminOnly, createProduct);        // admin only
router.post("/", upload.array("images"), createProduct);
router.post("/:id/reviews", protect, addProductReview);
router.put("/:id", protect, adminOnly, upload.array("images"), updateProduct);      // admin only
router.delete("/:id", protect, adminOnly, deleteProduct);   // admin only

export default router;
