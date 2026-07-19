import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import Role from "../models/Role.js";
import Token from "../models/Token.js";

// Shared with admin-controller
let sessionTimeoutMinutes = 60;
export const getSessionTimeout = () => sessionTimeoutMinutes;
export const setSessionTimeout = (v) => { sessionTimeoutMinutes = v; };

// ============ Register ============
export const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: "Email, password, and name required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const studentRole = await Role.findOne({ name: "student" });

    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      fullName,
      role: studentRole?._id || null,
    });

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    await Token.create({
      userId: user._id,
      token,
      type: "email_verify",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    res.status(201).json({
      message: "Registered. Please verify your email.",
      userId: user._id,
      verificationToken: token, // In production, send via email
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ============ Login ============
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() }).populate("role");
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    if (!user.isActive) return res.status(403).json({ error: "Account disabled" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    // Generate session token with configurable timeout
    const timeout = sessionTimeoutMinutes || 60;
    const sessionToken = crypto.randomBytes(48).toString("hex");
    await Token.create({
      userId: user._id,
      token: sessionToken,
      type: "password_reset",
      expiresAt: new Date(Date.now() + timeout * 60 * 1000),
    });

    const permissions = user.role?.permissions || [];
    const roleName = user.role?.name || "student";

    res.json({
      token: sessionToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: roleName,
        isAdmin: permissions.includes("admin.all"),
        emailVerified: !!user.emailVerifiedAt,
        permissions,
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ============ Verify Email ============
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const tokenDoc = await Token.findOne({ token, type: "email_verify" });
    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    await User.findByIdAndUpdate(tokenDoc.userId, { emailVerifiedAt: new Date() });
    await Token.deleteOne({ _id: tokenDoc._id });

    res.json({ message: "Email verified successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ============ Logout ============
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token) await Token.deleteOne({ token });
    res.json({ message: "Logged out" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
export const me = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const tokenDoc = await Token.findOne({ token });
    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      return res.status(401).json({ error: "Session expired" });
    }

    const user = await User.findById(tokenDoc.userId).populate("role");
    if (!user) return res.status(404).json({ error: "User not found" });

    const permissions = user.role?.permissions || [];

    res.json({
      id: user._id, email: user.email, fullName: user.fullName,
      role: user.role?.name || "student",
      isAdmin: permissions.includes("admin.all"),
      emailVerified: !!user.emailVerifiedAt, permissions,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ============ Forgot Password ============
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    // Always return success to prevent email enumeration
    if (!user) return res.json({ message: "If the email exists, a reset link has been sent." });

    // Invalidate any existing reset tokens for this user
    await Token.deleteMany({ userId: user._id, type: "password_reset" });

    const token = crypto.randomBytes(32).toString("hex");
    await Token.create({
      userId: user._id,
      token,
      type: "password_reset",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    // In production, send email with reset link
    // const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    // await sendEmail(user.email, "Password Reset", `Reset link: ${resetUrl}`);

    res.json({
      message: "If the email exists, a reset link has been sent.",
      resetToken: token, // For dev/demo: include token in response
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ============ Reset Password ============
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: "Token and new password required" });
    if (newPassword.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });

    const tokenDoc = await Token.findOne({ token, type: "password_reset" });
    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(tokenDoc.userId, { passwordHash });
    await Token.deleteOne({ _id: tokenDoc._id });

    res.json({ message: "Password reset successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ============ Resend verification email ============
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.emailVerifiedAt) return res.status(400).json({ error: "Already verified" });

    await Token.deleteMany({ userId: user._id, type: "email_verify" });
    const token = crypto.randomBytes(32).toString("hex");
    await Token.create({
      userId: user._id, token, type: "email_verify",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    res.json({ message: "Verification email sent", verificationToken: token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
