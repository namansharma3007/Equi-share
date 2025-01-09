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
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userGroups = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        group: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            groupAdminId: true,
            members: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(userGroups, { status: 200 });
  } catch (error) {
    console.log("Error fetching group:", error);
    return NextResponse.json(
      { error: "Internal server Error" },
      { status: 500 }
    );
  }
}
