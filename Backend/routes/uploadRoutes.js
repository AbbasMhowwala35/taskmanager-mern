import express from "express";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", upload.array("images", 10), (req, res) => {
  const imageUrls = req.files.map(
    (file) =>
      `${req.protocol}://${req.get("host")}/uploads/products/${file.filename}`
  );

  res.json(imageUrls);
});

export default router;