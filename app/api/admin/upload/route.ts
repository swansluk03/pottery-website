import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getUploadSignature } from "@/lib/cloudinary";

export async function POST() {
  const authResult = await requireAdmin();
  if (authResult.error) {
    return authResult.error;
  }

  const signature = getUploadSignature();

  if (!signature) {
    return NextResponse.json(
      {
        error:
          "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json(signature);
}
