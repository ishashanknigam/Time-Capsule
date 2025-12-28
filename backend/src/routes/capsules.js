import { Router } from "express";
import { Capsule } from "../models/Capsule.js";
import { sendDueCapsulesOnce } from "../services/scheduler.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      senderName,
      receiverEmail,
      message,
      unlockDate,
      password,
      category,
    } = req.body;

    if (!senderName || !receiverEmail || !message || !unlockDate)
      return res.status(400).json({ error: "Missing required fields" });

    const unlock = new Date(unlockDate);
    if (isNaN(unlock.getTime()))
      return res.status(400).json({ error: "Invalid unlock date" });

    let passwordHash = null;
    if (password) {
      // Simple hash for demo (not cryptographically secure). Replace with bcrypt in production.
      passwordHash = Buffer.from(password).toString("base64");
    }

    const doc = await Capsule.create({
      senderName,
      receiverEmail,
      message,
      unlockDate: unlock,
      passwordHash,
      category: category || null,
    });

    res.json({ message: "Saved", capsule: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const list = await Capsule.find({}).sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/trigger-send", async (req, res) => {
  try {
    const result = await sendDueCapsulesOnce();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
