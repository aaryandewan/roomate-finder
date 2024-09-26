// models/ConnectionRequest.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    message: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.ConnectionRequest ||
  mongoose.model("ConnectionRequest", connectionRequestSchema);
