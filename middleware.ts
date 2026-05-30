import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/admindashboard") &&
    !pathname.startsWith("/admindashboard/login")
  ) {
    const session = request.cookies.get("admin_session")?.value;
    if (!session || session !== process.env.ADMIN_PASSWORD) {
      return NextResponse.redirect(
        new URL("/admindashboard/login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admindashboard/:path*"],
};
