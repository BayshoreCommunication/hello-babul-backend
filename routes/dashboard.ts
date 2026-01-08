import { Router } from "express";
import {
  deleteData,
  getAllData,
  getDashboardOverview,
  getDetailsByIdAndType,
  markAsViewed,
} from "../controller/dashboardController";

const router = Router();

// All dashboard routes are public (no authentication required)

// 1. Dashboard overview - Get total counts
router.get("/overview", getDashboardOverview);

// 2. Get all data with pagination and search
// Query params: page, limit, search, type (optional: volunteer, opinion, suggestion, developmentIdea)
router.get("/all-data", getAllData);

// 3. Get details by ID and type
// Query params: type (required: volunteer, opinion, suggestion, developmentIdea)
router.get("/details/:id", getDetailsByIdAndType);

// 4. Mark data as viewed
// Body: { type: "volunteer" | "opinion" | "suggestion" | "developmentIdea" }
router.patch("/mark-viewed/:id", markAsViewed);

// 5. Delete data by ID and type
// Body: { type: "volunteer" | "opinion" | "suggestion" | "developmentIdea" }
router.delete("/delete/:id", deleteData);

export default router;

