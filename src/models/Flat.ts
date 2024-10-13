import mongoose, { Document, Schema, model, models } from "mongoose";

export interface IFlat extends Document {
  ownerId: string;
  city: string;
  rent: number;
  genderPreference: string;
  description: string;
  images: string[];
  postedBy: {
    name: string;
    contactNumber: string;
    email: string;
  };
}

const FlatSchema: Schema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    city: { type: String, required: true },
    rent: { type: Number, required: true },
    genderPreference: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    postedBy: {
      name: { type: String, required: true },
      contactNumber: { type: String, required: true },
      email: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default models.Flat || model<IFlat>("Flat", FlatSchema);
