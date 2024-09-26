// pages/api/users/[id.ts]
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import mongoose from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const user = await User.findById(id);
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res
        .status(405)
        .json({ success: false, error: `Method ${method} Not Allowed` });
      break;
  }
}
