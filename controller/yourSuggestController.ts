import { Request, Response } from "express";
import YourSuggest from "../modal/yourSuggest";
import { uploadToDigitalOcean, getMediaType } from "../utils/uploadToDigitalOcean";

// Create a new suggestion with media upload
export const createYourSuggest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { fullname, mobile, area, typeOfSuggest, comment } = req.body;
    const file = req.file;

    // Validation
    if (!fullname || !mobile || !area || !typeOfSuggest || !comment) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields: fullname, mobile, area, typeOfSuggest, and comment",
      });
      return;
    }

    let mediaUrl: string | undefined;
    let mediaType: "image" | "video" | undefined;

    // Upload file to Digital Ocean if provided
    if (file) {
      const uploadResult = await uploadToDigitalOcean(file, "suggestions");

      if (!uploadResult.success) {
        res.status(500).json({
          success: false,
          message: "Error uploading media file",
          error: uploadResult.error,
        });
        return;
      }

      mediaUrl = uploadResult.url;
      mediaType = getMediaType(file.mimetype) || undefined;
    }

    // Create new suggestion
    const yourSuggest = await YourSuggest.create({
      fullname,
      mobile,
      area,
      typeOfSuggest,
      comment,
      media: mediaUrl,
      mediaType,
    });

    res.status(201).json({
      success: true,
      message: "Suggestion created successfully",
      data: yourSuggest,
    });
  } catch (error) {
    console.error("Create suggestion error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating suggestion",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all suggestions with pagination and search
export const getYourSuggests = async (
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
          { typeOfSuggest: { $regex: search, $options: "i" } },
          { comment: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Get total count for pagination
    const total = await YourSuggest.countDocuments(query);

    // Get paginated results
    const yourSuggests = await YourSuggest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: yourSuggests,
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
    console.error("Get suggestions error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching suggestions",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get a single suggestion by ID
export const getYourSuggestById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const yourSuggest = await YourSuggest.findById(id);

    if (!yourSuggest) {
      res.status(404).json({
        success: false,
        message: "Suggestion not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: yourSuggest,
    });
  } catch (error) {
    console.error("Get suggestion error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching suggestion",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update a suggestion
export const updateYourSuggest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullname, mobile, area, typeOfSuggest, comment } = req.body;
    const file = req.file;

    const yourSuggest = await YourSuggest.findById(id);

    if (!yourSuggest) {
      res.status(404).json({
        success: false,
        message: "Suggestion not found",
      });
      return;
    }

    // Update text fields
    if (fullname) yourSuggest.fullname = fullname;
    if (mobile) yourSuggest.mobile = mobile;
    if (area) yourSuggest.area = area;
    if (typeOfSuggest) yourSuggest.typeOfSuggest = typeOfSuggest;
    if (comment) yourSuggest.comment = comment;

    // Upload new media if provided
    if (file) {
      const uploadResult = await uploadToDigitalOcean(file, "suggestions");

      if (!uploadResult.success) {
        res.status(500).json({
          success: false,
          message: "Error uploading media file",
          error: uploadResult.error,
        });
        return;
      }

      yourSuggest.media = uploadResult.url;
      yourSuggest.mediaType = getMediaType(file.mimetype) || undefined;
    }

    await yourSuggest.save();

    res.status(200).json({
      success: true,
      message: "Suggestion updated successfully",
      data: yourSuggest,
    });
  } catch (error) {
    console.error("Update suggestion error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating suggestion",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete a suggestion
export const deleteYourSuggest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const yourSuggest = await YourSuggest.findByIdAndDelete(id);

    if (!yourSuggest) {
      res.status(404).json({
        success: false,
        message: "Suggestion not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Suggestion deleted successfully",
    });
  } catch (error) {
    console.error("Delete suggestion error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting suggestion",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
