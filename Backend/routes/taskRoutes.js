import express from "express";

import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", getTasks);

router.post("/", createTask);

router.delete("/:id", deleteTask);

router.put("/:id", updateTask);

export default router;