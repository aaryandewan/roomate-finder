// import { NextResponse } from "next/server";
// import aws from "aws-sdk";

// // Configure the AWS SDK with the credentials from your .env.local file
// const s3 = new aws.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// export async function GET() {
//   // Define the parameters for generating the signed URL
//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `profile-pictures/${Date.now()}`, // Generate a unique file name based on timestamp
//     Expires: 60, // URL expires in 60 seconds
//     ContentType: "image/jpeg", // Limit to image/jpeg for simplicity
//   };

//   // Generate the signed URL for uploading to S3
//   try {
//     const signedUrl = await s3.getSignedUrlPromise("putObject", params);
//     console.log("Mehak", signedUrl);
//     // Return the signed URL to the frontend
//     return NextResponse.json({
//       success: true,
//       url: signedUrl,
//     });
//   } catch (error) {
//     console.error("Error generating signed URL:", error);
//     return NextResponse.json({
//       success: false,
//       error: "Could not generate signed URL",
//     });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import aws from "aws-sdk";

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const numberOfImages = parseInt(searchParams.get("count") || "0");
  console.log("Aaryan", numberOfImages);
  if (numberOfImages <= 0) {
    return NextResponse.json(
      { error: "Invalid number of images" },
      { status: 400 }
    );
  }

  const urls = [];

  // Generate signed URLs based on the number of images passed in the query
  for (let i = 0; i < numberOfImages; i++) {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `flats/${Date.now()}_${i}`, // Create unique key for each image
      Expires: 60, // URL expiry time (1 minute)
      ContentType: "image/jpeg", // Adjust content type as needed
    };

    try {
      const signedUrl = await s3.getSignedUrlPromise("putObject", params);
      urls.push(signedUrl);
    } catch (error) {
      console.error("Error generating signed URL:", error);
      return NextResponse.json(
        { error: "Failed to generate signed URLs" },
        { status: 500 }
      );
    }
  }
  console.log("URLS BRO", urls);

  return NextResponse.json({ urls });
}
