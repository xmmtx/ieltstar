import { Router } from "express";
import * as review from "../controllers/review-controller.js";

const router = Router();
router.get("/writing", review.getWritingSubmissions);
router.put("/writing/score", review.scoreWriting);

export default router;
