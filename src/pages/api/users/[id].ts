// pages/api/users/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongodb";
import User, { IUser } from "../../../models/User";

type Data = {
  success: boolean;
  data?: IUser;
  error?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const user = await User.findById(id);

        if (!user) {
          return res
            .status(404)
            .json({ success: false, error: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
    case "PUT":
      try {
        const user = await User.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!user) {
          return res
            .status(404)
            .json({ success: false, error: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
    case "DELETE":
      try {
        const { deletedCount } = await User.deleteOne({ _id: id });

        if (deletedCount === 0) {
          return res
            .status(404)
            .json({ success: false, error: "User not found" });
        }

        res
          .status(200)
          .json({ success: true, message: "User deleted successfully" });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res
        .status(405)
        .json({ success: false, error: `Method ${method} Not Allowed` });
      break;
  }
}
