import mongoose from "mongoose";

const CapsuleSchema = new mongoose.Schema(
  {
    senderName: { type: String, required: true, trim: true },
    receiverEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    message: { type: String, required: true },
    unlockDate: { type: Date, required: true },
    category: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    passwordHash: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    sentAt: { type: Date, default: null },
    errorMessage: { type: String, default: null },
    lastErrorAt: { type: Date, default: null },
    errorCount: { type: Number, default: 0 },
  },
  { versionKey: false }
);

CapsuleSchema.index({ status: 1, unlockDate: 1 });

export const Capsule = mongoose.model("Capsule", CapsuleSchema);
