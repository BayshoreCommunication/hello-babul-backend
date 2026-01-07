import { Router } from "express";
import {
  createDevelopmentIdea,
  deleteDevelopmentIdea,
  getDevelopmentIdeaById,
  getDevelopmentIdeas,
  updateDevelopmentIdea,
} from "../controller/developmentIdeaController";

const router = Router();

// All routes are public (no authentication required)
router.post("/", createDevelopmentIdea);
router.get("/", getDevelopmentIdeas);
router.get("/:id", getDevelopmentIdeaById);
router.put("/:id", updateDevelopmentIdea);
router.delete("/:id", deleteDevelopmentIdea);

export default router;
