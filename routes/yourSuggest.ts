import { Router } from "express";
import multer from "multer";
import {
  createYourSuggest,
  deleteYourSuggest,
  getYourSuggestById,
  getYourSuggests,
  updateYourSuggest,
} from "../controller/yourSuggestController";

const router = Router();

// Configure multer for memory storage (we'll upload to Digital Ocean)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for videos
  },
  fileFilter: (_req, file, cb) => {
    // Accept only images and videos
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"));
    }
  },
});

// All routes are public (no authentication required)
router.post("/", upload.single("media"), createYourSuggest);
router.get("/", getYourSuggests);
router.get("/:id", getYourSuggestById);
router.put("/:id", upload.single("media"), updateYourSuggest);
router.delete("/:id", deleteYourSuggest);

export default router;
