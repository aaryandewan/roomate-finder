import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Flat from "@/models/Flat";

export async function GET(req: NextRequest) {
  await dbConnect(); // Connect to the database
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const gender = searchParams.get("gender");
  const rent = searchParams.get("rent");

  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 });
  }

  const filters: any = { city: city };

  if (gender && gender != "Male/Female") {
    filters.genderPreference = gender;
  }

  if (rent) {
    filters.rent = { $lte: parseInt(rent) }; // Rent filter
  }

  try {
    const flats = await Flat.find(filters).exec(); // Fetch filtered flats

    return NextResponse.json({ flats });
  } catch (error) {
    console.error("Error fetching flats:", error);
    return NextResponse.json(
      { error: "Could not fetch flats" },
      { status: 500 }
    );
  }
}
