import { NextResponse } from "next/server";
import aws from "aws-sdk";

// Configure the AWS SDK with the credentials from your .env.local file
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function GET() {
  // Define the parameters for generating the signed URL
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `profile-pictures/${Date.now()}`, // Generate a unique file name based on timestamp
    Expires: 60, // URL expires in 60 seconds
    ContentType: "image/jpeg", // Limit to image/jpeg for simplicity
  };

  // Generate the signed URL for uploading to S3
  try {
    const signedUrl = await s3.getSignedUrlPromise("putObject", params);

    // Return the signed URL to the frontend
    return NextResponse.json({
      success: true,
      url: signedUrl,
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json({
      success: false,
      error: "Could not generate signed URL",
    });
  }
}
