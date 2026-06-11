import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default auth((request: NextRequest & { auth: unknown }) => {
  const isLoggedIn = Boolean(request.auth);
  const pathname = request.nextUrl.pathname;
  const isAdminApi = pathname.startsWith("/api/admin");

  if (isAdminApi && !isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin",
    "/admin/((?!login$).*)",
    "/api/admin/:path*",
  ],
};
