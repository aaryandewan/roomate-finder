// src/models/User.js
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  age?: number;
  gender?: "Male" | "Female" | "Other";
  location?: string;
  occupation?: string;
  hobbies?: string[];
  expectedRent?: number;
  profilePicture?: string;
  additionalPhotos?: string[];
  instagramHandle?: string;
  phoneNumber?: string;
  sentRequests?: Schema.Types.ObjectId[];
  receivedRequests?: Schema.Types.ObjectId[];
  connections?: Schema.Types.ObjectId[];
  isProfileComplete: boolean;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: false },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: false,
    },
    location: { type: String },
    occupation: { type: String },
    hobbies: [{ type: String }],
    expectedRent: { type: Number },
    profilePicture: { type: String },
    additionalPhotos: [{ type: String }],
    instagramHandle: { type: String },
    phoneNumber: { type: String },
    sentRequests: [{ type: Schema.Types.ObjectId, ref: "ConnectionRequest" }],
    receivedRequests: [
      { type: Schema.Types.ObjectId, ref: "ConnectionRequest" },
    ],
    connections: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isProfileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
