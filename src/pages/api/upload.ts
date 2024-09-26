// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";
import cloudinary from "../../lib/cloudinary";
import { Readable } from "stream";

const upload = multer({
  storage: multer.memoryStorage(),
});

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    res.status(501).json({ error: `Something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.array("files"));

apiRoute.post(async (req: any, res) => {
  const files = req.files;

  const uploadPromises = files.map((file: any) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "roommate-finder" },
        (error, result) => {
          if (result) {
            resolve(result.secure_url);
          } else {
            reject(error);
          }
        }
      );
      Readable.from(file.buffer).pipe(stream);
    });
  });

  try {
    const results = await Promise.all(uploadPromises);
    res.status(200).json({ urls: results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
