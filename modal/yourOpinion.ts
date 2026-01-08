import mongoose, { Document, Schema } from "mongoose";

export interface IYourOpinion extends Document {
  fullname: string;
  mobile: string;
  area: string;
  typeOfOpinion: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const yourOpinionSchema = new Schema<IYourOpinion>(
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
    typeOfOpinion: {
      type: String,
      required: [true, "Type of opinion is required"],
      trim: true,
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better search performance
yourOpinionSchema.index({ fullname: "text", area: "text", comment: "text" });

const YourOpinion = mongoose.model<IYourOpinion>(
  "YourOpinion",
  yourOpinionSchema
);

export default YourOpinion;
