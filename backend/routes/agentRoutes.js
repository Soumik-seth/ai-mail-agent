import express from "express";
import { runAgent } from "../controllers/agentController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// 👇 accept file upload
router.post("/run", upload.single("resume"), runAgent);

export default router;