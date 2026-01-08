import mongoose, { Document, Schema } from "mongoose";

export interface IYourSuggest extends Document {
  fullname: string;
  mobile: string;
  area: string;
  typeOfSuggest: string;
  comment: string;
  media?: string; // URL to the uploaded image or video
  mediaType?: "image" | "video";
  viewed: boolean; // Track if admin has viewed this data
  createdAt: Date;
  updatedAt: Date;
}

const yourSuggestSchema = new Schema<IYourSuggest>(
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
    typeOfSuggest: {
      type: String,
      required: [true, "Type of suggest is required"],
      trim: true,
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
    },
    media: {
      type: String,
      trim: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
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
yourSuggestSchema.index({ fullname: "text", area: "text", comment: "text" });

const YourSuggest = mongoose.model<IYourSuggest>(
  "YourSuggest",
  yourSuggestSchema
);

export default YourSuggest;
