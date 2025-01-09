import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function GET(req: NextRequest) {
  try {
    const tokenCookie = req.cookies.get("token");
    
    if (!tokenCookie) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    
    const decoded = jwt.verify(tokenCookie.value, secretKey);

    if(!decoded) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "User authenticated", decoded },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while checking session:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
