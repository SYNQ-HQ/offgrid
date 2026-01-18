import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const ALLOWED_EXTENSIONS = [".svg", ".png", ".jpg", ".jpeg", ".webp"];

export async function GET() {
  try {
    const partnersDir = path.join(process.cwd(), "public", "partners");
    const files = await fs.readdir(partnersDir);

    const imageInfo = files
      .filter((file) =>
        ALLOWED_EXTENSIONS.includes(path.extname(file).toLowerCase()),
      )
      .map((file) => {
        const name = path
          .basename(file, path.extname(file))
          .replace(/[-_]/g, " ")
          .replace(/\w\S*/g, (txt) =>
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          );
        return { imageUrl: `/partners/${file}`, name };
      });

    return NextResponse.json(imageInfo);
  } catch (error) {
    // If the directory doesn't exist or there's an error, return an empty array.
    if (error.code === 'ENOENT') {
      return NextResponse.json([]);
    }
    console.error("Failed to read partners directory:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
