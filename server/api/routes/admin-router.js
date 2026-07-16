import { Router } from "express";
import * as admin from "../controllers/admin-controller.js";

const router = Router();
router.get("/users", admin.getUsers);
router.put("/users/:id", admin.updateUser);
router.delete("/users/:id", admin.deleteUser);
router.get("/roles", admin.getRoles);
router.post("/roles", admin.createRole);
router.put("/roles/:id", admin.updateRole);
router.delete("/roles/:id", admin.deleteRole);
router.get("/settings", admin.getSettings);
router.put("/settings", admin.updateSettings);

export default router;
