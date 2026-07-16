import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    emailVerifiedAt: { type: Date, default: null },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

userSchema.index({ email: 1 });

export default mongoose.model("User", userSchema);
