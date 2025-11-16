import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  // console.log("Middleware - token:", token);
  // console.log("Middleware - role:", role);
  // ---- ADMIN GUARD ----
  if (pathname.startsWith("/admin")) {
    // ❗ Nếu đang ở trang /admin/login thì KHÔNG được redirect
    if (pathname === "/admin-login") return NextResponse.next();

    // Nếu chưa login → đá về admin-login
    if (!token) {
      return NextResponse.redirect(
        new URL("/admin-login?err=need-login", request.url)
      );
    }

    // Token có nhưng sai role
    if (role !== "Admin") {
      return NextResponse.redirect(
        new URL("/admin-login?err=wrong-role", request.url)
      );
    }
  }

  // ---- STUDENT GUARD ----
  if (pathname.startsWith("/student")) {
    if (pathname === "/login" || pathname === "/student/login") {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.redirect(
        new URL("/login?err=need-login", request.url)
      );
    }
    if (role !== "Student") {
      return NextResponse.redirect(
        new URL("/login?err=wrong-role", request.url)
      );
    }
  }

  // ---- TEACHER GUARD ----
  if (pathname.startsWith("/teacher")) {
    if (pathname === "/login" || pathname === "/teacher/login") {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.redirect(
        new URL("/login?err=need-login", request.url)
      );
    }
    if (role !== "Teacher") {
      return NextResponse.redirect(
        new URL("/login?err=wrong-role", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/teacher/:path*"],
};
