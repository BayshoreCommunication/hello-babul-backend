import { Request, Response } from "express";
import DevelopmentIdea from "../modal/developmentIdea";
import { AuthRequest } from "../middleware/auth";

// Create a new development idea
export const createDevelopmentIdea = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { fullname, mobile, area, comment, typeOfIdea } = req.body;

    // Validation
    if (!fullname || !mobile || !area || !comment || !typeOfIdea) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields: fullname, mobile, area, comment, and typeOfIdea",
      });
      return;
    }

    // Create new development idea
    const developmentIdea = await DevelopmentIdea.create({
      fullname,
      mobile,
      area,
      comment,
      typeOfIdea,
    });

    res.status(201).json({
      success: true,
      message: "Development idea created successfully",
      data: developmentIdea,
    });
  } catch (error) {
    console.error("Create development idea error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating development idea",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all development ideas with pagination and search
export const getDevelopmentIdeas = async (
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
          { typeOfIdea: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Get total count for pagination
    const total = await DevelopmentIdea.countDocuments(query);

    // Get paginated results
    const developmentIdeas = await DevelopmentIdea.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: developmentIdeas,
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
    console.error("Get development ideas error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching development ideas",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get a single development idea by ID
export const getDevelopmentIdeaById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const developmentIdea = await DevelopmentIdea.findById(id);

    if (!developmentIdea) {
      res.status(404).json({
        success: false,
        message: "Development idea not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: developmentIdea,
    });
  } catch (error) {
    console.error("Get development idea error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching development idea",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update a development idea
export const updateDevelopmentIdea = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullname, mobile, area, comment, typeOfIdea } = req.body;

    const developmentIdea = await DevelopmentIdea.findById(id);

    if (!developmentIdea) {
      res.status(404).json({
        success: false,
        message: "Development idea not found",
      });
      return;
    }

    // Update fields
    if (fullname) developmentIdea.fullname = fullname;
    if (mobile) developmentIdea.mobile = mobile;
    if (area) developmentIdea.area = area;
    if (comment) developmentIdea.comment = comment;
    if (typeOfIdea) developmentIdea.typeOfIdea = typeOfIdea;

    await developmentIdea.save();

    res.status(200).json({
      success: true,
      message: "Development idea updated successfully",
      data: developmentIdea,
    });
  } catch (error) {
    console.error("Update development idea error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating development idea",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete a development idea
export const deleteDevelopmentIdea = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const developmentIdea = await DevelopmentIdea.findByIdAndDelete(id);

    if (!developmentIdea) {
      res.status(404).json({
        success: false,
        message: "Development idea not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Development idea deleted successfully",
    });
  } catch (error) {
    console.error("Delete development idea error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting development idea",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
