import { Router } from "express";
import * as auth from "../controllers/auth-controller.js";

const router = Router();
router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/me", auth.me);
router.get("/verify-email/:token", auth.verifyEmail);
router.post("/logout", auth.logout);

export default router;
