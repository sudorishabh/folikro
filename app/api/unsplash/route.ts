import { NextRequest, NextResponse } from "next/server";
import { getPhotos, getRandomPhotos } from "@/server/unsplash";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const random = searchParams.get("random");
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  try {
    if (random === "true") {
      const photos = await getRandomPhotos(20);
      return NextResponse.json({ photos });
    }

    if (query) {
      const photos = await getPhotos(query, page, 20);
      return NextResponse.json({ photos });
    }

    // Default: fetch curated/popular photos using a broad editorial query
    const photos = await getPhotos("wallpaper landscape", page, 20);
    return NextResponse.json({ photos });
  } catch (err) {
    console.error("Unsplash API error:", err);
    return NextResponse.json(
      { photos: [], error: "Failed to fetch photos" },
      { status: 500 },
    );
  }
}
