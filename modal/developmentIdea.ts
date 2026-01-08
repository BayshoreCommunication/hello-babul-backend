import mongoose, { Document, Schema } from "mongoose";

export interface IDevelopmentIdea extends Document {
  fullname: string;
  mobile: string;
  area: string;
  comment: string;
  typeOfIdea: string;
  viewed: boolean; // Track if admin has viewed this data
  createdAt: Date;
  updatedAt: Date;
}

const developmentIdeaSchema = new Schema<IDevelopmentIdea>(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    area: {
      type: String,
      required: [true, "Area is required"],
      trim: true,
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
    },
    typeOfIdea: {
      type: String,
      required: [true, "Type of idea is required"],
      trim: true,
    },
    viewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better search performance
developmentIdeaSchema.index({ fullname: "text", area: "text", comment: "text", typeOfIdea: "text" });

const DevelopmentIdea = mongoose.model<IDevelopmentIdea>(
  "DevelopmentIdea",
  developmentIdeaSchema
);

export default DevelopmentIdea;
