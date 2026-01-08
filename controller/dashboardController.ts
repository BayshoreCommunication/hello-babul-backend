import { Request, Response } from "express";
import Volunteer from "../modal/volunteer";
import YourOpinion from "../modal/yourOpinion";
import YourSuggest from "../modal/yourSuggest";
import DevelopmentIdea from "../modal/developmentIdea";

// Dashboard overview - Get total counts of all submissions
export const getDashboardOverview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get counts in parallel for better performance
    const [totalVolunteers, totalOpinions, totalSuggestions, totalDevelopmentIdeas] =
      await Promise.all([
        Volunteer.countDocuments(),
        YourOpinion.countDocuments(),
        YourSuggest.countDocuments(),
        DevelopmentIdea.countDocuments(),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalVolunteers,
        totalOpinions,
        totalSuggestions,
        totalDevelopmentIdeas,
        totalSubmissions:
          totalVolunteers + totalOpinions + totalSuggestions + totalDevelopmentIdeas,
      },
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard overview",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all data from all collections with pagination and search
export const getAllData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const type = req.query.type as string; // Optional: filter by type (volunteer, opinion, suggestion, developmentIdea)
    const skip = (page - 1) * limit;

    let allData: any[] = [];
    let total = 0;

    // Build search query
    const searchQuery = search
      ? {
          $or: [
            { fullname: { $regex: search, $options: "i" } },
            { mobile: { $regex: search, $options: "i" } },
            { area: { $regex: search, $options: "i" } },
            { typeOfOpinion: { $regex: search, $options: "i" } },
            { typeOfSuggest: { $regex: search, $options: "i" } },
            { comment: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // If type filter is specified, fetch only that type
    if (type) {
      switch (type) {
        case "volunteer":
          const volunteers = await Volunteer.find(searchQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
          total = await Volunteer.countDocuments(searchQuery);
          allData = volunteers.map((item) => ({
            ...item.toObject(),
            type: "volunteer",
          }));
          break;

        case "opinion":
          const opinions = await YourOpinion.find(searchQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
          total = await YourOpinion.countDocuments(searchQuery);
          allData = opinions.map((item) => ({
            ...item.toObject(),
            type: "opinion",
          }));
          break;

        case "suggestion":
          const suggestions = await YourSuggest.find(searchQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
          total = await YourSuggest.countDocuments(searchQuery);
          allData = suggestions.map((item) => ({
            ...item.toObject(),
            type: "suggestion",
          }));
          break;

        case "developmentIdea":
          const ideas = await DevelopmentIdea.find(searchQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
          total = await DevelopmentIdea.countDocuments(searchQuery);
          allData = ideas.map((item) => ({
            ...item.toObject(),
            type: "developmentIdea",
          }));
          break;

        default:
          res.status(400).json({
            success: false,
            message: "Invalid type. Must be: volunteer, opinion, suggestion, or developmentIdea",
          });
          return;
      }
    } else {
      // Fetch all data from all collections
      const [volunteers, opinions, suggestions, ideas] = await Promise.all([
        Volunteer.find(searchQuery).sort({ createdAt: -1 }),
        YourOpinion.find(searchQuery).sort({ createdAt: -1 }),
        YourSuggest.find(searchQuery).sort({ createdAt: -1 }),
        DevelopmentIdea.find(searchQuery).sort({ createdAt: -1 }),
      ]);

      // Combine all data with type identifier
      allData = [
        ...volunteers.map((item) => ({ ...item.toObject(), type: "volunteer" })),
        ...opinions.map((item) => ({ ...item.toObject(), type: "opinion" })),
        ...suggestions.map((item) => ({ ...item.toObject(), type: "suggestion" })),
        ...ideas.map((item) => ({ ...item.toObject(), type: "developmentIdea" })),
      ];

      // Sort by createdAt
      allData.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Descending order (newest first)
      });

      total = allData.length;

      // Apply pagination after combining
      allData = allData.slice(skip, skip + limit);
    }

    res.status(200).json({
      success: true,
      data: allData,
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
    console.error("Get all data error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get details by ID and type
export const getDetailsByIdAndType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    if (!type) {
      res.status(400).json({
        success: false,
        message: "Type is required. Must be: volunteer, opinion, suggestion, or developmentIdea",
      });
      return;
    }

    let data: any = null;

    switch (type) {
      case "volunteer":
        data = await Volunteer.findById(id);
        break;

      case "opinion":
        data = await YourOpinion.findById(id);
        break;

      case "suggestion":
        data = await YourSuggest.findById(id);
        break;

      case "developmentIdea":
        data = await DevelopmentIdea.findById(id);
        break;

      default:
        res.status(400).json({
          success: false,
          message: "Invalid type. Must be: volunteer, opinion, suggestion, or developmentIdea",
        });
        return;
    }

    if (!data) {
      res.status(404).json({
        success: false,
        message: `${type} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        ...data.toObject(),
        type,
      },
    });
  } catch (error) {
    console.error("Get details error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching details",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
