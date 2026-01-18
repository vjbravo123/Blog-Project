import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/Users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Ideally, put this in your .env file
const JWT_SECRET = process.env.JWT_SECRET || "change-this-to-a-secure-secret-key";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Basic Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // 2. Find User
    // We must explicitly .select("+password") because we set select: false in the User Model
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 3. Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 4. Check Account Status (If you added isActive field previously)
    if (user.isActive === false) {
      return NextResponse.json(
        { message: "Account is disabled. Please contact support." },
        { status: 403 }
      );
    }

    // 5. Role Check (Protect Admin Panel)
    // Prevent standard 'users' from logging into the dashboard
    const allowedRoles = ["admin", "superadmin", "author", "editor"];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { message: "Access denied. Insufficient permissions." },
        { status: 403 }
      );
    }

    // 6. Generate JWT Token
    // This payload can be accessed via the token later
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
        image: user.image
      },
      JWT_SECRET,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    // 7. Prepare Response with HTTP-Only Cookie
    const response = NextResponse.json(
      { 
        success: true,
        message: "Login successful", 
        user: { 
          name: user.name, 
          role: user.role, 
          image: user.image 
        } 
      },
      { status: 200 }
    );

    // Secure Cookie Settings
    response.cookies.set("token", token, {
      httpOnly: true, // Prevents JavaScript access (XSS protection)
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // CSRF protection
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    // 8. Update Last Login (Fire and forget, don't block response)
    User.findByIdAndUpdate(user._id, { lastLogin: new Date() }).exec();

    return response;

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}