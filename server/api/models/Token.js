import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    type: { type: String, enum: ["email_verify", "password_reset"], required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

tokenSchema.index({ token: 1 });
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Token", tokenSchema);
