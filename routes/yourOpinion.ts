import { Router } from "express";
import {
  createYourOpinion,
  deleteYourOpinion,
  getYourOpinionById,
  getYourOpinions,
  updateYourOpinion,
} from "../controller/yourOpinionController";

const router = Router();

// All routes are public (no authentication required)
router.post("/", createYourOpinion);
router.get("/", getYourOpinions);
router.get("/:id", getYourOpinionById);
router.put("/:id", updateYourOpinion);
router.delete("/:id", deleteYourOpinion);

export default router;
