import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as auth from "../controllers/auth-controller.js";

const router = Router();

// Rate limit: max 10 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many attempts. Try again in 15 minutes." },
});

router.post("/register", loginLimiter, auth.register);
router.post("/login", loginLimiter, auth.login);
router.get("/me", auth.me);
router.get("/verify-email/:token", auth.verifyEmail);
router.post("/logout", auth.logout);

export default router;
