import { Router } from "express";
import multer from "multer";
import {
  createVolunteer,
  deleteVolunteer,
  getVolunteerById,
  getVolunteers,
  updateVolunteer,
} from "../controller/volunteerController";

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for images
  },
  fileFilter: (_req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// All routes are public (no authentication required)
router.post("/", upload.single("media"), createVolunteer);
router.get("/", getVolunteers);
router.get("/:id", getVolunteerById);
router.put("/:id", upload.single("media"), updateVolunteer);
router.delete("/:id", deleteVolunteer);

export default router;
