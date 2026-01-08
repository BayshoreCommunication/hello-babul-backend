import mongoose, { Document, Schema } from "mongoose";

export interface IVolunteer extends Document {
  fullname: string;
  fathername: string;
  mothername: string;
  dateofbirth: Date;
  mobile: string;
  education: string;
  area: string;
  media?: string; // URL to the uploaded image or video
  agree: boolean;
  viewed: boolean; // Track if admin has viewed this data
  createdAt: Date;
  updatedAt: Date;
}

const volunteerSchema = new Schema<IVolunteer>(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    fathername: {
      type: String,
      required: [true, "Father name is required"],
      trim: true,
    },
    mothername: {
      type: String,
      required: [true, "Mother name is required"],
      trim: true,
    },
    dateofbirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    education: {
      type: String,
      required: [true, "Education is required"],
      trim: true,
    },
    area: {
      type: String,
      required: [true, "Area is required"],
      trim: true,
    },
    media: {
      type: String,
      trim: true,
    },
    agree: {
      type: Boolean,
      required: [true, "Agreement is required"],
      default: false,
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
volunteerSchema.index({ fullname: "text", area: "text", education: "text" });

const Volunteer = mongoose.model<IVolunteer>("Volunteer", volunteerSchema);

export default Volunteer;
