import { Request, Response } from "express";
import YourOpinion from "../modal/yourOpinion";

// Create a new opinion
export const createYourOpinion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { fullname, mobile, area, comment } = req.body;

    // Validation
    if (!fullname || !mobile || !area || !comment) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields: fullname, mobile, area, and comment",
      });
      return;
    }

    // Create new opinion
    const yourOpinion = await YourOpinion.create({
      fullname,
      mobile,
      area,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Opinion created successfully",
      data: yourOpinion,
    });
  } catch (error) {
    console.error("Create opinion error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating opinion",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all opinions with pagination and search
export const getYourOpinions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const skip = (page - 1) * limit;

    // Build search query
    let query: any = {};

    if (search) {
      query = {
        $or: [
          { fullname: { $regex: search, $options: "i" } },
          { mobile: { $regex: search, $options: "i" } },
          { area: { $regex: search, $options: "i" } },
          { comment: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Get total count for pagination
    const total = await YourOpinion.countDocuments(query);

    // Get paginated results
    const yourOpinions = await YourOpinion.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: yourOpinions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get opinions error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching opinions",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get a single opinion by ID
export const getYourOpinionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const yourOpinion = await YourOpinion.findById(id);

    if (!yourOpinion) {
      res.status(404).json({
        success: false,
        message: "Opinion not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: yourOpinion,
    });
  } catch (error) {
    console.error("Get opinion error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching opinion",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update an opinion
export const updateYourOpinion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullname, mobile, area, comment } = req.body;

    const yourOpinion = await YourOpinion.findById(id);

    if (!yourOpinion) {
      res.status(404).json({
        success: false,
        message: "Opinion not found",
      });
      return;
    }

    // Update fields
    if (fullname) yourOpinion.fullname = fullname;
    if (mobile) yourOpinion.mobile = mobile;
    if (area) yourOpinion.area = area;
    if (comment) yourOpinion.comment = comment;

    await yourOpinion.save();

    res.status(200).json({
      success: true,
      message: "Opinion updated successfully",
      data: yourOpinion,
    });
  } catch (error) {
    console.error("Update opinion error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating opinion",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete an opinion
export const deleteYourOpinion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const yourOpinion = await YourOpinion.findByIdAndDelete(id);

    if (!yourOpinion) {
      res.status(404).json({
        success: false,
        message: "Opinion not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Opinion deleted successfully",
    });
  } catch (error) {
    console.error("Delete opinion error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting opinion",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
