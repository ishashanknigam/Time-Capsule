import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import capsuleRouter from "./routes/capsules.js";
import { startScheduler } from "./services/scheduler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/capsules", capsuleRouter);

async function start() {
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/timecapsule";
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  startScheduler();
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
