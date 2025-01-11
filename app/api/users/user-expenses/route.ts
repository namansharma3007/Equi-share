import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    const userExpenses = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        expenses: true,
      },
    });

    return NextResponse.json({ userExpenses }, { status: 200 });
  } catch (error) {
    console.log("Error fetching user expenses:", error);
    return NextResponse.json(
      { message: "Internal server Error" },
      { status: 500 }
    );
  }
}
