import cron from "node-cron";
import { Capsule } from "../models/Capsule.js";
import { sendCapsuleEmail } from "./mailer.js";

export function startScheduler() {
  cron.schedule("* * * * *", async () => {
    try {
      await sendDueCapsulesOnce();
    } catch (err) {
      console.error("❌ Scheduler error:", err.message);
    }
  });
  console.log("🚀 Scheduler started (runs every minute)");
}

export async function sendDueCapsulesOnce() {
  const now = new Date();

  const due = await Capsule.find({
    status: "pending",
    unlockDate: { $lte: now },
  }).limit(20);

  if (due.length === 0) {
    return { checked: 0, sent: 0, failed: 0, errors: null };
  }

  console.log(`⏰ Processing ${due.length} due capsule(s)`);

  let sent = 0;
  let failed = 0;
  const errors = [];

  for (const cap of due) {
    try {
      await sendCapsuleEmail({
        to: cap.receiverEmail,
        senderName: cap.senderName,
        message: cap.message,
        wroteAt: cap.createdAt,
        unlockDate: cap.unlockDate,
      });

      cap.status = "sent";
      cap.sentAt = new Date();
      cap.errorMessage = null;
      
      await cap.save();
      sent++;
    } catch (err) {
      failed++;
      console.error(`❌ Capsule ${cap._id} failed: ${err.message}`);

      cap.errorMessage = err.message;
      cap.lastErrorAt = new Date();
      cap.errorCount = (cap.errorCount || 0) + 1;

      if (cap.errorCount >= 5) {
        cap.status = "failed";
      }

      await cap.save();
      errors.push({
        capsuleId: cap._id,
        email: cap.receiverEmail,
        error: err.message,
      });
    }
  }

  console.log(`📊 Sent: ${sent}/${due.length}, Failed: ${failed}`);

  return {
    checked: due.length,
    sent,
    failed,
    errors: errors.length > 0 ? errors : null,
  };
}
