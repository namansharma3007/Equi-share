import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import jwt, { type JwtPayload } from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET;

export async function GET(req: NextRequest) {
  try {
    const tokenCookie = req.cookies.get("token");

    if (!tokenCookie) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!secretKey) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(tokenCookie.value, secretKey);

    const decodedData = decoded as JwtPayload;

    if (!decoded) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decodedData.userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User authenticated", userId: decodedData.userId },
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
