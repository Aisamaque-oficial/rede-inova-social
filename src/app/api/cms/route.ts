import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CMS_FILE_PATH = path.join(process.cwd(), "src/lib/cms-store.json");

export async function GET() {
  try {
    if (!fs.existsSync(CMS_FILE_PATH)) {
      return NextResponse.json({});
    }
    const data = fs.readFileSync(CMS_FILE_PATH, "utf8");
    return NextResponse.json(JSON.parse(data || "{}"));
  } catch (error) {
    console.error("Error reading CMS file:", error);
    return NextResponse.json({});
  }
}

export async function POST(request: Request) {
  try {
    const { key, value } = await request.json();
    if (!key) return NextResponse.json({ error: "No key provided" }, { status: 400 });

    let data = <any>{};
    if (fs.existsSync(CMS_FILE_PATH)) {
      try {
        data = JSON.parse(fs.readFileSync(CMS_FILE_PATH, "utf8") || "{}");
      } catch (e) {
        data = {};
      }
    }

    data[key] = value;
    fs.writeFileSync(CMS_FILE_PATH, JSON.stringify(data, null, 2), "utf8");

    return NextResponse.json({ success: true, key, value });
  } catch (error) {
    console.error("Error writing CMS file:", error);
    return NextResponse.json({ error: "Failed to write to CMS store" }, { status: 500 });
  }
}
