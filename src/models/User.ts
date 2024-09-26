// models/User.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    occupation: { type: String },
    hobbies: [{ type: String }],
    expectedRent: { type: Number, required: true },
    profilePicture: { type: String, required: true },
    additionalPhotos: [{ type: String }],
    instagramHandle: { type: String },
    phoneNumber: { type: String },
    sentRequests: [{ type: Schema.Types.ObjectId, ref: "ConnectionRequest" }],
    receivedRequests: [
      { type: Schema.Types.ObjectId, ref: "ConnectionRequest" },
    ],
    connections: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
