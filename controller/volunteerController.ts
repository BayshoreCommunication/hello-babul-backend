import { Request, Response } from "express";
import Volunteer from "../modal/volunteer";
import { uploadToDigitalOcean, getMediaType } from "../utils/uploadToDigitalOcean";

// Create a new volunteer with media upload
export const createVolunteer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { fullname, fathername, mothername, dateofbirth, mobile, education, area, agree } = req.body;
    const file = req.file;

    // Validation
    if (!fullname || !fathername || !mothername || !dateofbirth || !mobile || !education || !area) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
      return;
    }

    // Check agreement
    if (agree !== "true" && agree !== true) {
      res.status(400).json({
        success: false,
        message: "You must agree to the terms",
      });
      return;
    }

    // Validate and parse date
    const parsedDate = new Date(dateofbirth);
    if (isNaN(parsedDate.getTime())) {
      res.status(400).json({
        success: false,
        message: "Invalid date format. Please use YYYY-MM-DD format (e.g., 2000-01-15)",
      });
      return;
    }

    let mediaUrl: string | undefined;

    // Upload file to Digital Ocean if provided
    if (file) {
      const uploadResult = await uploadToDigitalOcean(file, "volunteers");

      if (!uploadResult.success) {
        res.status(500).json({
          success: false,
          message: "Error uploading media file",
          error: uploadResult.error,
        });
        return;
      }

      mediaUrl = uploadResult.url;
    }

    // Create new volunteer
    const volunteer = await Volunteer.create({
      fullname,
      fathername,
      mothername,
      dateofbirth: parsedDate,
      mobile,
      education,
      area,
      media: mediaUrl,
      agree: true,
    });

    res.status(201).json({
      success: true,
      message: "Volunteer registered successfully",
      data: volunteer,
    });
  } catch (error) {
    console.error("Create volunteer error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating volunteer",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all volunteers with pagination and search
export const getVolunteers = async (
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
          { fathername: { $regex: search, $options: "i" } },
          { mothername: { $regex: search, $options: "i" } },
          { mobile: { $regex: search, $options: "i" } },
          { education: { $regex: search, $options: "i" } },
          { area: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Get total count for pagination
    const total = await Volunteer.countDocuments(query);

    // Get paginated results
    const volunteers = await Volunteer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: volunteers,
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
    console.error("Get volunteers error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching volunteers",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get a single volunteer by ID
export const getVolunteerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const volunteer = await Volunteer.findById(id);

    if (!volunteer) {
      res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: volunteer,
    });
  } catch (error) {
    console.error("Get volunteer error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching volunteer",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update a volunteer
export const updateVolunteer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullname, fathername, mothername, dateofbirth, mobile, education, area, agree } = req.body;
    const file = req.file;

    const volunteer = await Volunteer.findById(id);

    if (!volunteer) {
      res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
      return;
    }

    // Update text fields
    if (fullname) volunteer.fullname = fullname;
    if (fathername) volunteer.fathername = fathername;
    if (mothername) volunteer.mothername = mothername;
    if (dateofbirth) {
      const parsedDate = new Date(dateofbirth);
      if (isNaN(parsedDate.getTime())) {
        res.status(400).json({
          success: false,
          message: "Invalid date format. Please use YYYY-MM-DD format (e.g., 2000-01-15)",
        });
        return;
      }
      volunteer.dateofbirth = parsedDate;
    }
    if (mobile) volunteer.mobile = mobile;
    if (education) volunteer.education = education;
    if (area) volunteer.area = area;
    if (agree !== undefined) volunteer.agree = agree === "true" || agree === true;

    // Upload new media if provided
    if (file) {
      const uploadResult = await uploadToDigitalOcean(file, "volunteers");

      if (!uploadResult.success) {
        res.status(500).json({
          success: false,
          message: "Error uploading media file",
          error: uploadResult.error,
        });
        return;
      }

      volunteer.media = uploadResult.url;
    }

    await volunteer.save();

    res.status(200).json({
      success: true,
      message: "Volunteer updated successfully",
      data: volunteer,
    });
  } catch (error) {
    console.error("Update volunteer error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating volunteer",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete a volunteer
export const deleteVolunteer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const volunteer = await Volunteer.findByIdAndDelete(id);

    if (!volunteer) {
      res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Volunteer deleted successfully",
    });
  } catch (error) {
    console.error("Delete volunteer error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting volunteer",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
