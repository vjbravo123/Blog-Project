// File: app/api/admin/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully", success: true },
      { status: 200 }
    );

    // clear the auth cookie (adjust 'token' to whatever your cookie name is)
    response.cookies.delete("token");
    response.cookies.delete("admin-session"); // Delete any other potential cookies

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    );
  }
}