import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Flat from "@/models/Flat";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect(); // Connect to the database
  const { id } = params;

  try {
    const flat = await Flat.findById(id).exec();
    if (!flat) {
      return NextResponse.json({ error: "Flat not found" }, { status: 404 });
    }
    return NextResponse.json(flat);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch flat" },
      { status: 500 }
    );
  }
}
