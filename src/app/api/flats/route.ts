import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Flat from "@/models/Flat";

export async function GET(req: NextRequest) {
  await dbConnect(); // Connect to the database

  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 });
  }

  try {
    const flats = await Flat.find({ city: city }).exec(); // Fetch all flats in the given city
    console.log("majnu", flats);
    return NextResponse.json({ flats });
  } catch (error) {
    console.error("Error fetching flats:", error);
    return NextResponse.json(
      { error: "Could not fetch flats" },
      { status: 500 }
    );
  }
}
