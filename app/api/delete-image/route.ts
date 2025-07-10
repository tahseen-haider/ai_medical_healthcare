import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { public_id } = await req.json();

  if (!public_id) {
    return NextResponse.json({ error: "Missing public_id" }, { status: 400 });
  }

  const cloudinary = require("cloudinary").v2;

  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Failed to delete image:", error);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}