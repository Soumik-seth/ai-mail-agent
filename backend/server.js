import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import { startScheduler } from "./services/schedulerService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();
startScheduler(); // ✅ start cron

app.use("/api/auth", authRoutes);
app.use("/api/agent", agentRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running");
});